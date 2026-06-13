@echo off
setlocal

set "ROOT=C:\xampp\htdocs\CampusCart-React"

powershell -NoProfile -Command "$root='%ROOT%'; Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | Where-Object { $_.CommandLine -like \"*$root\\backend*\" -or $_.CommandLine -like \"*$root\\frontend*\" } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }" >nul 2>&1

echo Stopped CampusCart node processes.
