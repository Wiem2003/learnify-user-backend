# ─────────────────────────────────────────────────────────────────────────────
# install-docker-windows.ps1
# Installs WSL2 + Docker Desktop on Windows 10/11
# Run as Administrator in PowerShell
# ─────────────────────────────────────────────────────────────────────────────

Write-Host "=== Step 1: Enable WSL and Virtual Machine Platform ===" -ForegroundColor Cyan
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

Write-Host ""
Write-Host "=== Step 2: Install WSL2 ===" -ForegroundColor Cyan
wsl --install --no-distribution
wsl --set-default-version 2

Write-Host ""
Write-Host "=== Step 3: Download Docker Desktop ===" -ForegroundColor Cyan
$dockerUrl = "https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe"
$installer = "$env:TEMP\DockerDesktopInstaller.exe"
Write-Host "Downloading Docker Desktop..."
Invoke-WebRequest -Uri $dockerUrl -OutFile $installer -UseBasicParsing

Write-Host ""
Write-Host "=== Step 4: Install Docker Desktop ===" -ForegroundColor Cyan
Start-Process -FilePath $installer -Args "install --quiet --accept-license" -Wait

Write-Host ""
Write-Host "=== DONE ===" -ForegroundColor Green
Write-Host "Please RESTART your computer, then run Docker Desktop."
Write-Host "After restart, open PowerShell and run:"
Write-Host "  cd merge_integ/integrated"
Write-Host "  docker-compose up --build -d"
