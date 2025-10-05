from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from ultralytics import YOLO
from PIL import Image
import numpy as np
import cv2
import io
import base64
import os
# pandas removed - no longer processing CSVs in backend

app = Flask(__name__)
CORS(app)

# Model paths - use absolute paths relative to this file
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'Model')
MODELS = {
    'best.pt': os.path.join(MODEL_DIR, 'best.pt'),
    'last.pt': os.path.join(MODEL_DIR, 'last.pt')
}

# Note: CSV files are now served as static assets from the frontend

# Load default model
current_model = None
current_model_name = None

def load_model(model_name='best.pt'):
    global current_model, current_model_name
    if current_model_name != model_name:
        model_path = MODELS.get(model_name, MODELS['best.pt'])
        if os.path.exists(model_path):
            current_model = YOLO(model_path)
            current_model_name = model_name
            print(f"Loaded model: {model_name}")
        else:
            print(f"Model not found: {model_path}")
            raise FileNotFoundError(f"Model {model_name} not found at {model_path}")
    return current_model

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'Backend is running'})

@app.route('/api/models', methods=['GET'])
def get_models():
    available_models = []
    for model_name, model_path in MODELS.items():
        available_models.append({
            'name': model_name,
            'available': os.path.exists(model_path),
            'path': model_path
        })
    return jsonify({'models': available_models})

@app.route('/api/detect', methods=['POST'])
def detect_dust_storm():
    try:
        # Get image from request
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        image_file = request.files['image']
        model_name = request.form.get('model', 'best.pt')
        
        # Load and process image
        image = Image.open(image_file.stream).convert('RGB')
        image_np = np.array(image)
        
        # Load model
        model = load_model(model_name)
        
        # Run inference
        results = model.predict(image, conf=0.2, iou=0.45, device='0')
        result = results[0]
        
        # Draw detections on image
        image_with_boxes = image_np.copy()
        detections = []
        
        if result.boxes is not None and len(result.boxes) > 0:
            for box in result.boxes:
                x1, y1, x2, y2 = box.xyxy.cpu().numpy().astype(int)[0]
                confidence = float(box.conf.item())
                
                # Draw semi-transparent rectangle
                overlay = image_with_boxes.copy()
                color = (0, 255, 0)  # Green color in BGR
                alpha = 0.4
                
                cv2.rectangle(overlay, (x1, y1), (x2, y2), color, -1)
                image_with_boxes = cv2.addWeighted(overlay, alpha, image_with_boxes, 1 - alpha, 0)
                
                # Store detection info
                detections.append({
                    'confidence': round(confidence * 100, 2),
                    'box': [int(x1), int(y1), int(x2), int(y2)]
                })
        
        # Convert result image to base64
        result_image = Image.fromarray(cv2.cvtColor(image_with_boxes, cv2.COLOR_BGR2RGB))
        buffered = io.BytesIO()
        result_image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()
        
        return jsonify({
            'success': True,
            'image': img_str,
            'detections': detections,
            'model_used': model_name
        })
        
    except FileNotFoundError as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        print(f"Error during detection: {str(e)}")
        return jsonify({'error': f'Detection failed: {str(e)}'}), 500

@app.route('/api/inference-time', methods=['POST'])
def get_inference_time():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        image_file = request.files['image']
        model_name = request.form.get('model', 'best.pt')
        
        image = Image.open(image_file.stream).convert('RGB')
        model = load_model(model_name)
        
        import time
        start = time.time()
        results = model.predict(image, imgsz=960, device='cpu')
        inference_time = (time.time() - start) * 1000  # Convert to ms
        
        return jsonify({
            'inference_time_ms': round(inference_time, 2),
            'model_used': model_name
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# CSV endpoints removed - CSVs are now served as static files from frontend

if __name__ == '__main__':
    print("Starting Flask backend server...")
    print(f"Model directory: {MODEL_DIR}")
    
    # Check if models exist
    for model_name, model_path in MODELS.items():
        if os.path.exists(model_path):
            print(f"✓ Found model: {model_name} at {model_path}")
        else:
            print(f"✗ Model not found: {model_name} at {model_path}")
    
    app.run(debug=True, port=8000, host='0.0.0.0')

