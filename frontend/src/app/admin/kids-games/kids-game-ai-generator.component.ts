import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { KidsGameService } from '../../kids/services/kids-game.service';
import { GameCategory } from '../../kids/models/kids-game.models';

@Component({
  selector: 'app-kids-game-ai-generator',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container-fluid py-4">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card shadow">
            <div class="card-header bg-primary text-white">
              <h4 class="mb-0">
                <i class="bi bi-sparkles"></i> AI Kids Game Generator
              </h4>
              <p class="mb-0 mt-2 small">Générez automatiquement des jeux pour enfants avec l'IA</p>
            </div>
            
            <div class="card-body">
              <form (ngSubmit)="generateGame()" #gameForm="ngForm">
                <div class="mb-4">
                  <label class="form-label fw-bold">Catégorie *</label>
                  <div class="row g-3">
                    <div class="col-md-4" *ngFor="let cat of categories">
                      <div class="card category-card" 
                           [class.selected]="selectedCategory === cat.id"
                           (click)="selectCategory(cat.id!)"
                           style="cursor: pointer;">
                        <div class="card-body text-center">
                          <div style="font-size: 3rem;">{{cat.icon}}</div>
                          <h6 class="mt-2">{{cat.name}}</h6>
                          <small class="text-muted">{{cat.description}}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label fw-bold">Nombre de questions</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    name="questionCount"
                    [(ngModel)]="questionCount" 
                    min="3" 
                    max="10" 
                    required>
                  <small class="text-muted">Entre 3 et 10 questions</small>
                </div>

                <div class="alert alert-info">
                  <i class="bi bi-info-circle"></i>
                  L'IA va générer des questions avec des emojis et des mots simples adaptés aux enfants de 5-10 ans.
                </div>

                <div *ngIf="error" class="alert alert-danger">
                  <i class="bi bi-exclamation-triangle"></i> {{error}}
                </div>

                <div *ngIf="generating" class="text-center py-4">
                  <div class="spinner-border text-primary mb-3" role="status">
                    <span class="visually-hidden">Génération en cours...</span>
                  </div>
                  <p class="text-muted">L'IA génère votre jeu pour enfants...</p>
                </div>

                <div class="d-flex gap-2">
                  <button 
                    type="submit" 
                    class="btn btn-primary" 
                    [disabled]="!selectedCategory || generating">
                    <i class="bi bi-sparkles"></i> Générer avec l'IA
                  </button>
                  <button 
                    type="button" 
                    class="btn btn-secondary" 
                    routerLink="/dashboard/kids-games">
                    Annuler
                  </button>
                </div>
              </form>

              <div *ngIf="generatedGame" class="mt-4">
                <hr>
                <h5 class="text-success">
                  <i class="bi bi-check-circle"></i> Jeu généré avec succès!
                </h5>
                <div class="card">
                  <div class="card-body">
                    <h6>{{generatedGame.title}}</h6>
                    <p class="text-muted">{{generatedGame.description}}</p>
                    <p><strong>Questions générées:</strong> {{generatedGame.questions.length}}</p>
                    
                    <div class="mt-3">
                      <h6>Aperçu des questions:</h6>
                      <div class="list-group">
                        <div class="list-group-item" *ngFor="let q of generatedGame.questions; let i = index">
                          <div class="d-flex align-items-center gap-3">
                            <span style="font-size: 2rem;">{{q.imageEmoji}}</span>
                            <div>
                              <strong>{{q.correctAnswer}}</strong>
                              <br>
                              <small class="text-muted">Options: {{q.options.join(', ')}}</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="mt-3">
                      <button class="btn btn-success" (click)="saveGame()" [disabled]="saving">
                        <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>
                        <i class="bi bi-save" *ngIf="!saving"></i> Enregistrer le jeu
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .category-card {
      transition: all 0.3s;
      border: 2px solid transparent;
    }
    .category-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .category-card.selected {
      border-color: #0d6efd;
      background-color: #e7f1ff;
    }
  `]
})
export class KidsGameAiGeneratorComponent implements OnInit {
  categories: GameCategory[] = [];
  selectedCategory: number | null = null;
  questionCount: number = 5;
  generating: boolean = false;
  saving: boolean = false;
  error: string = '';
  generatedGame: any = null;

  private aiApiUrl = 'http://localhost:8082/api/ai/quiz';

  constructor(
    private http: HttpClient,
    private kidsGameService: KidsGameService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.kidsGameService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.error = 'Erreur lors du chargement des catégories';
      }
    });
  }

  selectCategory(categoryId: number): void {
    this.selectedCategory = categoryId;
    this.error = '';
  }

  generateGame(): void {
    if (!this.selectedCategory) {
      this.error = 'Veuillez sélectionner une catégorie';
      return;
    }

    this.generating = true;
    this.error = '';
    this.generatedGame = null;

    // Find category name for AI
    const category = this.categories.find(c => c.id === this.selectedCategory);
    const categoryName = category?.name.toLowerCase() || 'animals';

    this.http.post(`${this.aiApiUrl}/generate-kids-game?category=${categoryName}&questionCount=${this.questionCount}`, {})
      .subscribe({
        next: (response: any) => {
          this.generatedGame = response;
          this.generating = false;
        },
        error: (error: any) => {
          console.error('Error generating game:', error);
          this.error = error.error?.message || 'Erreur lors de la génération du jeu';
          this.generating = false;
        }
      });
  }

  saveGame(): void {
    if (!this.generatedGame || !this.selectedCategory) return;

    this.saving = true;
    this.error = '';

    console.log('🔍 DEBUG: Saving game with category:', this.selectedCategory);

    // Create kids game using the new service
    const gameData = {
      title: this.generatedGame.title,
      description: this.generatedGame.description,
      categoryId: this.selectedCategory,
      status: 'PUBLISHED' as const
    };

    console.log('🔍 DEBUG: Game data:', gameData);

    this.kidsGameService.createGame(gameData).subscribe({
      next: (createdGame) => {
        console.log('✅ Game created:', createdGame);
        
        // Add questions one by one
        let savedQuestions = 0;
        const totalQuestions = this.generatedGame.questions.length;
        
        this.generatedGame.questions.forEach((q: any, index: number) => {
          const questionData = {
            gameId: createdGame.id!,
            imageEmoji: q.imageEmoji,
            correctAnswer: q.correctAnswer,
            options: q.options,
            points: q.points || 1
          };
          
          console.log(`🔍 DEBUG: Saving question ${index + 1}:`, questionData);
          
          this.kidsGameService.createQuestion(questionData).subscribe({
            next: (savedQuestion) => {
              console.log(`✅ Question ${index + 1} saved:`, savedQuestion);
              savedQuestions++;
              
              if (savedQuestions === totalQuestions) {
                this.saving = false;
                alert('Jeu enregistré avec succès!');
                this.router.navigate(['/dashboard/kids-games']);
              }
            },
            error: (error: any) => {
              console.error(`❌ Error saving question ${index + 1}:`, error);
              this.error = 'Erreur lors de l\'enregistrement des questions';
              this.saving = false;
            }
          });
        });
      },
      error: (error: any) => {
        console.error('❌ Error saving game:', error);
        this.error = error.error?.message || 'Erreur lors de l\'enregistrement du jeu';
        this.saving = false;
      }
    });
  }
}
