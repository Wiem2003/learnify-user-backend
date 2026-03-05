#!/bin/bash

# Script de test des endpoints AI
# Usage: bash TEST_AI_ENDPOINTS.sh

BASE_URL="http://localhost:8080/back/api/ai"

echo "=========================================="
echo "🤖 TEST DES ENDPOINTS GOOGLE AI"
echo "=========================================="
echo ""

# Test 1: Vérifier que le service fonctionne
echo "1️⃣ Test du service AI..."
curl -s "$BASE_URL/test"
echo -e "\n"

# Test 2: Prédiction - Risque élevé
echo "2️⃣ Test de prédiction (Risque élevé)..."
curl -s -X POST "$BASE_URL/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "likes": 150,
    "reservations": 90,
    "placesRestantes": 10
  }' | json_pp
echo ""

# Test 3: Prédiction - Risque faible
echo "3️⃣ Test de prédiction (Risque faible)..."
curl -s -X POST "$BASE_URL/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "likes": 10,
    "reservations": 20,
    "placesRestantes": 80
  }' | json_pp
echo ""

# Test 4: Recommandation - WORKSHOP
echo "4️⃣ Test de recommandation (WORKSHOP)..."
curl -s -X POST "$BASE_URL/recommend" \
  -H "Content-Type: application/json" \
  -d '{
    "categoriesLiked": ["WORKSHOP"]
  }' | json_pp
echo ""

# Test 5: Recommandation - Multiple catégories
echo "5️⃣ Test de recommandation (Multiple catégories)..."
curl -s -X POST "$BASE_URL/recommend" \
  -H "Content-Type: application/json" \
  -d '{
    "categoriesLiked": ["WORKSHOP", "CONFERENCE", "SEMINAR"]
  }' | json_pp
echo ""

echo "=========================================="
echo "✅ Tests terminés!"
echo "=========================================="
