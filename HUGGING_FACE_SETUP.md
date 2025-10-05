# 🤗 Hugging Face Model Hosting - Step-by-Step Guide

This guide will walk you through hosting your YOLOv8 models on Hugging Face to avoid memory issues on free hosting tiers.

---

## 📋 Prerequisites

- [ ] Hugging Face account (create at https://huggingface.co/join)
- [ ] Your trained model files (`best.pt` and `last.pt`)
- [ ] Git installed on your computer
- [ ] Git LFS (Large File Storage) installed

---

## 🚀 Step 1: Create a Hugging Face Account

1. Go to https://huggingface.co/join
2. Sign up with your email or GitHub account
3. Verify your email address
4. Log in to your account

---

## 🔑 Step 2: Create an Access Token (Optional but Recommended)

1. Go to https://huggingface.co/settings/tokens
2. Click **"New token"**
3. Name it: `mars-model-access`
4. Select **"Read"** permission (sufficient for public models)
5. Click **"Generate"**
6. **Copy and save** the token somewhere safe

---

## 📦 Step 3: Create a New Model Repository

### Option A: Using the Web Interface (Easiest)

1. Go to https://huggingface.co/new
2. Fill in the details:
   - **Owner**: Your username (e.g., `gauravgkg`)
   - **Model name**: `Mars_Model` (or any name you prefer)
   - **License**: Choose appropriate license (e.g., MIT, Apache 2.0)
   - **Visibility**: Public (free) or Private (requires Pro)
3. Click **"Create model"**

### Option B: Using Git Command Line

```bash
# Install Git LFS first (if not already installed)
# On Windows: Download from https://git-lfs.github.com/
# On Mac: brew install git-lfs
# On Linux: sudo apt-get install git-lfs

# Initialize Git LFS
git lfs install

# Clone your new repository
git clone https://huggingface.co/YOUR_USERNAME/Mars_Model
cd Mars_Model
```

---

## 📤 Step 4: Upload Your Model Files

### Option A: Web Upload (Easiest for Small Files)

1. Go to your model repo: `https://huggingface.co/YOUR_USERNAME/Mars_Model`
2. Click **"Files and versions"** tab
3. Click **"Add file"** → **"Upload files"**
4. Drag and drop your `best.pt` and `last.pt` files
5. Add a commit message: "Add YOLOv8 model files"
6. Click **"Commit changes to main"**

### Option B: Git Command Line (Better for Large Files)

```bash
# Navigate to your model directory
cd path/to/Mars_Model

# Track large files with Git LFS
git lfs track "*.pt"
git add .gitattributes

# Copy your model files to this directory
cp /path/to/your/backend/Model/best.pt .
cp /path/to/your/backend/Model/last.pt .

# Add and commit the files
git add best.pt last.pt
git commit -m "Add YOLOv8 dust storm detection models"

# Push to Hugging Face
git push origin main
```

**Note**: Upload might take several minutes (each file is ~148MB)

---

## 🔗 Step 5: Get Your Model URLs

After uploading, your models will be available at:

```
https://huggingface.co/YOUR_USERNAME/Mars_Model/resolve/main/best.pt
https://huggingface.co/YOUR_USERNAME/Mars_Model/resolve/main/last.pt
```

**Example** (if your username is `gauravgkg`):
```
https://huggingface.co/gauravgkg/Mars_Model/resolve/main/best.pt
https://huggingface.co/gauravgkg/Mars_Model/resolve/main/last.pt
```

---

## ⚙️ Step 6: Update Your Backend Code

Open `backend/app.py` and update the `HF_MODELS` dictionary with YOUR URLs:

```python
# Hugging Face model URLs - REPLACE WITH YOUR ACTUAL HUGGING FACE URLs
HF_MODELS = {
    'best.pt': 'https://huggingface.co/YOUR_USERNAME/Mars_Model/resolve/main/best.pt',
    'last.pt': 'https://huggingface.co/YOUR_USERNAME/Mars_Model/resolve/main/last.pt'
}
```

**Replace `YOUR_USERNAME`** with your actual Hugging Face username!

---

## 🧪 Step 7: Test Locally

1. **Start your backend**:
   ```bash
   cd backend
   python app.py
   ```

2. **Check the startup logs**:
   ```
   ============================================================
   🚀 Starting Mars Dust Storm Detection Backend
   ============================================================
   📁 Model directory: D:\...\backend\Model
   💾 Cache directory: C:\Users\...\Temp\mars_models
   
   🔍 Checking model availability:
     ⬇️ best.pt: Will download from Hugging Face on first use
     ⬇️ last.pt: Will download from Hugging Face on first use
   
   ============================================================
   ```

3. **Start your frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

4. **Test detection**:
   - Open http://localhost:3000
   - Go to Detection page
   - Upload a test image
   - First detection will take ~30-60 seconds (downloading model)
   - Subsequent detections will be fast (~3-5 seconds)

5. **Verify model was cached**:
   - Check backend logs for: `✓ Using cached model`
   - Or visit: http://localhost:8000/api/cache-status

---

## 📝 Step 8: Add Model Card (Optional but Recommended)

Create a `README.md` in your Hugging Face repo to document your model:

```markdown
---
license: mit
tags:
  - computer-vision
  - object-detection
  - yolov8
  - mars
  - dust-storm
---

# Mars Dust Storm Detection Model

This model detects dust storms in Martian satellite imagery using YOLOv8.

## Model Details

- **Model Type**: YOLOv8 Object Detection
- **Training Data**: Mars satellite images from NASA/Harvard Dataverse
- **Classes**: Dust Storm
- **Input**: RGB images (any size, auto-resized)
- **Output**: Bounding boxes with confidence scores

## Usage

```python
from ultralytics import YOLO

# Load model from Hugging Face
model = YOLO('https://huggingface.co/YOUR_USERNAME/Mars_Model/resolve/main/best.pt')

# Run inference
results = model.predict('mars_image.jpg', conf=0.2)
```

## Performance

- **mAP50**: 0.91
- **Precision**: 0.89
- **Recall**: 0.87
- **Inference Time**: ~3-5 seconds (CPU)

## Citation

If you use this model, please cite:

```
@misc{mars_dust_storm_detection,
  author = {Your Name},
  title = {Mars Dust Storm Detection},
  year = {2025},
  publisher = {Hugging Face},
  url = {https://huggingface.co/YOUR_USERNAME/Mars_Model}
}
```
```

---

## 🌐 Step 9: Deploy to Render

1. **Make sure your code is updated** (Step 6 completed)

2. **Commit and push changes**:
   ```bash
   git add backend/app.py
   git commit -m "Add Hugging Face model hosting support"
   git push origin main
   ```

3. **Render will auto-deploy** (if connected to GitHub)

4. **Check deployment logs** on Render dashboard

5. **Test your deployed app**:
   - Visit your Render URL
   - Upload a test image
   - First request will download model (~30-60 seconds)
   - Subsequent requests will be fast

---

## 🔍 Step 10: Monitor and Troubleshoot

### Check Cache Status

Visit: `https://your-app.onrender.com/api/cache-status`

Should return:
```json
{
  "cache_directory": "/tmp/mars_models",
  "cached_models": [
    {
      "name": "best.pt",
      "size_mb": 148.23,
      "path": "/tmp/mars_models/best.pt"
    }
  ]
}
```

### Check Model Availability

Visit: `https://your-app.onrender.com/api/models`

Should return:
```json
{
  "models": [
    {
      "name": "best.pt",
      "available": true,
      "local": false,
      "cached": true,
      "hf_url": "https://huggingface.co/..."
    }
  ],
  "current_model": "best.pt"
}
```

### Common Issues

**Issue**: Model download fails
- **Solution**: Check your Hugging Face URL is correct
- **Solution**: Make sure model repository is public

**Issue**: Still getting out of memory errors
- **Solution**: Model + inference still needs ~500MB
- **Solution**: Consider upgrading to Render Starter plan ($7/month)

**Issue**: Downloads on every Render restart
- **Solution**: This is normal for free tier (ephemeral filesystem)
- **Solution**: Upgrade to paid tier for persistent disk

---

## ✅ Verification Checklist

Before deploying to production:

- [ ] Models uploaded to Hugging Face
- [ ] Repository is public (or you have access token)
- [ ] URLs updated in `backend/app.py`
- [ ] Tested locally (first request downloads, subsequent requests fast)
- [ ] Code committed and pushed to GitHub
- [ ] Deployed to Render successfully
- [ ] First production request completes (even if slow)
- [ ] Cache status endpoint shows cached models
- [ ] Subsequent requests are fast

---

## 📊 Expected Performance

| Scenario | Time | Memory Usage |
|----------|------|--------------|
| **First Request (Cold Start)** | 30-60s | ~500MB |
| **Subsequent Requests** | 3-5s | ~400MB |
| **Model Download** | Once per deployment | 148MB |
| **Cache Lifetime** | Until Render restarts | N/A |

---

## 🎉 Congratulations!

Your models are now hosted on Hugging Face! This approach:

✅ Reduces memory pressure on free hosting  
✅ Makes models publicly accessible  
✅ Enables easy version control  
✅ Provides automatic caching  
✅ Allows model sharing with the community  

---

## 🆘 Need Help?

- **Hugging Face Docs**: https://huggingface.co/docs/hub/models-uploading
- **Git LFS Docs**: https://git-lfs.github.com/
- **Render Docs**: https://render.com/docs
- **Ultralytics YOLOv8**: https://docs.ultralytics.com/

---

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Render logs for error messages
3. Test locally first before deploying
4. Check Hugging Face model accessibility

Good luck! 🚀

