# ─────────────────────────────────────────────────────────────────────────────
# build.ps1 — Build all Spring Boot JARs then Docker images (Windows)
# Run from: merge_integ/integrated/
# Usage: .\build.ps1
# ─────────────────────────────────────────────────────────────────────────────

$ErrorActionPreference = "Stop"

$services = @(
    "eureka-server",
    "config-server",
    "event-service",
    "payment-service",
    "certificate-service",
    "quiz-feedback-service",
    "ai-service",
    "course-service",
    "user-service",
    "job-service",
    "preevaluation-service",
    "club-service",
    "api-gateway"
)

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  STEP 1 — Building Spring Boot JARs (Maven)" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan

foreach ($svc in $services) {
    if ((Test-Path ".\$svc") -and (Test-Path ".\$svc\pom.xml")) {
        Write-Host ""
        Write-Host "▶ Building $svc ..." -ForegroundColor Yellow
        Push-Location ".\$svc"
        mvn clean package -DskipTests -q
        if ($LASTEXITCODE -ne 0) {
            Write-Host "✗ FAILED: $svc" -ForegroundColor Red
            Pop-Location
            exit 1
        }
        Pop-Location
        Write-Host "✓ $svc — done" -ForegroundColor Green
    } else {
        Write-Host "⚠ Skipping $svc (not found)" -ForegroundColor DarkYellow
    }
}

Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  STEP 2 — Building Docker images" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan

docker-compose build

Write-Host ""
Write-Host "======================================================" -ForegroundColor Green
Write-Host "  ALL DONE — Starting services..." -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green

docker-compose up -d

Write-Host ""
Write-Host "Services starting. Check status with:" -ForegroundColor Cyan
Write-Host "  docker-compose ps"
Write-Host "  docker-compose logs -f"
Write-Host ""
Write-Host "Eureka dashboard: http://localhost:8761" -ForegroundColor Green
Write-Host "API Gateway:      http://localhost:8080" -ForegroundColor Green
