import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KidsGame, GameCategory, GameQuestion } from '../models/kids-game.models';

@Injectable({
  providedIn: 'root'
})
export class KidsGameService {
  private apiUrl = '/api/kids-games';

  constructor(private http: HttpClient) {}

  // Category Management
  getAllCategories(): Observable<GameCategory[]> {
    return this.http.get<GameCategory[]>(`${this.apiUrl}/categories`);
  }

  getCategoryById(id: number): Observable<GameCategory> {
    return this.http.get<GameCategory>(`${this.apiUrl}/categories/${id}`);
  }

  createCategory(category: GameCategory): Observable<GameCategory> {
    return this.http.post<GameCategory>(`${this.apiUrl}/categories`, category);
  }

  updateCategory(id: number, category: GameCategory): Observable<GameCategory> {
    return this.http.put<GameCategory>(`${this.apiUrl}/categories/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categories/${id}`);
  }

  // Game Management
  getAllGames(): Observable<KidsGame[]> {
    return this.http.get<KidsGame[]>(this.apiUrl);
  }

  getPublishedGames(): Observable<KidsGame[]> {
    return this.http.get<KidsGame[]>(`${this.apiUrl}/published`);
  }

  getGamesByCategory(categoryId: number): Observable<KidsGame[]> {
    return this.http.get<KidsGame[]>(`${this.apiUrl}/category/${categoryId}`);
  }

  getPublishedGamesByCategory(categoryId: number): Observable<KidsGame[]> {
    return this.http.get<KidsGame[]>(`${this.apiUrl}/published/category/${categoryId}`);
  }

  getGameById(id: number): Observable<KidsGame> {
    return this.http.get<KidsGame>(`${this.apiUrl}/${id}`);
  }

  createGame(game: KidsGame): Observable<KidsGame> {
    return this.http.post<KidsGame>(this.apiUrl, game);
  }

  updateGame(id: number, game: KidsGame): Observable<KidsGame> {
    return this.http.put<KidsGame>(`${this.apiUrl}/${id}`, game);
  }

  deleteGame(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Question Management
  getQuestionsByGame(gameId: number): Observable<GameQuestion[]> {
    return this.http.get<GameQuestion[]>(`${this.apiUrl}/${gameId}/questions`);
  }

  getQuestionById(id: number): Observable<GameQuestion> {
    return this.http.get<GameQuestion>(`${this.apiUrl}/questions/${id}`);
  }

  createQuestion(question: GameQuestion): Observable<GameQuestion> {
    return this.http.post<GameQuestion>(`${this.apiUrl}/questions`, question);
  }

  updateQuestion(id: number, question: GameQuestion): Observable<GameQuestion> {
    return this.http.put<GameQuestion>(`${this.apiUrl}/questions/${id}`, question);
  }

  deleteQuestion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/questions/${id}`);
  }
}
