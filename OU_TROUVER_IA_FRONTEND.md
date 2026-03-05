# 📍 Où trouver l'IA Prédiction et Recommandation dans le Frontend

## 🎯 Accès direct à la page de test

### URL de la page
```
http://localhost:4201/ai-test
```

### Comment y accéder

1. **Démarrer le frontend**:
```bash
cd FrontOffice-main
npm start
```

2. **Ouvrir votre navigateur** et aller sur:
```
http://localhost:4201/ai-test
```

## 📂 Fichiers créés dans le frontend

### Service AI
```
FrontOffice-main/src/app/services/ai.service.ts
```
Ce fichier contient les méthodes pour appeler le backend:
- `testAIService()` - Test du service
- `predictEventCompletion()` - Prédiction
- `recommendEvents()` - Recommandation

### Composant de test
```
FrontOffice-main/src/app/pages/ai-test/
├── ai-test.component.ts       ← Logique du composant
├── ai-test.component.html     ← Interface utilisateur
└── ai-test.component.scss     ← Styles
```

### Route configurée
```typescript
// Dans app.routes.ts
{ path: 'ai-test', component: AITestComponent }
```

## 🖥️ Interface de la page /ai-test

La page contient 3 sections:

### 1️⃣ Test du Service AI
```
┌─────────────────────────────────────┐
│ 1️⃣ Test du Service AI              │
├─────────────────────────────────────┤
│ [Tester le service]                 │
│ ✅ AI Service is running!           │
└─────────────────────────────────────┘
```

### 2️⃣ Prédiction - Événement Complet
```
┌─────────────────────────────────────┐
│ 2️⃣ Prédiction - Événement Complet  │
├─────────────────────────────────────┤
│ Nombre de likes:      [150]         │
│ Nombre de réservations: [90]        │
│ Places restantes:     [10]          │
│                                     │
│ [Prédire]                           │
│                                     │
│ Résultat: RISQUE_ELEVE              │
│ Raison: Beaucoup de likes...        │
└─────────────────────────────────────┘
```

### 3️⃣ Recommandation d'Événements
```
┌─────────────────────────────────────┐
│ 3️⃣ Recommandation d'Événements     │
├─────────────────────────────────────┤
│ Catégories aimées:                  │
│ [WORKSHOP] [CONFERENCE] [SEMINAR]   │
│                                     │
│ [Obtenir des recommandations]       │
│                                     │
│ Événements recommandés (5):         │
│ ┌─────────────┐ ┌─────────────┐   │
│ │ Workshop    │ │ Conférence  │   │
│ │ Java        │ │ Tech 2026   │   │
│ └─────────────┘ └─────────────┘   │
└─────────────────────────────────────┘
```

## 🚀 Comment tester maintenant

### Étape 1: Vérifier que le backend est démarré
```bash
# Dans un terminal
cd BackRahma
mvn spring-boot:run
```

Le backend doit afficher:
```
Started BackRahmaApplication in X seconds
Tomcat started on port 8080 (http) with context path '/back'
```

### Étape 2: Démarrer le frontend
```bash
# Dans un autre terminal
cd FrontOffice-main
npm start
```

Le frontend doit afficher:
```
** Angular Live Development Server is listening on localhost:4201 **
```

### Étape 3: Ouvrir la page de test
Dans votre navigateur, allez sur:
```
http://localhost:4201/ai-test
```

## 🧪 Tests à effectuer

### Test 1: Service AI
1. Cliquez sur "Tester le service"
2. Vous devez voir: "✅ AI Service is running!"

### Test 2: Prédiction
1. Modifiez les valeurs (likes, réservations, places)
2. Cliquez sur "Prédire"
3. Vous verrez un badge "RISQUE_ELEVE" ou "RISQUE_FAIBLE"

**Exemples:**
- Likes: 150, Réservations: 90, Places: 10 → RISQUE_ELEVE
- Likes: 10, Réservations: 20, Places: 80 → RISQUE_FAIBLE

### Test 3: Recommandation
1. Cliquez sur les catégories (WORKSHOP, CONFERENCE, etc.)
2. Cliquez sur "Obtenir des recommandations"
3. Vous verrez une liste d'événements recommandés

## 📱 Captures d'écran de l'interface

### En-tête de la page
```
🤖 Test des Fonctionnalités IA
Testez les fonctionnalités d'intelligence artificielle (Google Gemini)
```

### Boutons et formulaires
- Boutons bleus pour les actions
- Champs de saisie pour les valeurs
- Badges colorés pour les résultats
- Cartes pour les événements recommandés

## 🔗 Liens rapides

### URLs importantes
```
Frontend:  http://localhost:4201
Page IA:   http://localhost:4201/ai-test
Backend:   http://localhost:8080/back
API Test:  http://localhost:8080/back/api/ai/test
```

### Endpoints backend utilisés
```
GET  /back/api/ai/test          → Test du service
POST /back/api/ai/predict       → Prédiction
POST /back/api/ai/recommend     → Recommandation
```

## 💡 Ajouter un lien dans la navbar (optionnel)

Si vous voulez ajouter un lien dans le menu de navigation:

1. Ouvrir `FrontOffice-main/src/app/components/navbar/navbar.component.html`

2. Ajouter après la section "Events":
```html
<!-- IA Test -->
<li class="nav-item">
  <a href="/ai-test" class="nav-link" [class.active]="isActiveRoute('/ai-test')"
     (click)="navigateToPage('/ai-test'); $event.preventDefault()">
    <i class="ti ti-robot"></i> IA Test
  </a>
</li>
```

## 🎨 Personnalisation

### Changer les couleurs
Modifier `FrontOffice-main/src/app/pages/ai-test/ai-test.component.scss`

### Changer le texte
Modifier `FrontOffice-main/src/app/pages/ai-test/ai-test.component.html`

### Changer la logique
Modifier `FrontOffice-main/src/app/pages/ai-test/ai-test.component.ts`

## 🐛 Problèmes courants

### "Cannot GET /ai-test"
→ Le frontend n'est pas démarré. Lancez `npm start`

### "404 Not Found"
→ Le backend n'est pas démarré. Lancez `mvn spring-boot:run`

### "CORS error"
→ Vérifiez que le backend a `@CrossOrigin(origins = "*")` dans le controller

### Rien ne s'affiche
→ Ouvrez la console du navigateur (F12) pour voir les erreurs

## ✅ Checklist

- [ ] Backend démarré (port 8080)
- [ ] Frontend démarré (port 4201)
- [ ] Page accessible: http://localhost:4201/ai-test
- [ ] Test du service réussi
- [ ] Prédiction fonctionne
- [ ] Recommandation fonctionne

## 📞 Besoin d'aide?

Consultez:
- `FRONTEND_AI_TEST_GUIDE.md` - Guide complet
- `AI_COMPLETE_SUMMARY.md` - Résumé de l'implémentation
- Console du navigateur (F12) - Pour voir les erreurs

---

## 🎯 Résumé rapide

**Pour tester l'IA dans le frontend:**

1. Démarrer backend: `cd BackRahma && mvn spring-boot:run`
2. Démarrer frontend: `cd FrontOffice-main && npm start`
3. Ouvrir: `http://localhost:4201/ai-test`
4. Tester les 3 fonctionnalités sur la page

**C'est tout!** 🚀
