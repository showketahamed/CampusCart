@echo off
setlocal

echo Starting CampusCart backend...
start "CampusCart Backend" cmd /k "cd /d C:\xampp\htdocs\CampusCart-React\backend && node src/server.js"

echo Starting CampusCart frontend...
start "CampusCart Frontend" cmd /k "cd /d C:\xampp\htdocs\CampusCart-React\frontend && node node_modules\vite\bin\vite.js --host 127.0.0.1 --port 5173"

echo.
echo Backend:  http://127.0.0.1:5000/api/health
echo Frontend: http://127.0.0.1:5173
echo.
echo Keep both opened command windows running.

