# 🚀 Mars Dust Storm Detection

A web application for detecting dust storms on Mars using YOLOv8 object detection model.

## Features

- Upload Mars images and detect dust storms
- Interactive before/after comparison
- 3D Mars globe visualization
- Performance metrics and confidence scores

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS + Three.js
- **Backend**: Flask + YOLOv8 + OpenCV
- **Models**: YOLOv8 (best.pt/last.pt) from Hugging Face

## Setup

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```

Access at http://localhost:5173

## Project Structure

```
├── frontend/          # React frontend
├── backend/           # Flask backend
├── training/          # Model training
└── README.md
```

## Deployment

### Frontend
Deploy to Vercel with build command: `npm run build`

### Backend
Deploy to any cloud platform with:
- Build: `pip install -r backend/requirements.txt`
- Start: `cd backend && gunicorn -c gunicorn_config.py app:app`
- Environment: `PORT=8000`, `FLASK_DEBUG=False`

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/models` - Available models
- `POST /api/detect` - Detect dust storms
- `POST /api/inference-time` - Measure inference time

## 🛠️ Troubleshooting

### Common Issues

#### First Request Timeout
- **Problem**: First detection request times out (30-90 seconds)
- **Solution**: This is normal! The model is downloading. Try again immediately after timeout.

#### Out of Memory Errors
- **Problem**: Worker killed with SIGKILL or out of memory
- **Solution**: 
  - Use smaller images (<5MB)
  - Don't run multiple concurrent requests
  - Increase server memory allocation

#### Model Download Failures
- **Problem**: Models not downloading from Hugging Face
- **Solution**: 
  - Check internet connection
  - Verify Hugging Face availability
  - Try again after a few minutes

#### CORS Issues
- **Problem**: Frontend can't connect to backend
- **Solution**: CORS is enabled in Flask app, check API URL configuration









## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.




---

**Built with ❤️ for Mars exploration and dust storm detection** 🚀

