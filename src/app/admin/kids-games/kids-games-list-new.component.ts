import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { KidsGameService } from '../../kids/services/kids-game.service';
import { KidsGame, GameCategory } from '../../kids/models/kids-game.models';

@Component({
  selector: 'app-kids-games-list-new',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>🎮 Kids Games Management</h2>
        <div class="btn-group">
          <button class="btn btn-success" (click)="manageCategories()">
            <i class="bi bi-tags"></i> Manage Categories
          </button>
          <button class="btn btn-primary" (click)="createNewGame()">
            <i class="bi bi-plus-circle"></i> New Game
          </button>
          <button class="btn btn-info" (click)="generateWithAI()">
            <i class="bi bi-sparkles"></i> Generate with AI
          </button>
        </div>
      </div>

      <!-- Categories Overview -->
      <div class="row mb-4">
        <div class="col-md-3" *ngFor="let category of categories">
          <div class="card category-card" [style.border-left]="'5px solid ' + category.color">
            <div class="card-body text-center">
              <div class="category-icon" style="font-size: 3rem;">{{category.icon}}</div>
              <h5 class="card-title mt-2">{{category.name}}</h5>
              <p class="text-muted mb-2">{{getGameCount(category.id!)}} games</p>
              <button class="btn btn-sm btn-outline-primary" (click)="filterByCategory(category.id!)">
                View Games
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Games List -->
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5 class="mb-0">
            {{selectedCategoryId ? 'Filtered Games' : 'All Games'}}
          </h5>
          <button *ngIf="selectedCategoryId" class="btn btn-sm btn-secondary" (click)="clearFilter()">
            <i class="bi bi-x"></i> Clear Filter
          </button>
        </div>
        <div class="card-body">
          <div *ngIf="loading" class="text-center py-4">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <div *ngIf="!loading && filteredGames.length === 0" class="text-center py-4">
            <div style="font-size: 4rem;">📝</div>
            <p class="text-muted">No games found. Create your first game!</p>
          </div>

          <div *ngIf="!loading && filteredGames.length > 0" class="table-responsive">
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
                <tr *ngFor="let game of filteredGames">
                  <td><strong>{{game.title}}</strong></td>
                  <td>
                    <span class="badge" [style.background-color]="game.categoryColor">
                      {{game.categoryIcon}} {{game.categoryName}}
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
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-info me-2" 
                            (click)="manageQuestions(game.id!)">
                      <i class="bi bi-list-ul"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" 
                            (click)="deleteGame(game.id!)">
                      <i class="bi bi-trash"></i>
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
    .category-card {
      transition: all 0.3s;
      cursor: pointer;
    }
    .category-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .category-icon {
      animation: bounce 2s ease-in-out infinite;
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  `]
})
export class KidsGamesListNewComponent implements OnInit {
  games: KidsGame[] = [];
  categories: GameCategory[] = [];
  filteredGames: KidsGame[] = [];
  selectedCategoryId: number | null = null;
  loading = false;

  constructor(
    private kidsGameService: KidsGameService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadGames();
  }

  loadCategories(): void {
    this.kidsGameService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => console.error('Error loading categories:', error)
    });
  }

  loadGames(): void {
    this.loading = true;
    this.kidsGameService.getAllGames().subscribe({
      next: (games) => {
        this.games = games;
        this.applyFilter();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading games:', error);
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    if (this.selectedCategoryId) {
      this.filteredGames = this.games.filter(g => g.categoryId === this.selectedCategoryId);
    } else {
      this.filteredGames = [...this.games];
    }
  }

  filterByCategory(categoryId: number): void {
    this.selectedCategoryId = categoryId;
    this.applyFilter();
  }

  clearFilter(): void {
    this.selectedCategoryId = null;
    this.applyFilter();
  }

  getGameCount(categoryId: number): number {
    return this.games.filter(g => g.categoryId === categoryId).length;
  }

  createNewGame(): void {
    this.router.navigate(['/dashboard/kids-games/new']);
  }

  generateWithAI(): void {
    this.router.navigate(['/dashboard/kids-games/ai-generate']);
  }

  manageCategories(): void {
    this.router.navigate(['/dashboard/kids-games/categories']);
  }

  editGame(id: number): void {
    this.router.navigate(['/dashboard/kids-games', id, 'edit']);
  }

  manageQuestions(id: number): void {
    this.router.navigate(['/dashboard/kids-games', id, 'questions']);
  }

  deleteGame(id: number): void {
    if (confirm('Are you sure you want to delete this game?')) {
      this.kidsGameService.deleteGame(id).subscribe({
        next: () => this.loadGames(),
        error: (error) => {
          console.error('Error deleting game:', error);
          alert('Failed to delete game');
        }
      });
    }
  }
}
