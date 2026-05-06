import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { KidsGameService } from '../../kids/services/kids-game.service';
import { GameCategory } from '../../kids/models/kids-game.models';

@Component({
  selector: 'app-category-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>🏷️ Category Management</h2>
        <button class="btn btn-secondary" (click)="goBack()">
          <i class="bi bi-arrow-left"></i> Back to Games
        </button>
      </div>

      <div class="row">
        <!-- Add/Edit Form -->
        <div class="col-md-5">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">{{editingCategory ? 'Edit' : 'Add'}} Category</h5>
            </div>
            <div class="card-body">
              <form (ngSubmit)="saveCategory()" #categoryForm="ngForm">
                <div class="mb-3">
                  <label class="form-label">Category Name *</label>
                  <input type="text" class="form-control" 
                         [(ngModel)]="currentCategory.name" 
                         name="name" required
                         placeholder="e.g., Fruits">
                </div>

                <div class="mb-3">
                  <label class="form-label">Icon (Emoji) *</label>
                  <div class="emoji-picker mb-2">
                    <button type="button" class="emoji-btn" 
                            *ngFor="let emoji of commonEmojis"
                            (click)="selectEmoji(emoji)">
                      {{emoji}}
                    </button>
                  </div>
                  <input type="text" class="form-control text-center" 
                         [(ngModel)]="currentCategory.icon" 
                         name="icon" required
                         style="font-size: 2rem;"
                         placeholder="🎨">
                </div>

                <div class="mb-3">
                  <label class="form-label">Color *</label>
                  <div class="color-picker mb-2">
                    <button type="button" class="color-btn" 
                            *ngFor="let color of commonColors"
                            [style.background-color]="color"
                            (click)="selectColor(color)">
                    </button>
                  </div>
                  <input type="color" class="form-control" 
                         [(ngModel)]="currentCategory.color" 
                         name="color" required>
                </div>

                <div class="mb-3">
                  <label class="form-label">Description</label>
                  <textarea class="form-control" 
                            [(ngModel)]="currentCategory.description" 
                            name="description" rows="3"
                            placeholder="Brief description..."></textarea>
                </div>

                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-primary" 
                          [disabled]="!categoryForm.form.valid || saving">
                    <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>
                    {{editingCategory ? 'Update' : 'Add'}} Category
                  </button>
                  <button type="button" class="btn btn-secondary" 
                          *ngIf="editingCategory"
                          (click)="cancelEdit()">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Categories List -->
        <div class="col-md-7">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Categories ({{categories.length}})</h5>
            </div>
            <div class="card-body">
              <div *ngIf="loading" class="text-center py-4">
                <div class="spinner-border"></div>
              </div>

              <div *ngIf="!loading && categories.length === 0" class="text-center py-4">
                <p class="text-muted">No categories yet. Add your first category!</p>
              </div>

              <div class="row" *ngIf="!loading && categories.length > 0">
                <div class="col-md-6 mb-3" *ngFor="let category of categories">
                  <div class="card category-item" 
                       [style.border-left]="'5px solid ' + category.color">
                    <div class="card-body">
                      <div class="d-flex justify-content-between align-items-start">
                        <div>
                          <div style="font-size: 2.5rem;">{{category.icon}}</div>
                          <h6 class="mt-2 mb-1">{{category.name}}</h6>
                          <small class="text-muted">{{category.description}}</small>
                        </div>
                        <div class="btn-group-vertical">
                          <button class="btn btn-sm btn-outline-primary" 
                                  (click)="editCategory(category)">
                            <i class="bi bi-pencil"></i>
                          </button>
                          <button class="btn btn-sm btn-outline-danger" 
                                  (click)="deleteCategory(category.id!)">
                            <i class="bi bi-trash"></i>
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
      </div>
    </div>
  `,
  styles: [`
    .emoji-picker, .color-picker {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .emoji-btn {
      background: #f8f9fa;
      border: 2px solid #dee2e6;
      padding: 0.5rem;
      border-radius: 8px;
      font-size: 1.5rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .emoji-btn:hover {
      background: #e9ecef;
      transform: scale(1.1);
    }
    .color-btn {
      width: 40px;
      height: 40px;
      border: 2px solid #dee2e6;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .color-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
    .category-item {
      transition: all 0.2s;
    }
    .category-item:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
  `]
})
export class CategoryManagerComponent implements OnInit {
  categories: GameCategory[] = [];
  currentCategory: GameCategory = {
    name: '',
    icon: '',
    color: '#FF6B9D',
    description: ''
  };
  editingCategory: GameCategory | null = null;
  loading = false;
  saving = false;

  commonEmojis = ['🐾', '🎨', '🔢', '🍎', '⚽', '🚗', '🏠', '🌟', '🎵', '📚', '🌈', '🦋', '🌸', '🎈', '🎁', '🍕', '🌍', '⭐'];
  commonColors = ['#FF6B9D', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3', '#A8D8EA'];

  constructor(
    private kidsGameService: KidsGameService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.kidsGameService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loading = false;
      }
    });
  }

  selectEmoji(emoji: string): void {
    this.currentCategory.icon = emoji;
  }

  selectColor(color: string): void {
    this.currentCategory.color = color;
  }

  saveCategory(): void {
    this.saving = true;

    if (this.editingCategory) {
      this.kidsGameService.updateCategory(this.editingCategory.id!, this.currentCategory).subscribe({
        next: () => {
          this.loadCategories();
          this.resetForm();
          this.saving = false;
        },
        error: (error) => {
          console.error('Error updating category:', error);
          alert('Failed to update category');
          this.saving = false;
        }
      });
    } else {
      this.kidsGameService.createCategory(this.currentCategory).subscribe({
        next: () => {
          this.loadCategories();
          this.resetForm();
          this.saving = false;
        },
        error: (error) => {
          console.error('Error creating category:', error);
          alert('Failed to create category');
          this.saving = false;
        }
      });
    }
  }

  editCategory(category: GameCategory): void {
    this.editingCategory = category;
    this.currentCategory = { ...category };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteCategory(id: number): void {
    if (confirm('Delete this category? All games in this category will be affected.')) {
      this.kidsGameService.deleteCategory(id).subscribe({
        next: () => this.loadCategories(),
        error: (error) => {
          console.error('Error deleting category:', error);
          alert('Failed to delete category');
        }
      });
    }
  }

  cancelEdit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.currentCategory = {
      name: '',
      icon: '',
      color: '#FF6B9D',
      description: ''
    };
    this.editingCategory = null;
  }

  goBack(): void {
    this.router.navigate(['/dashboard/kids-games']);
  }
}
