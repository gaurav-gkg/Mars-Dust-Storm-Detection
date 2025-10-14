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
- **Models**: YOLOv8 (best.pt/last.pt) 

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


## Project Structure

```
├── frontend/          # React frontend
├── backend/           # Flask backend
├── training/          # Model training
└── README.md
```


## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.




