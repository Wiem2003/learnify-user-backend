import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AIService, PredictionRequest, PredictionResponse, RecommendedEvent } from '../../services/ai.service';

@Component({
  selector: 'app-ai-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-test.component.html',
  styleUrls: ['./ai-test.component.scss']
})
export class AITestComponent implements OnInit {
  // Test du service
  serviceStatus: string = '';
  serviceLoading: boolean = false;

  // Prédiction
  predictionRequest: PredictionRequest = {
    likes: 150,
    reservations: 90,
    placesRestantes: 10
  };
  predictionResponse: PredictionResponse | null = null;
  predictionLoading: boolean = false;
  predictionError: string = '';

  // Recommandation
  selectedCategories: string[] = ['WORKSHOP'];
  availableCategories: string[] = ['WORKSHOP', 'CONFERENCE', 'SEMINAR', 'WEBINAR', 'TRAINING'];
  recommendedEvents: RecommendedEvent[] = [];
  recommendationLoading: boolean = false;
  recommendationError: string = '';

  constructor(private aiService: AIService) {}

  ngOnInit(): void {
    this.testService();
  }

  /**
   * Test si le service AI fonctionne
   */
  testService(): void {
    this.serviceLoading = true;
    this.serviceStatus = '';

    this.aiService.testAIService().subscribe({
      next: (response) => {
        this.serviceStatus = '✅ ' + response;
        this.serviceLoading = false;
      },
      error: (error) => {
        this.serviceStatus = '❌ Erreur: ' + error.message;
        this.serviceLoading = false;
      }
    });
  }

  /**
   * Teste la prédiction
   */
  testPrediction(): void {
    this.predictionLoading = true;
    this.predictionResponse = null;
    this.predictionError = '';

    this.aiService.predictEventCompletion(this.predictionRequest).subscribe({
      next: (response) => {
        this.predictionResponse = response;
        this.predictionLoading = false;
      },
      error: (error) => {
        this.predictionError = 'Erreur: ' + error.message;
        this.predictionLoading = false;
      }
    });
  }

  /**
   * Teste la recommandation
   */
  testRecommendation(): void {
    this.recommendationLoading = true;
    this.recommendedEvents = [];
    this.recommendationError = '';

    this.aiService.recommendEvents({ categoriesLiked: this.selectedCategories }).subscribe({
      next: (events) => {
        this.recommendedEvents = events;
        this.recommendationLoading = false;
      },
      error: (error) => {
        this.recommendationError = 'Erreur: ' + error.message;
        this.recommendationLoading = false;
      }
    });
  }

  /**
   * Toggle une catégorie
   */
  toggleCategory(category: string): void {
    const index = this.selectedCategories.indexOf(category);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(category);
    }
  }

  /**
   * Vérifie si une catégorie est sélectionnée
   */
  isCategorySelected(category: string): boolean {
    return this.selectedCategories.includes(category);
  }

  /**
   * Retourne la classe CSS pour le badge de risque
   */
  getRiskBadgeClass(): string {
    if (!this.predictionResponse) return '';
    return this.predictionResponse.result === 'RISQUE_ELEVE' ? 'badge-danger' : 'badge-success';
  }
}
