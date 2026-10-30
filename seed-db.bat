@echo off
echo ========================================================
echo  Seeding FastParcel Database (MongoDB)
echo ========================================================
echo.
cd /d "%~dp0backend"
node src/seeders/seed.js
echo.
pause
