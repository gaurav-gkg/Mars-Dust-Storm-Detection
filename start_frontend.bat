@echo off
echo Starting Mars Dust Storm Detection Frontend...
echo.

cd /d "%~dp0"
cd frontend

echo Starting Vite development server...
echo Frontend will be available at: http://localhost:3000/
echo.

echo Opening browser...
start http://localhost:3000/

npm run dev
