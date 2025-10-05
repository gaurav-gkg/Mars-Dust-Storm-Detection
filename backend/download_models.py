#!/usr/bin/env python3
"""
Download YOLO model files from cloud storage before starting the Flask app.
This script runs once when the container starts on Render.
"""

import os
import sys
import time
import urllib.request
from urllib.error import URLError, HTTPError

MODEL_DIR = os.path.join(os.path.dirname(__file__), 'Model')
os.makedirs(MODEL_DIR, exist_ok=True)

def download_from_google_drive(file_id, destination):
    """Download a file from Google Drive using direct download URL"""
    url = f"https://drive.google.com/uc?export=download&id={file_id}"
    
    print(f"Downloading {os.path.basename(destination)} from Google Drive...")
    
    for attempt in range(3):
        try:
            # Add headers to mimic browser request
            req = urllib.request.Request(url, headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            })
            
            with urllib.request.urlopen(req, timeout=300) as response:
                with open(destination, 'wb') as f:
                    # Download in chunks to handle large files
                    chunk_size = 8192
                    downloaded = 0
                    while True:
                        chunk = response.read(chunk_size)
                        if not chunk:
                            break
                        f.write(chunk)
                        downloaded += len(chunk)
                        # Print progress every 10MB
                        if downloaded % (10 * 1024 * 1024) == 0:
                            print(f"Downloaded {downloaded // (1024*1024)}MB...")
            
            file_size = os.path.getsize(destination)
            print(f"✅ Successfully downloaded {os.path.basename(destination)} ({file_size // (1024*1024)}MB)")
            return True
            
        except (URLError, HTTPError, OSError) as e:
            print(f"❌ Attempt {attempt + 1} failed: {e}")
            if attempt < 2:
                print("Retrying in 5 seconds...")
                time.sleep(5)
            
    print(f"❌ Failed to download {os.path.basename(destination)} after 3 attempts")
    return False

def download_model(env_var_name, filename):
    """Download a model file if it doesn't exist"""
    file_id = os.environ.get(env_var_name)
    if not file_id:
        print(f"⚠️  Environment variable {env_var_name} not set, skipping {filename}")
        return False
        
    dest_path = os.path.join(MODEL_DIR, filename)
    
    # Skip if file already exists and is reasonably sized (>100MB)
    if os.path.exists(dest_path):
        file_size = os.path.getsize(dest_path)
        if file_size > 100 * 1024 * 1024:  # >100MB
            print(f"✅ {filename} already exists ({file_size // (1024*1024)}MB), skipping download")
            return True
        else:
            print(f"⚠️  {filename} exists but is too small ({file_size}B), re-downloading...")
            os.remove(dest_path)
    
    return download_from_google_drive(file_id, dest_path)

def main():
    """Main function to download all required models"""
    print("🚀 Starting model download process...")
    print(f"📁 Model directory: {MODEL_DIR}")
    
    # Download models
    best_ok = download_model('GOOGLE_DRIVE_BEST_ID', 'best.pt')
    last_ok = download_model('GOOGLE_DRIVE_LAST_ID', 'last.pt')
    
    # Check results
    downloaded_models = []
    if best_ok:
        downloaded_models.append('best.pt')
    if last_ok:
        downloaded_models.append('last.pt')
    
    if downloaded_models:
        print(f"🎉 Successfully prepared models: {', '.join(downloaded_models)}")
        return True
    else:
        print("⚠️  No models downloaded. App may fail if models are required.")
        print("💡 Make sure to set GOOGLE_DRIVE_BEST_ID and/or GOOGLE_DRIVE_LAST_ID environment variables")
        return False

if __name__ == "__main__":
    success = main()
    # Always exit with 0 so Render continues to start the app even if download fails
    # The app can handle missing models gracefully
    sys.exit(0)