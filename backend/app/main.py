import io
import os
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError

from app.config import MAX_UPLOAD_SIZE_MB, ALLOWED_EXTENSIONS
from app.disease.model_loader import load_disease_model
from app.disease.predict import predict_disease

# ── Logging setup ─────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s"
)
logger = logging.getLogger(__name__)

# ── Global model reference ────────────────────────────────────────────────────
disease_model = None


# ── Lifespan: load model once at startup ─────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    global disease_model
    logger.info("Starting AgroGuardian API — loading model...")
    disease_model = load_disease_model()
    logger.info("Model ready. API is live.")
    yield
    logger.info("Shutting down AgroGuardian API.")


# ── App init ──────────────────────────────────────────────────────────────────
app = FastAPI(
    title="AgroGuardian API",
    description="Plant Disease Detection using EfficientNetB4 (PlantVillage, 38 classes, 97.66% accuracy)",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # Restrict to your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/", tags=["Health"])
def root():
    return {"message": "AgroGuardian API is running", "status": "ok"}


@app.get("/health", tags=["Health"])
def health_check():
    """Quick health check — also tells frontend if model is loaded."""
    return {
        "status": "ok",
        "model_loaded": disease_model is not None,
    }


@app.post("/disease/predict", tags=["Disease Detection"])
async def disease_prediction(file: UploadFile = File(...)):
    """
    Predict plant disease from a leaf image.

    - Accepts: JPEG, PNG, BMP, WEBP
    - Max size: 10 MB
    - Returns: top-3 predictions with plant name, condition, confidence %
    """

    # ── 1. Validate file extension ────────────────────────────────────────────
    ext = os.path.splitext(file.filename or "")[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # ── 2. Read & size-check ──────────────────────────────────────────────────
    contents = await file.read()
    size_mb   = len(contents) / (1024 * 1024)
    if size_mb > MAX_UPLOAD_SIZE_MB:
        raise HTTPException(
            status_code=413,
            detail=f"File too large ({size_mb:.1f} MB). Maximum allowed: {MAX_UPLOAD_SIZE_MB} MB."
        )

    # ── 3. Decode image ───────────────────────────────────────────────────────
    try:
        image = Image.open(io.BytesIO(contents)).convert("RGB")
    except UnidentifiedImageError:
        raise HTTPException(
            status_code=422,
            detail="Cannot decode image. Please upload a valid image file."
        )

    # ── 4. Guard: model must be loaded ────────────────────────────────────────
    if disease_model is None:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Please try again shortly or restart the server."
        )

    # ── 5. Run prediction ─────────────────────────────────────────────────────
    try:
        result = predict_disease(disease_model, image)
    except Exception as e:
        logger.error(f"Prediction error: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )

    # ── 6. Return structured response ─────────────────────────────────────────
    return {
        "status":           "success",
        "plant":            result["plant"],
        "condition":        result["condition"],
        "is_healthy":       result["is_healthy"],
        "confidence":       result["confidence"],
        "top_predictions":  result["top_predictions"],
        "warning":          result["warning"],
    }
