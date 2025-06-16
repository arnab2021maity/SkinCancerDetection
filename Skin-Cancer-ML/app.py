from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image
import pandas as pd
import pickle

app = Flask(__name__)

# Load Models
# image_model = load_model("best_testify_model.h5")
gene_model = load_model("best_gene_model.h5")

# Load Preprocessing Objects for Gene Prediction
with open("scaler.pkl", "rb") as f:
    scaler = pickle.load(f)
with open("label_encoder.pkl", "rb") as f:
    encoder = pickle.load(f)

# Class labels (must match training order)
class_labels = [
    'actinic keratosis', 'basal cell carcinoma', 'dermatofibroma',
    'melanoma', 'nevus', 'pigmented benign keratosis',
    'seborrheic keratosis', 'squamous cell carcinoma', 'vascular lesion'
]

@app.route('/')
def home():
    return "🔥 Skin Cancer Prediction API (Gene + Image) is running!"

# @app.route('/predict/image', methods=['POST'])
# def predict_image():
#     try:
#         if 'file' not in request.files:
#             return jsonify({'error': 'No file uploaded'}), 400
#         file = request.files['file']
#         if file.filename == '':
#             return jsonify({'error': 'Empty filename'}), 400
#         image = Image.open(file).convert("RGB").resize((128, 128))
#         image_array = np.array(image) / 255.0
#         image_array = image_array.reshape((1, 128, 128, 3))
#         prediction = image_model.predict(image_array)
#         idx = np.argmax(prediction)
#         return jsonify({'prediction': class_labels[idx], 'confidence': float(np.max(prediction))})
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

@app.route('/predict/gene', methods=['POST'])
def predict_gene():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({"error": "Empty filename"}), 400

        # Read Excel file
        df = pd.read_excel(file, header=None)

        # Auto-transpose if it's vertical (more rows than columns)
        if df.shape[0] > df.shape[1]:
            df = df.T

        # Use the first row for prediction
        X = df.values[0].reshape(1, -1)

        # Validate input feature count
        if X.shape[1] != scaler.mean_.shape[0]:
            return jsonify({
                "error": f"Invalid input shape. Expected {scaler.mean_.shape[0]} features but got {X.shape[1]}"
            }), 400

        # Scale and predict
        X_scaled = scaler.transform(X)
        pred = gene_model.predict(X_scaled)[0]
        label = encoder.inverse_transform([np.argmax(pred)])[0]
        conf = float(np.max(pred))

        return jsonify({"label": label, "confidence": conf})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
