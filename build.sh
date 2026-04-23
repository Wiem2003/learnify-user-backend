#!/bin/bash
# build.sh - Build all Spring Boot jars then start with docker-compose
# Usage: chmod +x build.sh && ./build.sh

set -e

# ── Auto-install prerequisites if missing ────────────────────────────────────
if ! command -v java &>/dev/null; then
  echo "Installing Java 17..."
  apt-get update -y && apt-get install -y openjdk-17-jdk
fi

if ! command -v mvn &>/dev/null; then
  echo "Installing Maven..."
  apt-get install -y maven
fi

# ── Ensure Java 17 is active ─────────────────────────────────────────────────
JAVA17=$(update-alternatives --list java 2>/dev/null | grep "java-17" | head -1)
if [ -n "$JAVA17" ]; then
  export JAVA_HOME=$(dirname $(dirname $JAVA17))
  export PATH=$JAVA_HOME/bin:$PATH
  echo "Using Java: $(java -version 2>&1 | head -1)"
fi

if ! command -v docker-compose &>/dev/null; then
  echo "Installing docker-compose..."
  curl -fsSL "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" \
    -o /usr/local/bin/docker-compose
  chmod +x /usr/local/bin/docker-compose
fi

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
docker-compose build
docker-compose up -d

echo ""
echo "Done! Services are starting."
echo "  Check status : docker compose ps"
echo "  Eureka       : http://localhost:8761"
echo "  API Gateway  : http://localhost:8080"
