import os
import logging
import numpy as np
import tensorflow as tf

from app.config import DISEASE_MODEL_PATH, IMG_SIZE

logger = logging.getLogger(__name__)


def load_disease_model() -> tf.keras.Model:
    """
    Load the EfficientNetB4 plant disease model from disk.

    Steps:
        1. Verify the .h5 file exists at the configured path
        2. Load via tf.keras.models.load_model()
        3. Run a warm-up inference (prevents slow first prediction in production)
        4. Log model summary line for quick sanity check

    Returns:
        Loaded tf.keras.Model, ready for inference.

    Raises:
        FileNotFoundError: if model file is missing at DISEASE_MODEL_PATH
        RuntimeError: if model fails to load (corrupt file, version mismatch)
    """

    # ── 1. Check file exists ─────────────────────────────────────────────────
    if not os.path.exists(DISEASE_MODEL_PATH):
        raise FileNotFoundError(
            f"\n[ModelLoader] Model file NOT found at:\n  {DISEASE_MODEL_PATH}\n"
            f"Please ensure plant_disease_efficientnetb4.h5 is placed in:\n"
            f"  backend/model/Plant_Disease_Detection/"
        )

    logger.info(f"[ModelLoader] Loading model from: {DISEASE_MODEL_PATH}")

    # ── 2. Load model ────────────────────────────────────────────────────────
    try:
        model = tf.keras.models.load_model(DISEASE_MODEL_PATH)
    except Exception as e:
        raise RuntimeError(
            f"[ModelLoader] Failed to load model: {e}\n"
            f"Check TensorFlow version compatibility (model was saved with TF 2.x)"
        )

    # ── 3. Warm-up inference (dummy pass) ─────────────────────────────────────
    # Avoids slow first real prediction due to TF graph compilation
    try:
        dummy_input = np.zeros((1, IMG_SIZE, IMG_SIZE, 3), dtype=np.float32)
        _ = model.predict(dummy_input, verbose=0)
        logger.info("[ModelLoader] Model warm-up complete.")
    except Exception as e:
        logger.warning(f"[ModelLoader] Warm-up failed (non-critical): {e}")

    # ── 4. Log summary ────────────────────────────────────────────────────────
    total_params = model.count_params()
    logger.info(
        f"[ModelLoader] Model loaded successfully. "
        f"Input: {model.input_shape} | Output: {model.output_shape} | "
        f"Params: {total_params:,}"
    )

    return model
