@echo off
echo ========================================================
echo  Starting FastParcel Express (MERN Stack Delivery System)
echo ========================================================
echo.
echo [1/2] Starting Backend API Server (Port 5000)...
start "FastParcel Backend (Port 5000)" cmd /k "cd /d "%~dp0backend" && npm run dev"

timeout /t 2 >nul

echo [2/2] Starting Frontend Vite App (Port 5173)...
start "FastParcel Frontend (Port 5173)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ========================================================
echo  FastParcel is launching!
echo  Backend API:  http://localhost:5000
echo  Frontend UI:  http://localhost:5173
echo ========================================================
timeout /t 3 >nul
start http://localhost:5173
