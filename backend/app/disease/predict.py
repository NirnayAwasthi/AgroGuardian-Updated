import numpy as np
import logging
from PIL import Image
from typing import List, Dict, Any

import tensorflow as tf

from app.config import TOP_K, CONFIDENCE_THRESHOLD
from app.disease.classes import CLASS_NAMES, CLASS_META
from app.disease.preprocess import preprocess_image

logger = logging.getLogger(__name__)


def predict_disease(model: tf.keras.Model, image: Image.Image) -> Dict[str, Any]:
    """
    Run plant disease prediction on a PIL Image.

    Args:
        model: Loaded EfficientNetB4 Keras model
        image: PIL.Image (any size/mode — preprocessing handles it)

    Returns:
        dict with keys:
            - top_predictions: list of top-K results (class, display info, confidence)
            - is_healthy: bool — True if top prediction is a healthy class
            - plant:  str — most likely plant species
            - warning: str or None — low-confidence warning message
    """

    # ── Preprocess ────────────────────────────────────────────────────────────
    processed = preprocess_image(image)   # shape: (1, 380, 380, 3)

    # ── Inference ─────────────────────────────────────────────────────────────
    raw_preds = model.predict(processed, verbose=0)[0]   # shape: (38,)

    # ── Top-K extraction ─────────────────────────────────────────────────────
    top_indices = raw_preds.argsort()[-TOP_K:][::-1]     # highest confidence first

    top_predictions = []
    for idx in top_indices:
        class_name  = CLASS_NAMES[idx]
        confidence  = float(raw_preds[idx]) * 100        # convert to percentage
        meta        = CLASS_META.get(class_name, {})

        # Skip results below confidence threshold (very uncertain)
        if confidence < CONFIDENCE_THRESHOLD:
            continue

        top_predictions.append({
            "class_raw":    class_name,                          # e.g. "Tomato___Early_blight"
            "plant":        meta.get("plant", "Unknown"),        # e.g. "Tomato"
            "condition":    meta.get("condition", class_name),   # e.g. "Early Blight"
            "is_healthy":   meta.get("is_healthy", False),
            "confidence":   round(confidence, 2),                # e.g. 94.37
        })

    # ── Fallback: if all predictions below threshold ──────────────────────────
    if not top_predictions:
        best_idx  = int(raw_preds.argmax())
        class_name = CLASS_NAMES[best_idx]
        meta       = CLASS_META.get(class_name, {})
        top_predictions.append({
            "class_raw":  class_name,
            "plant":      meta.get("plant", "Unknown"),
            "condition":  meta.get("condition", class_name),
            "is_healthy": meta.get("is_healthy", False),
            "confidence": round(float(raw_preds[best_idx]) * 100, 2),
        })

    # ── Top result info for fast frontend display ─────────────────────────────
    top_result   = top_predictions[0]
    top_conf     = top_result["confidence"]
    is_healthy   = top_result["is_healthy"]

    # ── Low confidence warning ────────────────────────────────────────────────
    warning = None
    if top_conf < 50.0:
        warning = (
            "Low confidence prediction. The image may be unclear, "
            "not a plant leaf, or the disease may not be in the training dataset."
        )

    logger.info(
        f"[Predict] Top: {top_result['plant']} — {top_result['condition']} "
        f"({top_conf:.1f}%) | healthy={is_healthy}"
    )

    return {
        "top_predictions":  top_predictions,
        "is_healthy":        is_healthy,
        "plant":             top_result["plant"],
        "condition":         top_result["condition"],
        "confidence":        top_conf,
        "warning":           warning,
    }
