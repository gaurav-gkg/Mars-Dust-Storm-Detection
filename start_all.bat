@echo off
echo Starting Mars Dust Storm Detection Application...
echo.

cd /d "%~dp0"

echo Starting Backend Server...
start "Mars Backend" cmd /k "%~dp0start_backend.bat"

echo Waiting 10 seconds for backend to initialize...
timeout /t 10 /nobreak

echo Starting Frontend...
start "Mars Frontend" cmd /k "%~dp0start_frontend.bat"

echo.
echo Both servers are running...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
exit
