# 🌪️ Mars Dust Storm Detection - The Hive Minds

A modern, full-stack web application for detecting dust storms in Martian satellite imagery using YOLOv8. This project converts the original Streamlit application into a React-based frontend with a Flask backend.

![Mars Dust Storm Detection](https://img.shields.io/badge/Mars-Dust%20Storm%20Detection-orange)
![React](https://img.shields.io/badge/React-18.2-blue)
![Flask](https://img.shields.io/badge/Flask-3.0-green)
![YOLOv8](https://img.shields.io/badge/YOLOv8-Ultralytics-red)

## 🚀 Features

### 🛰️ Dust Storm Detection
- Upload single or multiple satellite images (JPG, PNG, JPEG)
- Real-time dust storm detection using YOLOv8
- Visual detection with semi-transparent bounding boxes
- Confidence scores and detection summaries
- Model selection (best.pt or last.pt)
- Side-by-side comparison of original and detected images

### 📊 Results Visualization
- Interactive CSV file upload and parsing
- Comprehensive data preview and statistics
- Multiple chart types:
  - Confidence distribution histograms
  - Custom scatter plots with axis selection
  - Metrics over epochs (precision, recall, mAP)
  - Loss metrics visualization
  - Correlation matrix heatmap
- Dynamic filtering by column values
- Real-time data exploration

### 🎨 Modern UI/UX
- Beautiful dark theme with Mars-inspired color palette
- Responsive design for all screen sizes
- Smooth animations and transitions
- Drag-and-drop file uploads
- Interactive charts with zoom and download
- Clean navigation between pages

## 📁 Project Structure

```
dust_storm_react/
├── backend/
│   ├── app.py                 # Flask API server
│   └── requirements.txt       # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx         # Main layout with navigation
│   │   │   ├── FileUpload.jsx     # Drag-and-drop file upload
│   │   │   ├── ImagePreview.jsx   # Image viewer with zoom
│   │   │   └── LoadingSpinner.jsx # Loading indicator
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Landing page
│   │   │   ├── DustStormDetection.jsx  # Detection interface
│   │   │   └── ResultsVisualization.jsx # Data visualization
│   │   ├── App.jsx                # Main app component
│   │   ├── main.jsx               # Entry point
│   │   └── index.css              # Global styles
│   ├── public/                    # Static assets
│   ├── package.json               # Node dependencies
│   ├── vite.config.js             # Vite configuration
│   ├── tailwind.config.js         # Tailwind CSS config
│   └── index.html                 # HTML entry point
└── README.md                      # This file
```

## 🛠️ Technologies Used

### Frontend
- **React 18.2** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Chart library for visualizations
- **Plotly.js** - Advanced plotting (correlation matrix)
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Backend
- **Flask** - Python web framework
- **Flask-CORS** - Cross-origin resource sharing
- **Ultralytics YOLOv8** - Object detection model
- **OpenCV** - Image processing
- **Pillow** - Image handling
- **NumPy** - Numerical operations
- **PyTorch** - Deep learning framework

## 📋 Prerequisites

- **Node.js** 16+ and npm/yarn
- **Python** 3.8+ (3.10 recommended)
- **Git**
- **YOLOv8 model files** (best.pt or last.pt)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
cd dust_storm_react
```

### 2. Setup Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Or with yarn
yarn install

# Return to root directory
cd ..
```

### 3. Setup Backend

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 4. Configure Model Paths

Edit `backend/app.py` and update the `MODEL_DIR` path to point to your YOLOv8 model files:

```python
MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'dust_storm', 'Model')
```

Or place your model files in the default location:
```
dust_storm/Model/
├── best.pt
└── last.pt
```

### 5. Run the Application

#### Start the Backend (Terminal 1)

```bash
cd backend
python app.py
```

Backend will run on `http://localhost:5000`

#### Start the Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:3000`

### 6. Access the Application

Open your browser and navigate to `http://localhost:3000`

## 📖 Usage Guide

### Dust Storm Detection

1. Click on **Detection** in the navigation bar
2. Select a model from the dropdown (best.pt or last.pt)
3. Upload one or more satellite images using:
   - Click to browse files
   - Drag and drop images
4. Click **Detect Dust Storms** button
5. View results:
   - Original images on the left
   - Detected storms with bounding boxes on the right
   - Detection details with confidence scores

### Results Visualization

1. Click on **Visualization** in the navigation bar
2. Upload a CSV file with training results
3. Explore the data:
   - **Dataset Preview**: View first 10 rows
   - **Statistics**: Mean, min, max values
   - **Confidence Distribution**: Histogram of confidence scores
   - **Custom Scatter Plot**: Select X and Y axes
   - **Metrics Over Epochs**: Track precision, recall, mAP
   - **Loss Metrics**: Visualize training losses
   - **Correlation Matrix**: Heatmap of feature correlations
   - **Filters**: Filter data by column values

## 🔧 Configuration

### Frontend Configuration

**Vite Config** (`frontend/vite.config.js`):
```javascript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    }
  }
}
```

**Tailwind Config** (`frontend/tailwind.config.js`):
- Custom Mars-themed color palette
- Responsive breakpoints
- Custom component classes

### Backend Configuration

**Flask App** (`backend/app.py`):
```python
# Model configuration
MODELS = {
    'best.pt': 'path/to/best.pt',
    'last.pt': 'path/to/last.pt'
}

# Detection parameters
conf=0.05  # Confidence threshold
iou=0.45   # IoU threshold
device='cpu'  # Use 'cuda' for GPU
```

## 🌐 API Endpoints

### `GET /api/health`
Health check endpoint
- **Response**: `{ "status": "ok", "message": "Backend is running" }`

### `GET /api/models`
List available models
- **Response**: 
```json
{
  "models": [
    { "name": "best.pt", "available": true, "path": "/path/to/model" }
  ]
}
```

### `POST /api/detect`
Detect dust storms in an image
- **Request**: `multipart/form-data`
  - `image`: Image file
  - `model`: Model name (optional, default: "best.pt")
- **Response**:
```json
{
  "success": true,
  "image": "base64_encoded_image",
  "detections": [
    { "confidence": 85.5, "box": [100, 200, 300, 400] }
  ],
  "model_used": "best.pt"
}
```

### `POST /api/inference-time`
Measure inference time
- **Request**: `multipart/form-data`
  - `image`: Image file
  - `model`: Model name (optional)
- **Response**:
```json
{
  "inference_time_ms": 125.45,
  "model_used": "best.pt"
}
```

## 🎨 Customization

### Adding New Models

1. Place model file in the Model directory
2. Update `MODELS` dict in `backend/app.py`:
```python
MODELS = {
    'best.pt': 'path/to/best.pt',
    'last.pt': 'path/to/last.pt',
    'custom.pt': 'path/to/custom.pt'  # Add here
}
```
3. Update model selector in `frontend/src/pages/DustStormDetection.jsx`

### Styling

- Edit `frontend/src/index.css` for global styles
- Modify `frontend/tailwind.config.js` for theme colors
- Component-specific styles in respective `.jsx` files

### Adding New Visualizations

1. Create new chart component in `frontend/src/components/`
2. Import and use in `frontend/src/pages/ResultsVisualization.jsx`
3. Use Recharts or Plotly.js for rendering

## 🐛 Troubleshooting

### Backend Issues

**Model not found error:**
- Verify model path in `backend/app.py`
- Check if model files exist in specified directory

**CUDA not available:**
- Install CUDA toolkit and PyTorch with CUDA support
- Or use `device='cpu'` in detection

**Port already in use:**
```bash
# Change port in backend/app.py
app.run(port=5001)  # Use different port
```

### Frontend Issues

**Module not found:**
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**CORS errors:**
- Ensure Flask-CORS is installed
- Check proxy configuration in `frontend/vite.config.js`

**Build errors:**
```bash
# Clear Vite cache
cd frontend
npm run dev -- --force
```

## 📦 Building for Production

### Frontend Build

```bash
cd frontend
npm run build
```

Output will be in `frontend/dist/` directory.

### Serve Production Build

```bash
cd frontend
npm run preview
```

### Deploy Backend

```bash
# Use production WSGI server
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Credits

- **Original Streamlit App**: Based on the Mars Dust Storm Detection project
- **Datasets**: [Harvard Dataverse](https://dataverse.harvard.edu/)
- **YOLOv8**: [Ultralytics](https://github.com/ultralytics/ultralytics)
- **React**: [React Team](https://react.dev/)
- **Tailwind CSS**: [Tailwind Labs](https://tailwindcss.com/)

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review troubleshooting section

## 🔮 Future Enhancements

- [ ] Real-time webcam detection
- [ ] Batch processing with progress tracking
- [ ] Model comparison tools
- [ ] Export detection results as JSON/CSV
- [ ] User authentication and saved sessions
- [ ] Cloud deployment guides
- [ ] Mobile app version
- [ ] Advanced filtering and search
- [ ] 3D visualization of Mars surface

---

**Happy Dust Storm Hunting! 🌪️🔴**

