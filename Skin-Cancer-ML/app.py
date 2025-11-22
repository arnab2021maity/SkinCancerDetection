from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
import tensorflow as tf
import numpy as np
from PIL import Image
import pandas as pd
import pickle
import logging
from fusion import fuzzy_multimodal_classification
from flask_cors import CORS

# Setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
app = Flask(__name__)
CORS(app)

# Load Models & Preprocessing Tools
image_model = load_model("best_testify_model.h5")
gene_model = load_model("best_gene_model.h5")

with open("scaler.pkl", "rb") as f:
    scaler = pickle.load(f)
with open("label_encoder.pkl", "rb") as f:
    encoder = pickle.load(f)

# Class Labels
class_labels = [
    'actinic keratosis', 'basal cell carcinoma', 'dermatofibroma',
    'melanoma', 'nevus', 'pigmented benign keratosis',
    'seborrheic keratosis', 'squamous cell carcinoma', 'vascular lesion'
]

# Helpers
def preprocess_image(image, target_size=(128, 128)):
    if image.mode != 'RGB':
        image = image.convert('RGB')
    image = image.resize(target_size, Image.Resampling.LANCZOS)
    image_array = np.array(image, dtype=np.float32)
    image_array = np.expand_dims(image_array, axis=0)
    return image_array

def get_top3_predictions(predictions, labels):
    """Extract top-3 predictions with labels and confidences"""
    top_3_indices = np.argsort(predictions)[-3:][::-1]
    top_3 = [(labels[i], round(float(predictions[i]), 4)) for i in top_3_indices]
    return top_3

# Routes
@app.route('/')
def home():
    return "🔥 Skin Cancer Prediction API (Gene + Image + Fuzzy Fusion) is running!"

@app.route('/predict/image', methods=['POST'])
def predict_image():
    try:
        if 'file' not in request.files or request.files['file'].filename == '':
            return jsonify({'error': 'No file uploaded'}), 400

        image = Image.open(request.files['file']).convert("RGB")
        image_array = preprocess_image(image)
        prediction = image_model.predict(image_array, verbose=0)[0]

        if not np.isclose(np.sum(prediction), 1.0, atol=1e-3):
            prediction = tf.nn.softmax(prediction).numpy()

        entropy = -np.sum(prediction * np.log(prediction + 1e-10))
        max_entropy = np.log(len(class_labels))
        normalized_entropy = entropy / max_entropy

        top_3_indices = np.argsort(prediction)[-3:][::-1]
        top_3 = {class_labels[i]: round(float(prediction[i]), 4) for i in top_3_indices}

        top_idx = np.argmax(prediction)
        top_class = class_labels[top_idx]
        confidence = round(float(prediction[top_idx]), 4)

        result = {
            'prediction': top_class,
            'confidence': confidence,
            'top_3_predictions': top_3,
            'entropy_score': round(normalized_entropy, 4)
        }

        if confidence < 0.7 or normalized_entropy > 0.9:
            result["warnings"] = ["⚠️ Prediction may be unreliable"]
            result["recommendation"] = "Please consult a dermatologist."

        return jsonify(result)

    except Exception as e:
        logger.exception("Image prediction error")
        return jsonify({'error': str(e)}), 500

@app.route('/predict/gene', methods=['POST'])
def predict_gene():
    try:
        if 'file' not in request.files or request.files['file'].filename == '':
            return jsonify({"error": "No file uploaded"}), 400

        df = pd.read_excel(request.files['file'], header=None)
        if df.shape[0] > df.shape[1]:
            df = df.T

        X = df.values[0].reshape(1, -1)
        if X.shape[1] != scaler.mean_.shape[0]:
            return jsonify({
                "error": f"Expected {scaler.mean_.shape[0]} features but got {X.shape[1]}"
            }), 400

        X_scaled = scaler.transform(X)
        pred = gene_model.predict(X_scaled)[0]
        label = encoder.inverse_transform([np.argmax(pred)])[0]
        conf = float(np.max(pred))

        result = {
            "label": label,
            "confidence": round(conf, 4)
        }

        if conf < 0.7:
            result["warning"] = "⚠️ Low confidence. Please consult a dermatologist."

        return jsonify(result)

    except Exception as e:
        logger.exception("Gene prediction error")
        return jsonify({"error": str(e)}), 500

@app.route('/predict/fused', methods=['POST'])
def predict_fused():
    try:
        if 'image' not in request.files or 'gene' not in request.files:
            return jsonify({'error': 'Both image and gene files are required'}), 400

        # Gene Prediction - Get Top-3
        gene_file = request.files['gene']
        df = pd.read_excel(gene_file, header=None)
        if df.shape[0] > df.shape[1]:
            df = df.T
        X = df.values[0].reshape(1, -1)

        if X.shape[1] != scaler.mean_.shape[0]:
            return jsonify({
                "error": f"Expected {scaler.mean_.shape[0]} features but got {X.shape[1]}"
            }), 400

        X_scaled = scaler.transform(X)
        gene_pred = gene_model.predict(X_scaled, verbose=0)[0]
        
        # Get gene labels from encoder
        gene_labels = encoder.classes_.tolist()
        top3_numeric = get_top3_predictions(gene_pred, gene_labels)

        # Image Prediction - Get Top-3
        image = Image.open(request.files['image']).convert("RGB")
        image_array = preprocess_image(image)
        image_pred = image_model.predict(image_array, verbose=0)[0]
        
        if not np.isclose(np.sum(image_pred), 1.0, atol=1e-3):
            image_pred = tf.nn.softmax(image_pred).numpy()
        
        top3_image = get_top3_predictions(image_pred, class_labels)

        # Calculate entropy for reliability check
        entropy = -np.sum(image_pred * np.log(image_pred + 1e-10))
        max_entropy = np.log(len(class_labels))
        normalized_entropy = entropy / max_entropy

        # Apply Fuzzy Multimodal Classification
        final_label, final_conf = fuzzy_multimodal_classification(
            top3_image, 
            top3_numeric, 
            dominant_class='melanoma'
        )
        
        # Calculate fused confidence as weighted average of top predictions
        image_top_conf = top3_image[0][1] if top3_image else 0.0
        gene_top_conf = top3_numeric[0][1] if top3_numeric else 0.0
        fused_conf = (0.5 * image_top_conf + 0.5 * gene_top_conf)

        # Prepare response
        result = {
            "image_top3": dict(top3_image),
            "gene_top3": dict(top3_numeric),
            "final_prediction": final_label,
            "final_confidence": final_conf,
            "fused_confidence": round(fused_conf, 4),
            "entropy_score": round(normalized_entropy, 4),
            "fusion_method": "Fuzzy Logic with Domain Knowledge"
        }

        # Add warnings based on confidence and entropy
        warnings = []
        if final_conf < 0.7:
            warnings.append("⚠️ Low confidence prediction")
        if normalized_entropy > 0.9:
            warnings.append("⚠️ High uncertainty detected")
        
        if warnings:
            result["warnings"] = warnings
            result["recommendation"] = "Please consult a dermatologist for professional diagnosis."

        return jsonify(result)

    except Exception as e:
        logger.exception("Fused prediction error")
        return jsonify({'error': str(e)}), 500
    try:
        if 'image' not in request.files or 'gene' not in request.files:
            return jsonify({'error': 'Both image and gene files are required'}), 400

        # Gene Prediction - Get Top-3
        gene_file = request.files['gene']
        df = pd.read_excel(gene_file, header=None)
        if df.shape[0] > df.shape[1]:
            df = df.T
        X = df.values[0].reshape(1, -1)

        if X.shape[1] != scaler.mean_.shape[0]:
            return jsonify({
                "error": f"Expected {scaler.mean_.shape[0]} features but got {X.shape[1]}"
            }), 400

        X_scaled = scaler.transform(X)
        gene_pred = gene_model.predict(X_scaled, verbose=0)[0]
        
        # Get gene labels from encoder
        gene_labels = encoder.classes_.tolist()
        top3_numeric = get_top3_predictions(gene_pred, gene_labels)

        # Image Prediction - Get Top-3
        image = Image.open(request.files['image']).convert("RGB")
        image_array = preprocess_image(image)
        image_pred = image_model.predict(image_array, verbose=0)[0]
        
        if not np.isclose(np.sum(image_pred), 1.0, atol=1e-3):
            image_pred = tf.nn.softmax(image_pred).numpy()
        
        top3_image = get_top3_predictions(image_pred, class_labels)

        # Calculate entropy for reliability check
        entropy = -np.sum(image_pred * np.log(image_pred + 1e-10))
        max_entropy = np.log(len(class_labels))
        normalized_entropy = entropy / max_entropy

        # Apply Fuzzy Multimodal Classification
        final_label, final_conf, fused_conf = fuzzy_multimodal_classification(
            top3_image, 
            top3_numeric, 
            dominant_class='melanoma'
        )

        # Prepare response
        result = {
            "image_top3": dict(top3_image),
            "gene_top3": dict(top3_numeric),
            "final_prediction": final_label,
            "final_confidence": final_conf,
            "fused_confidence": round(fused_conf, 4),
            "entropy_score": round(normalized_entropy, 4),
            "fusion_method": "Fuzzy Logic with Domain Knowledge"
        }

        # Add warnings based on confidence and entropy
        warnings = []
        if final_conf < 0.7:
            warnings.append("⚠️ Low confidence prediction")
        if normalized_entropy > 0.9:
            warnings.append("⚠️ High uncertainty detected")
        
        if warnings:
            result["warnings"] = warnings
            result["recommendation"] = "Please consult a dermatologist for professional diagnosis."

        return jsonify(result)

    except Exception as e:
        logger.exception("Fused prediction error")
        return jsonify({'error': str(e)}), 500
if __name__ == '__main__':
    logger.info("🚀 Starting Skin Cancer Detection API with Fuzzy Fusion...")
    app.run(host="0.0.0.0", port=5000, debug=True)
