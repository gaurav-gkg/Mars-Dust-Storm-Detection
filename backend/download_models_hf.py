#!/usr/bin/env python3
"""
Download YOLO models from Hugging Face Hub
"""

import os
import sys
import urllib.request
from urllib.error import URLError

MODEL_DIR = os.path.join(os.path.dirname(__file__), 'Model')
os.makedirs(MODEL_DIR, exist_ok=True)

def download_from_hf(repo_id, filename, destination):
    """Download from Hugging Face Hub"""
    url = f"https://huggingface.co/{repo_id}/resolve/main/{filename}"
    
    print(f"Downloading {filename} from Hugging Face...")
    try:
        urllib.request.urlretrieve(url, destination)
        file_size = os.path.getsize(destination)
        print(f"✅ Downloaded {filename} ({file_size // (1024*1024)}MB)")
        return True
    except Exception as e:
        print(f"❌ Failed to download {filename}: {e}")
        return False

def main():
    # Set your Hugging Face repository
    repo_id = os.environ.get('HF_REPO_ID', 'your-username/mars-dust-models')
    
    download_from_hf(repo_id, 'best.pt', os.path.join(MODEL_DIR, 'best.pt'))
    download_from_hf(repo_id, 'last.pt', os.path.join(MODEL_DIR, 'last.pt'))

if __name__ == "__main__":
    main()
    sys.exit(0)