import numpy as np
from PIL import Image, ImageOps
import tensorflow as tf
from tensorflow.keras.applications.efficientnet import preprocess_input

from app.config import IMG_SIZE


def preprocess_image(image: Image.Image) -> np.ndarray:
    """
    Prepare a PIL Image for EfficientNetB4 inference.

    Pipeline (must match training exactly):
        1. Ensure RGB — eliminates alpha channel or grayscale issues
        2. Auto-orient via EXIF — prevents upside-down/rotated predictions
        3. Resize to 380×380 using LANCZOS (high-quality downsampling)
        4. Cast to float32
        5. Apply EfficientNet-specific preprocess_input
           → scales pixel values to [-1, 1] range
           → NOT the same as /255 — must use this exact function
        6. Add batch dimension → shape (1, 380, 380, 3)

    Args:
        image: PIL.Image in any mode/size (from upload or camera frame)

    Returns:
        np.ndarray of shape (1, 380, 380, 3), dtype float32, ready for model.predict()
    """

    # Step 1: Force RGB (handles RGBA, L, P palette images, etc.)
    if image.mode != "RGB":
        image = image.convert("RGB")

    # Step 2: Fix EXIF orientation (phone camera images often have rotation metadata)
    image = ImageOps.exif_transpose(image)

    # Step 3: Resize to EfficientNetB4 input size using high-quality resampling
    image = image.resize((IMG_SIZE, IMG_SIZE), Image.LANCZOS)

    # Step 4: Convert to float32 numpy array
    img_array = np.array(image, dtype=np.float32)

    # Step 5: EfficientNet-specific preprocessing (scales to [-1, 1])
    # IMPORTANT: Do NOT use img / 255.0 — this will give wrong results
    img_array = preprocess_input(img_array)

    # Step 6: Add batch dimension → (1, 380, 380, 3)
    img_array = np.expand_dims(img_array, axis=0)

    return img_array


def preprocess_image_bytes(raw_bytes: bytes) -> np.ndarray:
    """
    Convenience wrapper: decode raw image bytes → preprocessed array.
    Use this in the API endpoint for cleaner code.

    Args:
        raw_bytes: raw file contents from UploadFile.read()

    Returns:
        np.ndarray of shape (1, 380, 380, 3)
    """
    import io
    image = Image.open(io.BytesIO(raw_bytes))
    return preprocess_image(image)
