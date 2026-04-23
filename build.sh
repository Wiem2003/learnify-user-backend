#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# build.sh — Build all Spring Boot jars then Docker images
# Run from: merge_integ/integrated/
# Usage:  chmod +x build.sh && ./build.sh
# ─────────────────────────────────────────────────────────────────────────────

set -e  # stop on first error

SERVICES_JAVA=(
  "eureka-server"
  "config-server"
  "event-service"
  "payment-service"
  "certificate-service"
  "quiz-feedback-service"
  "ai-service"
  "course-service"
  "user-service"
  "job-service"
  "preevaluation-service"
  "club-service"
  "api-gateway"
)

echo "======================================================"
echo "  STEP 1 — Building Spring Boot JARs (Maven)"
echo "======================================================"

for svc in "${SERVICES_JAVA[@]}"; do
  if [ -d "$svc" ] && [ -f "$svc/pom.xml" ]; then
    echo ""
    echo "▶ Building $svc ..."
    (cd "$svc" && mvn clean package -DskipTests -q)
    echo "✓ $svc — done"
  else
    echo "⚠ Skipping $svc (folder or pom.xml not found)"
  fi
done

echo ""
echo "======================================================"
echo "  STEP 2 — Building Docker images"
echo "======================================================"

docker-compose build

echo ""
echo "======================================================"
echo "  ALL DONE — Run with: docker-compose up -d"
echo "======================================================"
