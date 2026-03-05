# 🚀 Quick Start - Google AI Integration

## ⚡ Démarrage rapide en 3 étapes

### 1️⃣ Vérifier la configuration
```bash
# Vérifier que la clé API est dans application.properties
cat src/main/resources/application.properties | grep google.ai
```

### 2️⃣ Compiler et lancer le backend
```bash
cd BackRahma
mvn clean install
mvn spring-boot:run
```

### 3️⃣ Tester les endpoints
```bash
# Test simple
curl http://localhost:8080/back/api/ai/test

# Test prédiction
curl -X POST http://localhost:8080/back/api/ai/predict \
  -H "Content-Type: application/json" \
  -d '{"likes":50,"reservations":80,"placesRestantes":20}'

# Test recommandation
curl -X POST http://localhost:8080/back/api/ai/recommend \
  -H "Content-Type: application/json" \
  -d '{"categoriesLiked":["WORKSHOP","CONFERENCE"]}'
```

---

## 📡 Endpoints disponibles

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/back/api/ai/test` | GET | Test du service |
| `/back/api/ai/predict` | POST | Prédiction événement complet |
| `/back/api/ai/recommend` | POST | Recommandation d'événements |

---

## 📋 Exemples de réponses

### Prédiction
```json
{
  "result": "RISQUE_ELEVE",
  "reason": "Beaucoup de likes et peu de places restantes"
}
```

### Recommandation
```json
[
  {
    "id": 1,
    "name": "Workshop Java",
    "category": "WORKSHOP",
    "date": "2026-03-10",
    "description": "...",
    "availableSeats": 50
  }
]
```

---

## 🔑 Configuration

La clé API Google AI est configurée dans `application.properties`:
```properties
google.ai.api.key=AIzaSyD52RVSuUgBAy7HU3PKfkSnkOPwKXWHCMw
google.ai.model=gemini-1.5-flash
```

---

## 📦 Fichiers créés

### Backend (Java)
- `dto/PredictionRequest.java`
- `dto/PredictionResponse.java`
- `dto/RecommendationRequest.java`
- `dto/RecommendedEvent.java`
- `Service/GoogleAIService.java`
- `Service/PredictionAIService.java`
- `Service/RecommendationAIService.java`
- `Controller/AIController.java`

### Documentation
- `AI_INTEGRATION_GUIDE.md` - Guide complet
- `AI_QUICK_START.md` - Ce fichier
- `AI_POSTMAN_COLLECTION.json` - Collection Postman
- `TEST_AI_ENDPOINTS.sh` - Script de test

---

## 🛠️ Dépendances ajoutées

Dans `pom.xml`:
```xml
<!-- Google Generative AI (Gemini) -->
<dependency>
    <groupId>com.google.cloud</groupId>
    <artifactId>google-cloud-aiplatform</artifactId>
    <version>3.35.0</version>
</dependency>

<!-- HTTP Client for Google AI API -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webflux</artifactId>
</dependency>
```

---

## ✅ Checklist

- [x] Clé API configurée
- [x] Dépendances ajoutées
- [x] Services créés
- [x] Controller créé
- [x] Endpoints testés
- [ ] Intégration frontend (prochaine étape)

---

## 🎯 Prochaines étapes

1. Tester avec Postman ou cURL
2. Créer le service Angular `ai.service.ts`
3. Intégrer dans les composants frontend
4. Afficher les prédictions dans l'UI

---

## 📞 Besoin d'aide ?

Consultez `AI_INTEGRATION_GUIDE.md` pour plus de détails.
