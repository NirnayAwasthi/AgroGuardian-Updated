import os

# BASE_DIR = backend/ (two levels up from app/config.py)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ─── Disease Detection Model ─────────────────────────────────────────────────
# Path: backend/model/Plant_Disease_Detection/plant_disease_efficientnetb4.h5
DISEASE_MODEL_PATH = os.path.join(
    BASE_DIR,
    "model",
    "Plant_Disease_Detection",
    "plant_disease_efficientnetb4.h5"
)

# ─── Model Input Settings ─────────────────────────────────────────────────────
IMG_SIZE = 380          # EfficientNetB4 required input size (must NOT be changed)
IMG_CHANNELS = 3        # RGB

# ─── Prediction Settings ──────────────────────────────────────────────────────
TOP_K = 3               # Number of top predictions to return
CONFIDENCE_THRESHOLD = 5.0   # Minimum % confidence to include in response

# ─── API Settings ─────────────────────────────────────────────────────────────
MAX_UPLOAD_SIZE_MB = 10
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}
