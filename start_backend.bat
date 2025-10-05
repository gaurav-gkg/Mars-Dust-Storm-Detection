@echo off
echo Starting Mars Dust Storm Detection Backend...
echo.

cd /d "%~dp0"
cd backend

echo Starting Flask backend...
echo Backend will be available at: http://localhost:8000
echo Press Ctrl+C to stop the server
echo.

python app.py
