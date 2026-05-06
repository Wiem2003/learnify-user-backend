import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { KidsGameService } from '../../kids/services/kids-game.service';
import { KidsGame, GameCategory } from '../../kids/models/kids-game.models';

@Component({
  selector: 'app-kids-game-form-new',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container-fluid py-4">
      <div class="card">
        <div class="card-header">
          <h4 class="mb-0">{{isEditMode ? 'Edit' : 'Create'}} Kids Game</h4>
        </div>
        <div class="card-body">
          <form (ngSubmit)="onSubmit()" #gameForm="ngForm">
            <div class="mb-3">
              <label class="form-label">Game Title *</label>
              <input type="text" class="form-control" 
                     [(ngModel)]="game.title" name="title" required
                     placeholder="e.g., Learn Animals">
            </div>

            <div class="mb-3">
              <label class="form-label">Category *</label>
              <select class="form-select" 
                      [(ngModel)]="game.categoryId" name="categoryId" required>
                <option [ngValue]="null">Select a category</option>
                <option *ngFor="let cat of categories" [ngValue]="cat.id">
                  {{cat.icon}} {{cat.name}}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Description</label>
              <textarea class="form-control" 
                        [(ngModel)]="game.description" name="description" rows="3"
                        placeholder="Brief description..."></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label">Status *</label>
              <select class="form-select" 
                      [(ngModel)]="game.status" name="status" required>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div class="alert alert-info">
              <i class="bi bi-info-circle"></i>
              After creating the game, you'll be able to add questions with emojis.
            </div>

            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-primary" 
                      [disabled]="!gameForm.form.valid || saving">
                <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>
                {{isEditMode ? 'Update' : 'Create'}} Game
              </button>
              <button type="button" class="btn btn-secondary" (click)="cancel()">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class KidsGameFormNewComponent implements OnInit {
  game: Partial<KidsGame> = {
    title: '',
    description: '',
    categoryId: 0,
    status: 'DRAFT'
  };
  categories: GameCategory[] = [];
  isEditMode = false;
  gameId?: number;
  saving = false;

  constructor(
    private kidsGameService: KidsGameService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.gameId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.gameId) {
      this.isEditMode = true;
      this.loadGame();
    }
  }

  loadCategories(): void {
    this.kidsGameService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => console.error('Error loading categories:', error)
    });
  }

  loadGame(): void {
    if (!this.gameId) return;
    
    this.kidsGameService.getGameById(this.gameId).subscribe({
      next: (game) => {
        this.game = game;
      },
      error: (error) => {
        console.error('Error loading game:', error);
        alert('Failed to load game');
        this.router.navigate(['/dashboard/kids-games']);
      }
    });
  }

  onSubmit(): void {
    this.saving = true;

    if (this.isEditMode && this.gameId) {
      this.kidsGameService.updateGame(this.gameId, this.game as KidsGame).subscribe({
        next: () => {
          this.saving = false;
          this.router.navigate(['/dashboard/kids-games']);
        },
        error: (error) => {
          console.error('Error updating game:', error);
          alert('Failed to update game');
          this.saving = false;
        }
      });
    } else {
      this.kidsGameService.createGame(this.game as KidsGame).subscribe({
        next: (created) => {
          this.saving = false;
          this.router.navigate(['/dashboard/kids-games', created.id, 'questions']);
        },
        error: (error) => {
          console.error('Error creating game:', error);
          alert('Failed to create game');
          this.saving = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/dashboard/kids-games']);
  }
}
