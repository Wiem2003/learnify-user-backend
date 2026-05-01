# ───── START ALL MICROSERVICES ─────
# Run as Administrator from the 'integrated' folder
# Usage: powershell -ExecutionPolicy Bypass -File .\start_all.ps1

$ports = @(8761, 8080, 8081, 8082, 8083, 8084, 8085, 8086, 8087, 8088, 8089)

Write-Host "Killing any process on microservice ports..." -ForegroundColor Yellow
foreach ($port in $ports) {
    $pids = (netstat -ano | Select-String ":$port\s" | ForEach-Object {
        ($_ -split '\s+')[-1]
    } | Sort-Object -Unique)
    foreach ($p in $pids) {
        if ($p -match '^\d+$' -and $p -ne '0') {
            try { taskkill /PID $p /F 2>$null | Out-Null } catch {}
        }
    }
}

Start-Sleep -Seconds 2

$services = @(
    "eureka-server",
    "user-service",
    "event-service",
    "course-service",
    "payment-service",
    "certificate-service",
    "quiz-feedback-service",
    "ai-service",
    "job-service",
    "preevaluation-service",
    "api-gateway"
)

foreach ($svc in $services) {
    if (Test-Path ".\$svc") {
        Write-Host "Starting $svc..." -ForegroundColor Cyan
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$(Resolve-Path .\$svc)'; mvn spring-boot:run"
        if ($svc -eq "eureka-server") {
            Write-Host "Waiting 20s for Eureka to be ready..." -ForegroundColor Yellow
            Start-Sleep -Seconds 20
        } else {
            Start-Sleep -Seconds 3
        }
    } else {
        Write-Warning "Folder .\$svc not found, skipping."
    }
}

Write-Host "`nAll services launched." -ForegroundColor Green
Write-Host "Eureka Dashboard : http://localhost:8761" -ForegroundColor Green
Write-Host "API Gateway      : http://localhost:8080" -ForegroundColor Green
Write-Host "Frontend         : http://localhost:4200" -ForegroundColor Green
