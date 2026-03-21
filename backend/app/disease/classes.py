# ─────────────────────────────────────────────────────────────────────────────
# PlantVillage Dataset — 38 Class Labels
#
# CRITICAL: These names MUST match the exact alphabetical directory order
# that flow_from_directory() used during training. Any mismatch causes
# wrong labels to be returned for correct predictions.
#
# Source: PlantVillage dataset (color, unaugmented)
# Covers: 14 crop species × healthy + diseased variants = 38 classes
# ─────────────────────────────────────────────────────────────────────────────

CLASS_NAMES = [
    "Apple___Apple_scab",                                           # 0
    "Apple___Black_rot",                                            # 1
    "Apple___Cedar_apple_rust",                                     # 2
    "Apple___healthy",                                              # 3
    "Blueberry___healthy",                                          # 4
    "Cherry_(including_sour)___Powdery_mildew",                     # 5
    "Cherry_(including_sour)___healthy",                            # 6
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",           # 7
    "Corn_(maize)___Common_rust_",                                  # 8
    "Corn_(maize)___Northern_Leaf_Blight",                          # 9
    "Corn_(maize)___healthy",                                       # 10
    "Grape___Black_rot",                                            # 11
    "Grape___Esca_(Black_Measles)",                                 # 12
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",                   # 13
    "Grape___healthy",                                              # 14
    "Orange___Haunglongbing_(Citrus_greening)",                     # 15
    "Peach___Bacterial_spot",                                       # 16
    "Peach___healthy",                                              # 17
    "Pepper,_bell___Bacterial_spot",                                # 18
    "Pepper,_bell___healthy",                                       # 19
    "Potato___Early_blight",                                        # 20
    "Potato___Late_blight",                                         # 21
    "Potato___healthy",                                             # 22
    "Raspberry___healthy",                                          # 23
    "Soybean___healthy",                                            # 24
    "Squash___Powdery_mildew",                                      # 25
    "Strawberry___Leaf_scorch",                                     # 26
    "Strawberry___healthy",                                         # 27
    "Tomato___Bacterial_spot",                                      # 28
    "Tomato___Early_blight",                                        # 29
    "Tomato___Late_blight",                                         # 30
    "Tomato___Leaf_Mold",                                           # 31
    "Tomato___Septoria_leaf_spot",                                  # 32
    "Tomato___Spider_mites Two-spotted_spider_mite",                # 33
    "Tomato___Target_Spot",                                         # 34
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",                       # 35
    "Tomato___Tomato_mosaic_virus",                                 # 36
    "Tomato___healthy",                                             # 37
]

# ─────────────────────────────────────────────────────────────────────────────
# Human-readable display names for the frontend
# Format: { raw_class_name: { "plant": ..., "condition": ..., "is_healthy": ... } }
# ─────────────────────────────────────────────────────────────────────────────

CLASS_META = {
    "Apple___Apple_scab":                                        {"plant": "Apple",      "condition": "Apple Scab",                          "is_healthy": False},
    "Apple___Black_rot":                                         {"plant": "Apple",      "condition": "Black Rot",                           "is_healthy": False},
    "Apple___Cedar_apple_rust":                                  {"plant": "Apple",      "condition": "Cedar Apple Rust",                    "is_healthy": False},
    "Apple___healthy":                                           {"plant": "Apple",      "condition": "Healthy",                             "is_healthy": True},
    "Blueberry___healthy":                                       {"plant": "Blueberry",  "condition": "Healthy",                             "is_healthy": True},
    "Cherry_(including_sour)___Powdery_mildew":                  {"plant": "Cherry",     "condition": "Powdery Mildew",                      "is_healthy": False},
    "Cherry_(including_sour)___healthy":                         {"plant": "Cherry",     "condition": "Healthy",                             "is_healthy": True},
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot":        {"plant": "Corn",       "condition": "Cercospora / Gray Leaf Spot",          "is_healthy": False},
    "Corn_(maize)___Common_rust_":                               {"plant": "Corn",       "condition": "Common Rust",                         "is_healthy": False},
    "Corn_(maize)___Northern_Leaf_Blight":                       {"plant": "Corn",       "condition": "Northern Leaf Blight",                "is_healthy": False},
    "Corn_(maize)___healthy":                                    {"plant": "Corn",       "condition": "Healthy",                             "is_healthy": True},
    "Grape___Black_rot":                                         {"plant": "Grape",      "condition": "Black Rot",                           "is_healthy": False},
    "Grape___Esca_(Black_Measles)":                              {"plant": "Grape",      "condition": "Esca (Black Measles)",                "is_healthy": False},
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)":                {"plant": "Grape",      "condition": "Leaf Blight (Isariopsis Leaf Spot)",  "is_healthy": False},
    "Grape___healthy":                                           {"plant": "Grape",      "condition": "Healthy",                             "is_healthy": True},
    "Orange___Haunglongbing_(Citrus_greening)":                  {"plant": "Orange",     "condition": "Huanglongbing (Citrus Greening)",      "is_healthy": False},
    "Peach___Bacterial_spot":                                    {"plant": "Peach",      "condition": "Bacterial Spot",                      "is_healthy": False},
    "Peach___healthy":                                           {"plant": "Peach",      "condition": "Healthy",                             "is_healthy": True},
    "Pepper,_bell___Bacterial_spot":                             {"plant": "Bell Pepper","condition": "Bacterial Spot",                      "is_healthy": False},
    "Pepper,_bell___healthy":                                    {"plant": "Bell Pepper","condition": "Healthy",                             "is_healthy": True},
    "Potato___Early_blight":                                     {"plant": "Potato",     "condition": "Early Blight",                        "is_healthy": False},
    "Potato___Late_blight":                                      {"plant": "Potato",     "condition": "Late Blight",                         "is_healthy": False},
    "Potato___healthy":                                          {"plant": "Potato",     "condition": "Healthy",                             "is_healthy": True},
    "Raspberry___healthy":                                       {"plant": "Raspberry",  "condition": "Healthy",                             "is_healthy": True},
    "Soybean___healthy":                                         {"plant": "Soybean",    "condition": "Healthy",                             "is_healthy": True},
    "Squash___Powdery_mildew":                                   {"plant": "Squash",     "condition": "Powdery Mildew",                      "is_healthy": False},
    "Strawberry___Leaf_scorch":                                  {"plant": "Strawberry", "condition": "Leaf Scorch",                         "is_healthy": False},
    "Strawberry___healthy":                                      {"plant": "Strawberry", "condition": "Healthy",                             "is_healthy": True},
    "Tomato___Bacterial_spot":                                   {"plant": "Tomato",     "condition": "Bacterial Spot",                      "is_healthy": False},
    "Tomato___Early_blight":                                     {"plant": "Tomato",     "condition": "Early Blight",                        "is_healthy": False},
    "Tomato___Late_blight":                                      {"plant": "Tomato",     "condition": "Late Blight",                         "is_healthy": False},
    "Tomato___Leaf_Mold":                                        {"plant": "Tomato",     "condition": "Leaf Mold",                           "is_healthy": False},
    "Tomato___Septoria_leaf_spot":                               {"plant": "Tomato",     "condition": "Septoria Leaf Spot",                  "is_healthy": False},
    "Tomato___Spider_mites Two-spotted_spider_mite":             {"plant": "Tomato",     "condition": "Spider Mites (Two-spotted)",           "is_healthy": False},
    "Tomato___Target_Spot":                                      {"plant": "Tomato",     "condition": "Target Spot",                         "is_healthy": False},
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus":                    {"plant": "Tomato",     "condition": "Yellow Leaf Curl Virus",              "is_healthy": False},
    "Tomato___Tomato_mosaic_virus":                              {"plant": "Tomato",     "condition": "Mosaic Virus",                        "is_healthy": False},
    "Tomato___healthy":                                          {"plant": "Tomato",     "condition": "Healthy",                             "is_healthy": True},
}

assert len(CLASS_NAMES) == 38, f"Expected 38 classes, got {len(CLASS_NAMES)}"
assert len(CLASS_META)  == 38, f"Expected 38 meta entries, got {len(CLASS_META)}"
