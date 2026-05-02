@echo off
setlocal

for /f "tokens=2 delims=," %%P in ('tasklist /FI "IMAGENAME eq node.exe" /FO CSV /NH') do (
  taskkill /PID %%~P /F >nul 2>&1
)

echo Stopped all node.exe processes.

