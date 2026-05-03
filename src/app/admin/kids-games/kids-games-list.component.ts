import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { QuizService, QuestionService } from '../../quiz-feedback/services/quiz-feedback.services';
import { Quiz } from '../../quiz-feedback/models/quiz-feedback.models';

@Component({
  selector: 'app-kids-games-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Kids Games Management</h2>
        <div class="btn-group">
          <button class="btn btn-primary" (click)="createNewGame()">
            <i class="bi bi-plus-circle"></i> New Kids Game
          </button>
          <button class="btn btn-success" (click)="generateWithAI()">
            <i class="bi bi-sparkles"></i> Generate with AI
          </button>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-md-4" *ngFor="let category of categories">
          <div class="card" [style.border-left]="'4px solid ' + category.color">
            <div class="card-body">
              <h5 class="card-title">
                <span style="font-size: 2rem;">{{category.icon}}</span>
                {{category.name}}
              </h5>
              <p class="text-muted">{{getGameCount(category.id)}} games</p>
              <button class="btn btn-sm btn-outline-primary" (click)="viewCategory(category.id)">
                View Games
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">All Kids Games</h5>
        </div>
        <div class="card-body">
          <div *ngIf="loading" class="text-center py-4">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <div *ngIf="!loading && games.length === 0" class="text-center py-4">
            <p class="text-muted">No kids games found. Create your first game!</p>
          </div>

          <div *ngIf="!loading && games.length > 0" class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Questions</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let game of games">
                  <td>{{game.title}}</td>
                  <td>
                    <span class="badge" [style.background-color]="getCategoryColor(game.category)">
                      {{getCategoryIcon(game.category)}} {{game.category}}
                    </span>
                  </td>
                  <td>{{game.questionCount || 0}}</td>
                  <td>
                    <span class="badge" [ngClass]="{
                      'bg-success': game.status === 'PUBLISHED',
                      'bg-warning': game.status === 'DRAFT',
                      'bg-secondary': game.status === 'ARCHIVED'
                    }">
                      {{game.status}}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary me-2" 
                            (click)="editGame(game.id!)">
                      <i class="bi bi-pencil"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-outline-info me-2" 
                            (click)="manageQuestions(game.id!)">
                      <i class="bi bi-list-ul"></i> Questions
                    </button>
                    <button class="btn btn-sm btn-outline-danger" 
                            (click)="deleteGame(game.id!)">
                      <i class="bi bi-trash"></i> Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      margin-bottom: 1rem;
      transition: transform 0.2s;
    }
    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
  `]
})
export class KidsGamesListComponent implements OnInit {
  games: Quiz[] = [];
  loading = false;

  categories = [
    { id: 'animals', name: 'Animals', icon: '🐾', color: '#FF6B9D' },
    { id: 'colors', name: 'Colors', icon: '🎨', color: '#4ECDC4' },
    { id: 'numbers', name: 'Numbers', icon: '🔢', color: '#FFE66D' }
  ];

  constructor(
    private quizService: QuizService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadGames();
  }

  loadGames(): void {
    this.loading = true;
    this.quizService.getAll().subscribe({
      next: (quizzes: Quiz[]) => {
        this.games = quizzes.filter((q: Quiz) => q.type === 'KIDS_GAME');
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading kids games:', error);
        this.loading = false;
      }
    });
  }

  getGameCount(category: string): number {
    return this.games.filter(g => g.category === category).length;
  }

  getCategoryColor(category?: string): string {
    const cat = this.categories.find(c => c.id === category);
    return cat?.color || '#6c757d';
  }

  getCategoryIcon(category?: string): string {
    const cat = this.categories.find(c => c.id === category);
    return cat?.icon || '❓';
  }

  createNewGame(): void {
    this.router.navigate(['/dashboard/kids-games/new']);
  }

  generateWithAI(): void {
    this.router.navigate(['/dashboard/kids-games/ai-generate']);
  }

  viewCategory(category: string): void {
    // Filter view by category
    console.log('View category:', category);
  }

  editGame(id: number): void {
    this.router.navigate(['/dashboard/kids-games', id, 'edit']);
  }

  manageQuestions(id: number): void {
    this.router.navigate(['/dashboard/kids-games', id, 'questions']);
  }

  deleteGame(id: number): void {
    if (confirm('Are you sure you want to delete this kids game?')) {
      this.quizService.delete(id).subscribe({
        next: () => {
          this.loadGames();
        },
        error: (error: any) => {
          console.error('Error deleting game:', error);
          alert('Failed to delete game');
        }
      });
    }
  }
}
