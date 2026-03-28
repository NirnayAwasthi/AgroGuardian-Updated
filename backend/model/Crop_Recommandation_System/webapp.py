from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pickle
import os
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ── Load models ───────────────────────────────────────────────────────────────
def load_model(filename):
    path = os.path.join(BASE_DIR, filename)
    try:
        with open(path, 'rb') as f:
            m = pickle.load(f)
        print(f"  Loaded: {filename}")
        return m
    except FileNotFoundError:
        print(f"  NOT FOUND: {filename} — run retrain_model.py first")
        return None
    except Exception as e:
        print(f"  ERROR loading {filename}: {e}")
        return None

print("Loading models...")
models = {
    "RandomForest":   load_model("RandomForest.pkl"),
    "DecisionTree":   load_model("DecisionTree.pkl"),
    "NaiveBayes":     load_model("NBClassifier.pkl"),
    "KNN":            load_model("KNeighborsClassifier.pkl"),
}

# Default model used by /predict
DEFAULT_MODEL = "RandomForest"


# ── Routes ────────────────────────────────────────────────────────────────────

@app.route('/')
def home():
    return jsonify({
        "message": "AgroGuardian Crop Recommendation API",
        "status": "running",
        "models_loaded": {k: v is not None for k, v in models.items()},
        "default_model": DEFAULT_MODEL,
    })


@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "models_loaded": {k: v is not None for k, v in models.items()},
    })


@app.route('/predict', methods=['POST'])
def predict():
    """
    Expected JSON body:
    {
        "nitrogen":    90,
        "phosphorus":  42,
        "potassium":   43,
        "temperature": 20.87,
        "humidity":    82.0,
        "ph":          6.5,
        "rainfall":    202.9,
        "model":       "RandomForest"   ← optional, defaults to RandomForest
    }
    """
    try:
        data = request.get_json(force=True)

        if not data:
            return jsonify({"error": "No JSON body received", "success": False}), 400

        # Validate required fields
        required = ['nitrogen', 'phosphorus', 'potassium',
                    'temperature', 'humidity', 'ph', 'rainfall']
        missing = [f for f in required if f not in data]
        if missing:
            return jsonify({
                "error": f"Missing fields: {missing}",
                "success": False
            }), 400

        # Extract and cast features
        try:
            N           = float(data['nitrogen'])
            P           = float(data['phosphorus'])
            K           = float(data['potassium'])
            temperature = float(data['temperature'])
            humidity    = float(data['humidity'])
            ph          = float(data['ph'])
            rainfall    = float(data['rainfall'])
        except (ValueError, TypeError) as e:
            return jsonify({"error": f"Invalid numeric value: {e}", "success": False}), 400

        # Select model
        model_name = data.get('model', DEFAULT_MODEL)
        if model_name not in models:
            return jsonify({
                "error": f"Unknown model '{model_name}'. Choose from: {list(models.keys())}",
                "success": False
            }), 400

        model = models[model_name]
        if model is None:
            return jsonify({
                "error": f"Model '{model_name}' failed to load. Run retrain_model.py first.",
                "success": False
            }), 500

        # Build input array and predict
        input_data = np.array([[N, P, K, temperature, humidity, ph, rainfall]])
        prediction = model.predict(input_data)

        # Confidence (probability of top class)
        confidence = None
        try:
            proba = model.predict_proba(input_data)
            confidence = round(float(np.max(proba) * 100), 2)
        except AttributeError:
            pass  # Some models don't support predict_proba

        return jsonify({
            "success": True,
            "prediction": str(prediction[0]),
            "confidence": confidence,
            "model_used": model_name,
            "input": {
                "nitrogen":    N,
                "phosphorus":  P,
                "potassium":   K,
                "temperature": temperature,
                "humidity":    humidity,
                "ph":          ph,
                "rainfall":    rainfall,
            }
        })

    except Exception as e:
        return jsonify({"error": str(e), "success": False}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
