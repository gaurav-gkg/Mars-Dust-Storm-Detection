# Ultra-simple Gunicorn configuration for Render
import os

# Minimal configuration
bind = f"0.0.0.0:{os.environ.get('PORT', '8000')}"
workers = 1
timeout = 300

print(f"🚀 Starting Gunicorn on port {os.environ.get('PORT', '8000')}")

