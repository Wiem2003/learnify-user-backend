import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PredictionRequest {
  likes: number;
  reservations: number;
  placesRestantes: number;
}

export interface PredictionResponse {
  result: string;  // "RISQUE_ELEVE" ou "RISQUE_FAIBLE"
  reason: string;
}

export interface RecommendationRequest {
  categoriesLiked: string[];
}

export interface RecommendedEvent {
  id: number;
  name: string;
  category: string;
  date: string;
  description: string;
  availableSeats: number;
}

@Injectable({
  providedIn: 'root'
})
export class AIService {
  private apiUrl = 'http://localhost:8080/back/api/ai';

  constructor(private http: HttpClient) {}

  /**
   * Test si le service AI fonctionne
   */
  testAIService(): Observable<string> {
    return this.http.get(`${this.apiUrl}/test`, { responseType: 'text' });
  }

  /**
   * Prédit si un événement risque d'être complet bientôt
   */
  predictEventCompletion(request: PredictionRequest): Observable<PredictionResponse> {
    return this.http.post<PredictionResponse>(`${this.apiUrl}/predict`, request);
  }

  /**
   * Recommande des événements basés sur les catégories aimées
   */
  recommendEvents(request: RecommendationRequest): Observable<RecommendedEvent[]> {
    return this.http.post<RecommendedEvent[]>(`${this.apiUrl}/recommend`, request);
  }
}
