@echo off
setlocal

set "ROOT=C:\xampp\htdocs\CampusCart-React"
set "BACKEND=%ROOT%\backend"
set "FRONTEND=%ROOT%\frontend"

if not exist "%BACKEND%\package.json" (
  echo Backend package.json not found at %BACKEND%
  exit /b 1
)

if not exist "%FRONTEND%\package.json" (
  echo Frontend package.json not found at %FRONTEND%
  exit /b 1
)

if not exist "%BACKEND%\.env" if exist "%BACKEND%\.env.example" (
  copy /Y "%BACKEND%\.env.example" "%BACKEND%\.env" >nul
  echo Created backend .env from .env.example
)

if not exist "%FRONTEND%\.env" if exist "%FRONTEND%\.env.example" (
  copy /Y "%FRONTEND%\.env.example" "%FRONTEND%\.env" >nul
  echo Created frontend .env from .env.example
)

if not exist "%BACKEND%\node_modules" (
  echo Installing backend dependencies...
  call "%ProgramFiles%\nodejs\npm.cmd" --prefix "%BACKEND%" install || exit /b 1
)

if not exist "%FRONTEND%\node_modules" (
  echo Installing frontend dependencies...
  call "%ProgramFiles%\nodejs\npm.cmd" --prefix "%FRONTEND%" install || exit /b 1
)

call "%ROOT%\stop-all.bat" >nul 2>&1

echo Starting CampusCart backend...
start "CampusCart Backend" cmd /k "cd /d %BACKEND% && node src/server.js"

echo Starting CampusCart frontend...
start "CampusCart Frontend" cmd /k "cd /d %FRONTEND% && call ""%ProgramFiles%\nodejs\npm.cmd"" run dev -- --host 127.0.0.1 --port 5173"

echo.
echo Backend:  http://127.0.0.1:5000/api/health
echo Frontend: http://127.0.0.1:5173
echo.
echo Keep both opened command windows running.
