# 🤖 Guide d'Intégration Google AI (Gemini)

## 📋 Vue d'ensemble

Ce module intègre Google AI (Gemini) pour fournir deux fonctionnalités intelligentes :
1. **Prédiction** : Prédit si un événement risque d'être complet bientôt
2. **Recommandation** : Recommande des événements basés sur les préférences utilisateur

---

## 🔑 Configuration

### API Key
La clé API Google AI est configurée dans `application.properties` :

```properties
google.ai.api.key=AIzaSyD52RVSuUgBAy7HU3PKfkSnkOPwKXWHCMw
google.ai.model=gemini-1.5-flash
```

⚠️ **IMPORTANT** : Ne jamais exposer cette clé dans le frontend !

---

## 📡 Endpoints REST

### 1️⃣ Prédiction d'événement complet

**Endpoint** : `POST /back/api/ai/predict`

**Description** : Analyse les données d'un événement et prédit s'il risque d'être complet bientôt.

**Request Body** :
```json
{
  "likes": 50,
  "reservations": 80,
  "placesRestantes": 20
}
```

**Response** :
```json
{
  "result": "RISQUE_ELEVE",
  "reason": "Beaucoup de likes et peu de places restantes"
}
```

**Valeurs possibles pour `result`** :
- `RISQUE_ELEVE` : L'événement risque d'être complet rapidement
- `RISQUE_FAIBLE` : L'événement a encore de la disponibilité

---

### 2️⃣ Recommandation d'événements

**Endpoint** : `POST /back/api/ai/recommend`

**Description** : Recommande des événements basés sur les catégories aimées par l'utilisateur.

**Request Body** :
```json
{
  "categoriesLiked": ["WORKSHOP", "CONFERENCE"]
}
```

**Response** :
```json
[
  {
    "id": 1,
    "name": "Workshop Java Spring Boot",
    "category": "WORKSHOP",
    "date": "2026-03-10",
    "description": "Apprendre Spring Boot de A à Z",
    "availableSeats": 50
  },
  {
    "id": 3,
    "name": "Conférence Tech 2026",
    "category": "CONFERENCE",
    "date": "2026-03-15",
    "description": "Les dernières tendances tech",
    "availableSeats": 100
  }
]
```

---

### 3️⃣ Test de l'API

**Endpoint** : `GET /back/api/ai/test`

**Description** : Vérifie que le service AI fonctionne.

**Response** :
```
AI Service is running!
```

---

## 🧪 Exemples de Test avec cURL

### Test de prédiction
```bash
curl -X POST http://localhost:8080/back/api/ai/predict \
  -H "Content-Type: application/json" \
  -d '{
    "likes": 50,
    "reservations": 80,
    "placesRestantes": 20
  }'
```

### Test de recommandation
```bash
curl -X POST http://localhost:8080/back/api/ai/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "categoriesLiked": ["WORKSHOP", "CONFERENCE"]
  }'
```

### Test du service
```bash
curl http://localhost:8080/back/api/ai/test
```

---

## 📦 Fichiers créés

### DTOs
- `PredictionRequest.java` - Requête de prédiction
- `PredictionResponse.java` - Réponse de prédiction
- `RecommendationRequest.java` - Requête de recommandation
- `RecommendedEvent.java` - Événement recommandé

### Services
- `GoogleAIService.java` - Service de base pour appeler l'API Google AI
- `PredictionAIService.java` - Service de prédiction
- `RecommendationAIService.java` - Service de recommandation

### Controller
- `AIController.java` - Controller REST pour les endpoints AI

---

## 🔧 Architecture

```
Frontend (Angular)
    ↓
AIController (/api/ai/*)
    ↓
PredictionAIService / RecommendationAIService
    ↓
GoogleAIService
    ↓
Google AI API (Gemini)
```

---

## 🛡️ Gestion des erreurs

En cas d'erreur lors de l'appel à l'API Google AI :
- **Prédiction** : Retourne `RISQUE_FAIBLE` par défaut
- **Recommandation** : Retourne les 5 premiers événements disponibles

---

## 💡 Cas d'usage

### Prédiction
- Afficher un badge "🔥 Bientôt complet" sur les événements à risque élevé
- Envoyer des notifications aux utilisateurs intéressés
- Prioriser les événements dans les recommandations

### Recommandation
- Page d'accueil personnalisée
- Section "Événements recommandés pour vous"
- Emails de suggestions d'événements

---

## 🚀 Prochaines étapes

Pour intégrer dans le frontend Angular :

1. Créer un service `ai.service.ts`
2. Appeler les endpoints depuis les composants
3. Afficher les prédictions et recommandations dans l'UI

Exemple de service Angular :
```typescript
@Injectable({ providedIn: 'root' })
export class AIService {
  private apiUrl = 'http://localhost:8080/back/api/ai';

  constructor(private http: HttpClient) {}

  predictEventCompletion(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/predict`, data);
  }

  recommendEvents(categories: string[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/recommend`, { categoriesLiked: categories });
  }
}
```

---

## 📊 Exemple d'intégration dans EventController

Vous pouvez ajouter la prédiction automatique dans `EventController` :

```java
@GetMapping("/{id}")
public ResponseEntity<EventWithPrediction> getEventWithPrediction(@PathVariable Long id) {
    Event event = eventService.getEventById(id);
    
    // Appel à l'IA pour prédiction
    PredictionRequest predRequest = new PredictionRequest(
        event.getLikesCount(),
        event.getReservationsCount(),
        event.getAvailableSeats()
    );
    PredictionResponse prediction = predictionAIService.predictEventCompletion(predRequest);
    
    return ResponseEntity.ok(new EventWithPrediction(event, prediction));
}
```

---

## ✅ Checklist de déploiement

- [ ] Vérifier que la clé API est valide
- [ ] Tester les endpoints avec Postman
- [ ] Ajouter des logs pour le debugging
- [ ] Gérer les timeouts de l'API
- [ ] Mettre en cache les recommandations (optionnel)
- [ ] Monitorer l'utilisation de l'API Google AI

---

## 📞 Support

En cas de problème :
1. Vérifier que la clé API est correcte
2. Vérifier la connexion internet
3. Consulter les logs du backend
4. Tester avec l'endpoint `/api/ai/test`
