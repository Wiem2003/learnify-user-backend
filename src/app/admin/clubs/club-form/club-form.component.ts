import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClubService } from '../../../services/club.service';
import { AdminManagementService, UserProfile } from '../../../services/admin-management.service';

@Component({
  selector: 'app-club-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="crud-page">
      <div class="page-header">
        <div class="header-nav">
          <a routerLink="/admin/clubs" class="back-link"><i class="ti ti-arrow-left"></i> Back to Clubs</a>
          <h1 class="page-title">{{ isEditMode ? 'Edit Club' : 'Create New Club' }}</h1>
        </div>
      </div>

      <form [formGroup]="clubForm" (ngSubmit)="onSubmit()" class="form-container">
        <div class="form-grid">

          <!-- Left card -->
          <div class="form-card">
            <h3>Club Information</h3>

            <div class="form-group">
              <label>Club Name *</label>
              <input type="text" formControlName="name" class="form-control" [class.error]="isInvalid('name')">
              <span class="error-message" *ngIf="isInvalid('name')">Name is required</span>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Category *</label>
                <select formControlName="category" class="form-control" [class.error]="isInvalid('category')">
                  <option value="">Select Category</option>
                  <option value="Speaking Club">Speaking Club</option>
                  <option value="Debate Club">Debate Club</option>
                  <option value="Writing Club">Writing Club</option>
                  <option value="Culture Club">Culture Club</option>
                </select>
                <span class="error-message" *ngIf="isInvalid('category')">Category is required</span>
              </div>
              <div class="form-group">
                <label>Required Level *</label>
                <select formControlName="requiredLevel" class="form-control" [class.error]="isInvalid('requiredLevel')">
                  <option value="">Select Level</option>
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                  <option value="C1">C1</option>
                  <option value="C2">C2</option>
                </select>
                <span class="error-message" *ngIf="isInvalid('requiredLevel')">Level is required</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Max Members (Capacity) *</label>
                <input type="number" formControlName="capacity" class="form-control" min="1" [class.error]="isInvalid('capacity')">
                <span class="error-message" *ngIf="isInvalid('capacity')">Required, min 1</span>
              </div>
              <div class="form-group">
                <label>Schedule *</label>
                <input type="text" formControlName="schedule" class="form-control"
                  placeholder="e.g. Every Monday 18:00" [class.error]="isInvalid('schedule')">
                <span class="error-message" *ngIf="isInvalid('schedule')">Schedule is required</span>
              </div>
            </div>

            <div class="form-group">
              <label>Responsible Tutor</label>
              <select formControlName="tutorId" class="form-control" (change)="onTutorChange($event)">
                <option value="">Select Tutor (optional)</option>
                <option *ngFor="let t of tutors" [value]="t.id">{{ t.firstName }} {{ t.lastName }}</option>
              </select>
            </div>
          </div>

          <!-- Right card -->
          <div class="form-card">
            <h3>Details & Media</h3>

            <div class="form-group">
              <label>Description *</label>
              <textarea formControlName="description" class="form-control" rows="5"
                [class.error]="isInvalid('description')"></textarea>
              <span class="error-message" *ngIf="isInvalid('description')">Description is required</span>
            </div>

            <div class="form-group">
              <label>Photo URL</label>
              <input type="text" formControlName="image" class="form-control"
                placeholder="https://... or assets/images/...">
            </div>

            <!-- Image preview -->
            <div class="image-preview" *ngIf="clubForm.get('image')?.value">
              <img [src]="clubForm.get('image')?.value" alt="Club preview"
                onerror="this.style.display='none'">
            </div>
          </div>
        </div>

        <div class="form-actions">
          <div class="error-banner" *ngIf="errorMsg">{{ errorMsg }}</div>
          <a routerLink="/admin/clubs" class="btn-cancel">Cancel</a>
          <button type="submit" class="btn-submit" [disabled]="saving">
            <i class="ti ti-check"></i> {{ saving ? 'Saving...' : (isEditMode ? 'Update Club' : 'Create Club') }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .crud-page { animation: fadeIn 0.3s ease; }
    .page-header { margin-bottom: 24px; }
    .header-nav { display: flex; flex-direction: column; gap: 12px; }
    .back-link { display: inline-flex; align-items: center; gap: 6px; color: var(--color-gray-500); text-decoration: none; &:hover { color: var(--color-primary); } }
    .page-title { font-size: 28px; font-weight: 700; color: var(--color-primary); margin: 0; }
    .form-container { display: flex; flex-direction: column; gap: 24px; }
    .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
    .form-card { background: var(--color-white); border-radius: 20px; padding: 24px; box-shadow: var(--shadow-card); h3 { font-size: 18px; font-weight: 700; color: var(--color-primary); margin: 0 0 20px; padding-bottom: 12px; border-bottom: 1px solid rgba(61,61,96,0.08); } }
    .form-group { margin-bottom: 20px; label { display: block; font-size: 14px; font-weight: 600; color: var(--color-primary); margin-bottom: 8px; } }
    .form-control { width: 100%; padding: 12px 16px; border: 2px solid rgba(61,61,96,0.1); border-radius: 12px; font-size: 14px; box-sizing: border-box; &:focus { outline: none; border-color: var(--color-primary); } &.error { border-color: var(--color-cta); } }
    .error-message { display: block; font-size: 12px; color: var(--color-cta); margin-top: 4px; }
    .form-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .image-preview { margin-top: 12px; border-radius: 12px; overflow: hidden; img { width: 100%; max-height: 200px; object-fit: cover; } }
    .form-actions { display: flex; justify-content: flex-end; gap: 12px; padding-top: 12px; }
    .btn-cancel { padding: 12px 24px; border-radius: 12px; font-size: 14px; font-weight: 600; text-decoration: none; border: 2px solid rgba(61,61,96,0.1); color: var(--color-gray-600); }
    .btn-submit { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; border-radius: 12px; font-size: 14px; font-weight: 600; border: none; background: linear-gradient(135deg, var(--color-primary), var(--color-secondary)); color: #fff; cursor: pointer; &:disabled { opacity: 0.6; cursor: not-allowed; } }
    .error-banner { flex: 1; padding: 10px 16px; background: rgba(200,70,48,0.1); color: #c84630; border-radius: 10px; font-size: 13px; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @media (max-width: 768px) { .form-grid, .form-row { grid-template-columns: 1fr; } }
  `]
})
export class ClubFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private clubService = inject(ClubService);
  private adminService = inject(AdminManagementService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  clubForm: FormGroup;
  isEditMode = false;
  clubId: number | null = null;
  tutors: UserProfile[] = [];
  saving = false;
  errorMsg = '';

  constructor() {
    this.clubForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      requiredLevel: ['', Validators.required],
      capacity: [20, [Validators.required, Validators.min(1)]],
      schedule: ['', Validators.required],
      description: ['', Validators.required],
      image: [''],
      tutorId: ['']
    });
  }

  ngOnInit(): void {
    // Load tutors for dropdown
    this.adminService.getTutors().subscribe({
      next: (t) => this.tutors = t,
      error: () => {}
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.clubId = +id;
      this.clubService.getById(this.clubId).subscribe({
        next: (club) => this.clubForm.patchValue({
          name: club.name,
          category: club.category,
          requiredLevel: club.requiredLevel,
          capacity: club.capacity || club.maxMembers,
          schedule: club.schedule,
          description: club.description,
          image: club.image,
          tutorId: club.tutorId || ''
        })
      });
    }
  }

  isInvalid(field: string): boolean {
    const c = this.clubForm.get(field);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  onTutorChange(event: Event): void {
    const id = +(event.target as HTMLSelectElement).value;
    const tutor = this.tutors.find(t => t.id === id);
    if (tutor) {
      this.clubForm.patchValue({ tutorId: tutor.id });
    }
  }

  onSubmit(): void {
    if (this.clubForm.invalid) {
      this.clubForm.markAllAsTouched();
      // Show which fields are invalid in console for debugging
      Object.keys(this.clubForm.controls).forEach(key => {
        const ctrl = this.clubForm.get(key);
        if (ctrl?.invalid) console.warn('Invalid field:', key, ctrl.errors);
      });
      return;
    }
    this.saving = true;

    const v = this.clubForm.value;
    const selectedTutor = this.tutors.find(t => t.id === +v.tutorId);

    const payload: any = {
      name: v.name,
      description: v.description,
      category: v.category,
      schedule: v.schedule,
      requiredLevel: v.requiredLevel,
      capacity: +v.capacity,
      maxMembers: +v.capacity,
      image: v.image || 'assets/images/course-img-1.jpg',
      tutorId: v.tutorId ? +v.tutorId : null,
      tutorName: selectedTutor ? `${selectedTutor.firstName} ${selectedTutor.lastName}` : null
    };

    const req = this.isEditMode && this.clubId
      ? this.clubService.update(this.clubId, payload)
      : this.clubService.create(payload);

    req.subscribe({
      next: () => this.router.navigate(['/admin/clubs']),
      error: (err) => {
        this.saving = false;
        this.errorMsg = err?.error?.message || err?.message || 'Failed to save club. Is club-service running?';
      }
    });
  }
}
