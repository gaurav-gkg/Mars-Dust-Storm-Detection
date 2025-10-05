from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from ultralytics import YOLO
from PIL import Image
import numpy as np
import cv2
import io
import base64
import os
import gc
import tempfile

app = Flask(__name__)
CORS(app)

# Hugging Face model URLs - REPLACE WITH YOUR ACTUAL HUGGING FACE URLs
HF_MODELS = {
    'best.pt': 'https://huggingface.co/gauravgkg/Mars_Model/resolve/main/best.pt',
    'last.pt': 'https://huggingface.co/gauravgkg/Mars_Model/resolve/main/last.pt'
}

# Cache directory for downloaded models
CACHE_DIR = os.path.join(tempfile.gettempdir(), 'mars_models')
os.makedirs(CACHE_DIR, exist_ok=True)

# Model paths - check local first (for development)
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'Model')

# Global model instance
current_model = None
current_model_name = None

def get_model_path(model_name):
    """
    Get model path, checking local directory first, then cache, then Hugging Face
    """
    # Check local Model directory first (for development)
    local_path = os.path.join(MODEL_DIR, model_name)
    if os.path.exists(local_path):
        print(f"✓ Using local model: {local_path}")
        return local_path
    
    # Check cache directory (for downloaded models)
    cache_path = os.path.join(CACHE_DIR, model_name)
    if os.path.exists(cache_path):
        print(f"✓ Using cached model: {cache_path}")
        return cache_path
    
    # Return Hugging Face URL (will be downloaded on first use)
    hf_url = HF_MODELS.get(model_name)
    if hf_url:
        print(f"⬇️ Will download from Hugging Face: {hf_url}")
        return hf_url
    
    return None

def load_model(model_name='best.pt'):
    """
    Load model with memory optimization and HF fallback
    """
    global current_model, current_model_name
    
    try:
        # Only reload if different model requested
        if current_model_name != model_name:
            # Clear previous model from memory
            if current_model is not None:
                print(f"🗑️ Clearing previous model from memory...")
                del current_model
                gc.collect()
            
            # Get model path (local, cache, or HF URL)
            model_path = get_model_path(model_name)
            
            if model_path is None:
                print(f"❌ Model not found: {model_name}")
                return None
            
            print(f"📦 Loading model: {model_name}")
            
            # Load model from path or URL
            current_model = YOLO(model_path)
            current_model_name = model_name
            
            print(f"✅ Model loaded successfully: {model_name}")
        
        return current_model
        
    except Exception as e:
        print(f"❌ Error loading model: {str(e)}")
        return None

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'message': 'Backend is running',
        'cache_dir': CACHE_DIR
    })

@app.route('/api/models', methods=['GET'])
def get_models():
    """List available models and their status"""
    available_models = []
    for model_name, hf_url in HF_MODELS.items():
        local_path = os.path.join(MODEL_DIR, model_name)
        cache_path = os.path.join(CACHE_DIR, model_name)
        
        status = {
            'name': model_name,
            'available': True,  # Always available via HF
            'local': os.path.exists(local_path),
            'cached': os.path.exists(cache_path),
            'hf_url': hf_url
        }
        available_models.append(status)
    
    return jsonify({
        'models': available_models,
        'current_model': current_model_name
    })

@app.route('/api/detect', methods=['POST'])
def detect_dust_storm():
    """Detect dust storms in uploaded image"""
    try:
        # Validate request
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        image_file = request.files['image']
        model_name = request.form.get('model', 'best.pt')
        
        print(f"🖼️ Processing image: {image_file.filename}")
        print(f"🤖 Using model: {model_name}")
        
        # Load and optimize image
        image = Image.open(image_file.stream).convert('RGB')
        
        # Resize large images to reduce memory usage
        max_size = 1280
        original_size = image.size
        if max(image.size) > max_size:
            image.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
            print(f"📏 Resized image from {original_size} to {image.size}")
        
        image_np = np.array(image)
        
        # Load model (from local, cache, or HF)
        model = load_model(model_name)
        
        if model is None:
            return jsonify({
                'success': False,
                'error': 'Model not available. Please try again.',
                'demo_mode': True
            }), 503
        
        # Run inference with memory optimization
        print(f"🔍 Running detection...")
        results = model.predict(
            image,
            conf=0.2,
            iou=0.45,
            device='cpu',
            verbose=False,
            max_det=100
        )
        result = results[0]
        
        # Process detections
        image_with_boxes = image_np.copy()
        detections = []
        
        if result.boxes is not None and len(result.boxes) > 0:
            print(f"✨ Found {len(result.boxes)} detections")
            for box in result.boxes:
                x1, y1, x2, y2 = box.xyxy.cpu().numpy().astype(int)[0]
                confidence = float(box.conf.item())
                
                # Draw semi-transparent rectangle
                overlay = image_with_boxes.copy()
                color = (0, 255, 0)
                alpha = 0.4
                
                cv2.rectangle(overlay, (x1, y1), (x2, y2), color, -1)
                image_with_boxes = cv2.addWeighted(overlay, alpha, image_with_boxes, 1 - alpha, 0)
                
                detections.append({
                    'confidence': round(confidence * 100, 2),
                    'box': [int(x1), int(y1), int(x2), int(y2)]
                })
        else:
            print(f"ℹ️ No detections found")
        
        # Convert result to base64
        result_image = Image.fromarray(cv2.cvtColor(image_with_boxes, cv2.COLOR_BGR2RGB))
        buffered = io.BytesIO()
        result_image.save(buffered, format="PNG", optimize=True, quality=85)
        img_str = base64.b64encode(buffered.getvalue()).decode()
        
        # Clean up memory
        del image, image_np, image_with_boxes, result_image, results
        gc.collect()
        
        print(f"✅ Detection complete")
        
        return jsonify({
            'success': True,
            'image': img_str,
            'detections': detections,
            'model_used': model_name
        })
        
    except MemoryError as e:
        print(f"💥 Out of memory: {str(e)}")
        gc.collect()
        return jsonify({
            'error': 'Out of memory. Please try with a smaller image or upgrade your hosting plan.'
        }), 507
    except Exception as e:
        print(f"❌ Error during detection: {str(e)}")
        import traceback
        traceback.print_exc()
        gc.collect()
        return jsonify({'error': f'Detection failed: {str(e)}'}), 500

@app.route('/api/inference-time', methods=['POST'])
def get_inference_time():
    """Measure model inference time"""
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        image_file = request.files['image']
        model_name = request.form.get('model', 'best.pt')
        
        image = Image.open(image_file.stream).convert('RGB')
        
        # Resize for inference test
        max_size = 960
        if max(image.size) > max_size:
            image.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
        
        model = load_model(model_name)
        
        if model is None:
            return jsonify({'error': 'Model not available'}), 503
        
        import time
        start = time.time()
        results = model.predict(image, imgsz=960, device='cpu', verbose=False)
        inference_time = (time.time() - start) * 1000
        
        del results, image
        gc.collect()
        
        return jsonify({
            'inference_time_ms': round(inference_time, 2),
            'model_used': model_name
        })
        
    except MemoryError:
        gc.collect()
        return jsonify({'error': 'Out of memory'}), 507
    except Exception as e:
        gc.collect()
        return jsonify({'error': str(e)}), 500

@app.route('/api/cache-status', methods=['GET'])
def cache_status():
    """Get cache status and disk usage"""
    cache_info = {
        'cache_directory': CACHE_DIR,
        'cached_models': []
    }
    
    try:
        if os.path.exists(CACHE_DIR):
            for model_name in HF_MODELS.keys():
                cache_path = os.path.join(CACHE_DIR, model_name)
                if os.path.exists(cache_path):
                    size_mb = os.path.getsize(cache_path) / (1024 * 1024)
                    cache_info['cached_models'].append({
                        'name': model_name,
                        'size_mb': round(size_mb, 2),
                        'path': cache_path
                    })
    except Exception as e:
        cache_info['error'] = str(e)
    
    return jsonify(cache_info)

if __name__ == '__main__':
    print("=" * 60)
    print("🚀 Starting Mars Dust Storm Detection Backend")
    print("=" * 60)
    print(f"📁 Model directory: {MODEL_DIR}")
    print(f"💾 Cache directory: {CACHE_DIR}")
    print()
    
    # Check model availability
    print("🔍 Checking model availability:")
    for model_name, hf_url in HF_MODELS.items():
        local_path = os.path.join(MODEL_DIR, model_name)
        cache_path = os.path.join(CACHE_DIR, model_name)
        
        if os.path.exists(local_path):
            print(f"  ✓ {model_name}: Local file found")
        elif os.path.exists(cache_path):
            print(f"  ✓ {model_name}: Cached file found")
        else:
            print(f"  ⬇️ {model_name}: Will download from Hugging Face on first use")
    
    print()
    print("=" * 60)
    
    # Get port from environment variable (for Render/deployment)
    port = int(os.environ.get('PORT', 8000))
    debug = os.environ.get('FLASK_DEBUG', 'False') == 'True'
    
    app.run(debug=debug, port=port, host='0.0.0.0')

