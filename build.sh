#!/bin/bash
# build.sh - Build all Spring Boot jars then start with docker-compose
# Usage: chmod +x build.sh && ./build.sh

set -e

SERVICES=(
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

echo "Building Spring Boot JARs..."

for svc in "${SERVICES[@]}"; do
  if [ -d "$svc" ] && [ -f "$svc/pom.xml" ]; then
    echo "  Building $svc ..."
    (cd "$svc" && mvn clean package -DskipTests -q)
    echo "  Done: $svc"
  else
    echo "  Skipping $svc (not found)"
  fi
done

echo ""
echo "Starting services..."
docker compose build
docker compose up -d

echo ""
echo "Done! Services are starting."
echo "  Check status : docker compose ps"
echo "  Eureka       : http://localhost:8761"
echo "  API Gateway  : http://localhost:8080"
