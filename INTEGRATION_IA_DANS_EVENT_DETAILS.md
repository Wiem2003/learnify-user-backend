# 🤖 Intégration IA dans la Page de Détails d'Événement

## ✅ Modifications effectuées

### 1. Import du service AI
```typescript
import { AIService, PredictionResponse, RecommendedEvent } from '../../../services/ai.service';
```

### 2. Injection du service
```typescript
private aiService = inject(AIService);
```

### 3. Propriétés ajoutées
```typescript
// AI Features
aiPrediction: PredictionResponse | null = null;
aiPredictionLoading: boolean = false;
recommendedEvents: RecommendedEvent[] = [];
recommendationsLoading: boolean = false;
```

### 4. Méthodes ajoutées
- `loadAIPrediction()` - Charge automatiquement la prédiction au chargement
- `loadAIRecommendations()` - Charge les recommandations basées sur la catégorie
- `getRiskBadgeClass()` - Retourne la classe CSS pour le badge
- `getRiskIcon()` - Retourne l'icône appropriée
- `getRiskMessage()` - Retourne le message de risque

## 📝 Sections HTML à ajouter

### Section 1: Badge de Prédiction (dans le hero)

Ajouter après le bouton "Réserver" dans le hero:

```html
<!-- AI Prediction Badge -->
<div *ngIf="aiPrediction && !aiPredictionLoading" class="ai-prediction-badge" [ngClass]="getRiskBadgeClass()">
  <i class="ti" [ngClass]="getRiskIcon()"></i>
  <div class="prediction-content">
    <span class="prediction-title">{{ aiPrediction.result === 'RISQUE_ELEVE' ? 'Risque Élevé' : 'Disponible' }}</span>
    <span class="prediction-message">{{ getRiskMessage() }}</span>
    <span class="prediction-reason">{{ aiPrediction.reason }}</span>
  </div>
</div>

<!-- Loading state -->
<div *ngIf="aiPredictionLoading" class="ai-prediction-loading">
  <span class="spinner-border spinner-border-sm"></span>
  <span>Analyse en cours...</span>
</div>
```

### Section 2: Événements Recommandés (après le contenu principal)

Ajouter avant la fermeture de `.container` dans le contenu:

```html
<!-- AI Recommendations Section -->
<section class="recommendations-section" *ngIf="recommendedEvents.length > 0 || recommendationsLoading">
  <div class="section-header">
    <h2><i class="ti ti-sparkles"></i> Événements Recommandés pour Vous</h2>
    <p>Basé sur vos intérêts et cet événement</p>
  </div>
  
  <div *ngIf="recommendationsLoading" class="recommendations-loading">
    <span class="spinner-border"></span>
    <p>Chargement des recommandations...</p>
  </div>
  
  <div *ngIf="!recommendationsLoading && recommendedEvents.length > 0" class="recommendations-grid">
    <div class="recommendation-card" *ngFor="let recEvent of recommendedEvents">
      <div class="rec-badge">
        <i class="ti ti-robot"></i>
        <span>Recommandé par IA</span>
      </div>
      <h3>{{ recEvent.name }}</h3>
      <div class="rec-meta">
        <span class="rec-category">
          <i class="ti ti-tag"></i>
          {{ recEvent.category }}
        </span>
        <span class="rec-date">
          <i class="ti ti-calendar"></i>
          {{ recEvent.date | date:'shortDate' }}
        </span>
      </div>
      <p class="rec-description">{{ recEvent.description }}</p>
      <div class="rec-footer">
        <span class="rec-seats">
          <i class="ti ti-users"></i>
          {{ recEvent.availableSeats }} places disponibles
        </span>
        <a [routerLink]="['/events', recEvent.id]" class="btn-view-event">
          Voir l'événement
          <i class="ti ti-arrow-right"></i>
        </a>
      </div>
    </div>
  </div>
</section>
```

## 🎨 Styles CSS à ajouter

Ajouter dans la section `styles`:

```scss
// AI Prediction Badge
.ai-prediction-badge {
  margin-top: 24px;
  padding: 20px;
  border-radius: 16px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  backdrop-filter: blur(10px);
  animation: slideIn 0.5s ease;
  
  i {
    font-size: 32px;
    margin-top: 4px;
  }
  
  &.risk-high {
    background: rgba(239, 68, 68, 0.15);
    border: 2px solid rgba(239, 68, 68, 0.3);
    
    i {
      color: #ef4444;
    }
    
    .prediction-title {
      color: #ef4444;
    }
  }
  
  &.risk-low {
    background: rgba(16, 185, 129, 0.15);
    border: 2px solid rgba(16, 185, 129, 0.3);
    
    i {
      color: #10b981;
    }
    
    .prediction-title {
      color: #10b981;
    }
  }
}

.prediction-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.prediction-title {
  font-size: 18px;
  font-weight: 700;
}

.prediction-message {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
}

.prediction-reason {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
}

.ai-prediction-loading {
  margin-top: 24px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

// Recommendations Section
.recommendations-section {
  margin-top: 60px;
  padding: 40px 0;
  border-top: 2px solid rgba(61, 61, 96, 0.08);
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
  
  h2 {
    font-size: 32px;
    font-weight: 800;
    color: var(--color-primary);
    margin: 0 0 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    
    i {
      color: var(--color-accent);
      font-size: 36px;
    }
  }
  
  p {
    font-size: 16px;
    color: var(--color-gray-500);
    margin: 0;
  }
}

.recommendations-loading {
  text-align: center;
  padding: 60px 20px;
  
  .spinner-border {
    width: 3rem;
    height: 3rem;
    color: var(--color-accent);
    margin-bottom: 16px;
  }
  
  p {
    color: var(--color-gray-500);
    font-size: 15px;
  }
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.recommendation-card {
  background: var(--color-white);
  border-radius: 20px;
  padding: 24px;
  box-shadow: var(--shadow-card);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--color-accent), var(--color-cta));
  }
}

.rec-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, rgba(246, 189, 96, 0.15), rgba(200, 70, 48, 0.15));
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-accent);
  margin-bottom: 16px;
  
  i {
    font-size: 14px;
  }
}

.recommendation-card h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0 0 12px;
  line-height: 1.3;
}

.rec-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  
  span {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--color-gray-500);
    
    i {
      font-size: 16px;
      color: var(--color-secondary);
    }
  }
}

.rec-category {
  font-weight: 600;
}

.rec-description {
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-gray-600);
  margin: 0 0 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.rec-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid rgba(61, 61, 96, 0.08);
}

.rec-seats {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #10b981;
  font-weight: 600;
  
  i {
    font-size: 16px;
  }
}

.btn-view-event {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--color-primary);
  color: #fff;
  border-radius: 10px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--color-secondary);
    transform: translateX(4px);
  }
  
  i {
    font-size: 14px;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 992px) {
  .recommendations-grid {
    grid-template-columns: 1fr;
  }
}
```

## 🚀 Résultat attendu

### Quand l'utilisateur ouvre la page d'un événement:

1. **Prédiction automatique** (dans le hero, sous le bouton Réserver):
   - Badge rouge si RISQUE_ELEVE avec message d'alerte
   - Badge vert si RISQUE_FAIBLE avec message rassurant
   - Raison de la prédiction affichée

2. **Recommandations automatiques** (en bas de page):
   - Section "Événements Recommandés pour Vous"
   - 3 cartes d'événements similaires
   - Badge "Recommandé par IA" sur chaque carte
   - Bouton "Voir l'événement" pour naviguer

### Comportement:
- ✅ Chargement automatique au montage du composant
- ✅ Pas besoin de cliquer sur un bouton
- ✅ Affichage élégant et intuitif
- ✅ Animation fluide
- ✅ Responsive design

## 📝 Fichier modifié

```
FrontOffice-main/src/app/pages/events/client-event-details/client-event-details.component.ts
```

## 🎯 Prochaines étapes

1. Copier les sections HTML dans le template du composant
2. Copier les styles CSS dans la section styles
3. Redémarrer le frontend si nécessaire
4. Tester en ouvrant un événement

## 📍 Où ajouter le code

### HTML Section 1 (Prédiction)
Ajouter après cette ligne dans le template:
```html
<button class="btn-register-hero" ...>
```

### HTML Section 2 (Recommandations)
Ajouter avant la fermeture de:
```html
</div> <!-- fin de .container -->
```

### CSS
Ajouter à la fin de la section `styles` du composant.

---

**Note:** Le composant est déjà modifié avec la logique TypeScript. Il ne reste qu'à ajouter les sections HTML et CSS pour voir les fonctionnalités IA en action!
