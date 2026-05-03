import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { QuizService } from '../../quiz-feedback/services/quiz-feedback.services';
import { Quiz } from '../../quiz-feedback/models/quiz-feedback.models';

@Component({
  selector: 'app-kids-game-form',
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
              <label for="title" class="form-label">Game Title *</label>
              <input 
                type="text" 
                class="form-control" 
                id="title" 
                name="title"
                [(ngModel)]="game.title" 
                required
                placeholder="e.g., Animals - Match the Word">
            </div>

            <div class="mb-3">
              <label for="category" class="form-label">Category *</label>
              <select 
                class="form-select" 
                id="category" 
                name="category"
                [(ngModel)]="game.category" 
                required>
                <option value="">Select a category</option>
                <option value="animals">🐾 Animals</option>
                <option value="colors">🎨 Colors</option>
                <option value="numbers">🔢 Numbers</option>
              </select>
            </div>

            <div class="mb-3">
              <label for="description" class="form-label">Description</label>
              <textarea 
                class="form-control" 
                id="description" 
                name="description"
                [(ngModel)]="game.description" 
                rows="3"
                placeholder="Brief description of the game"></textarea>
            </div>

            <div class="mb-3">
              <label for="status" class="form-label">Status *</label>
              <select 
                class="form-select" 
                id="status" 
                name="status"
                [(ngModel)]="game.status" 
                required>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div class="alert alert-info">
              <i class="bi bi-info-circle"></i>
              After creating the game, you can add questions with emojis/images.
            </div>

            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-primary" [disabled]="!gameForm.form.valid || saving">
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
export class KidsGameFormComponent implements OnInit {
  game: Partial<Quiz> = {
    title: '',
    description: '',
    category: '',
    status: 'DRAFT',
    type: 'KIDS_GAME',
    courseId: 1
  };

  isEditMode = false;
  gameId?: number;
  saving = false;

  constructor(
    private quizService: QuizService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.gameId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.gameId) {
      this.isEditMode = true;
      this.loadGame();
    }
  }

  loadGame(): void {
    if (!this.gameId) return;
    
    this.quizService.getById(this.gameId).subscribe({
      next: (quiz: Quiz) => {
        this.game = quiz;
      },
      error: (error: any) => {
        console.error('Error loading game:', error);
        alert('Failed to load game');
        this.router.navigate(['/dashboard/kids-games']);
      }
    });
  }

  onSubmit(): void {
    this.saving = true;

    if (this.isEditMode && this.gameId) {
      this.quizService.update(this.gameId, this.game).subscribe({
        next: () => {
          this.saving = false;
          this.router.navigate(['/dashboard/kids-games']);
        },
        error: (error: any) => {
          console.error('Error updating game:', error);
          alert('Failed to update game');
          this.saving = false;
        }
      });
    } else {
      this.quizService.create(this.game as Quiz).subscribe({
        next: (created: Quiz) => {
          this.saving = false;
          this.router.navigate(['/dashboard/kids-games', created.id, 'questions']);
        },
        error: (error: any) => {
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
