# Gunicorn configuration for Render
# Optimized for 512MB RAM with Render free tier

import multiprocessing
import os

# Binding - Render uses PORT environment variable
bind = f"0.0.0.0:{os.environ.get('PORT', '8000')}"

# Worker configuration optimized for Render free tier (512MB RAM)
workers = 1  # Single worker to save memory
worker_class = 'sync'
worker_connections = 100  # Reduced for memory optimization
max_requests = 100  # Restart worker after 100 requests to free memory
max_requests_jitter = 10
timeout = 300  # 5 minutes for model download
graceful_timeout = 60  # Shorter graceful timeout for Render
keepalive = 2  # Reduced keepalive for memory

# Memory management for Render free tier
worker_tmp_dir = '/tmp'  # Use /tmp for Render
preload_app = False  # Don't preload to save memory

# Logging optimized for Render
accesslog = '-'
errorlog = '-'
loglevel = 'info'
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"'

# Process naming
proc_name = 'mars_dust_storm_render'

# Render specific settings
forwarded_allow_ips = '*'  # Allow forwarded headers from Render
secure_scheme_headers = {
    'X-FORWARDED-PROTOCOL': 'ssl',
    'X-FORWARDED-PROTO': 'https',
    'X-FORWARDED-SSL': 'on'
}

# Development vs Production
if os.environ.get('FLASK_DEBUG') == 'True':
    reload = True
    loglevel = 'debug'
else:
    reload = False

print(f"🚀 Gunicorn starting for Render")
print(f"🌐 Port: {os.environ.get('PORT', '8000')}")
print(f"👥 Workers: {workers}")
print(f"⏱️ Timeout: {timeout}s")
print(f"💾 Memory optimization: Enabled for Render free tier (512MB)")
print(f"🌍 Environment: {os.environ.get('ENVIRONMENT', 'production')}")

