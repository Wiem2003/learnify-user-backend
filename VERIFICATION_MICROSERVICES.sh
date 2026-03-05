#!/bin/bash

# ============================================
# SCRIPT DE VÉRIFICATION MICROSERVICES
# ============================================

echo "🔍 VÉRIFICATION DE L'ARCHITECTURE MICROSERVICES"
echo "================================================"
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction de vérification
check_service() {
    local name=$1
    local url=$2
    
    echo -n "Vérification de $name... "
    
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200"; then
        echo -e "${GREEN}✅ OK${NC}"
        return 0
    else
        echo -e "${RED}❌ ERREUR${NC}"
        return 1
    fi
}

# Vérifier Eureka Server
echo "1️⃣ EUREKA SERVER (8761)"
check_service "Eureka Server" "http://localhost:8761/actuator/health"
echo ""

# Vérifier API Gateway
echo "2️⃣ API GATEWAY (8080)"
check_service "API Gateway" "http://localhost:8080/actuator/health"
check_service "Gateway Routes" "http://localhost:8080/actuator/gateway/routes"
echo ""

# Vérifier Event-Service
echo "3️⃣ EVENT-SERVICE (8081)"
check_service "Event-Service" "http://localhost:8081/actuator/health"
echo ""

# Vérifier les endpoints via Gateway
echo "4️⃣ ENDPOINTS VIA GATEWAY"
check_service "GET /api/events" "http://localhost:8080/api/events"
echo ""

# Vérifier Eureka Registry
echo "5️⃣ SERVICES ENREGISTRÉS DANS EUREKA"
echo "Récupération de la liste des services..."

EUREKA_APPS=$(curl -s http://localhost:8761/eureka/apps -H "Accept: application/json")

if echo "$EUREKA_APPS" | grep -q "API-GATEWAY"; then
    echo -e "${GREEN}✅ API-GATEWAY enregistré${NC}"
else
    echo -e "${RED}❌ API-GATEWAY non enregistré${NC}"
fi

if echo "$EUREKA_APPS" | grep -q "EVENT-SERVICE"; then
    echo -e "${GREEN}✅ EVENT-SERVICE enregistré${NC}"
else
    echo -e "${RED}❌ EVENT-SERVICE non enregistré${NC}"
fi

echo ""

# Résumé
echo "================================================"
echo "📊 RÉSUMÉ"
echo "================================================"
echo ""
echo "Eureka Dashboard: http://localhost:8761"
echo "API Gateway:      http://localhost:8080"
echo "Event-Service:    http://localhost:8081"
echo ""
echo "Pour tester manuellement:"
echo "  curl http://localhost:8080/api/events"
echo "  curl http://localhost:8080/actuator/gateway/routes"
echo ""
echo "================================================"
