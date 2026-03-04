import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DataService } from '../../../core/data.service';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="crud-page">
      <div class="page-header">
        <div class="header-nav">
          <a routerLink="/admin/courses" class="back-link">
            <i class="ti ti-arrow-left"></i> Back to Courses
          </a>
          <h1 class="page-title">{{ isEditMode ? 'Edit Course' : 'Create New Course' }}</h1>
        </div>
      </div>

      <form [formGroup]="courseForm" (ngSubmit)="onSubmit()" class="form-container">
        <div class="form-grid">
          <!-- Basic Info -->
          <div class="form-card">
            <h3>Basic Information</h3>
            
            <div class="form-group">
              <label for="title">Course Title *</label>
              <input 
                type="text" 
                id="title" 
                formControlName="title"
                class="form-control"
                [class.error]="isFieldInvalid('title')"
              >
              @if (isFieldInvalid('title')) {
                <span class="error-message">Title is required</span>
              }
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="category">Category *</label>
                <select 
                  id="category" 
                  formControlName="category"
                  class="form-control"
                  [class.error]="isFieldInvalid('category')"
                >
                  <option value="">Select Category</option>
                  <option value="Grammar">Grammar</option>
                  <option value="Speaking">Speaking</option>
                  <option value="Business English">Business English</option>
                  <option value="Exam Preparation">Exam Preparation</option>
                </select>
                @if (isFieldInvalid('category')) {
                  <span class="error-message">Category is required</span>
                }
              </div>

              <div class="form-group">
                <label for="level">Level *</label>
                <select 
                  id="level" 
                  formControlName="level"
                  class="form-control"
                  [class.error]="isFieldInvalid('level')"
                >
                  <option value="">Select Level</option>
                  <option value="A1">A1 - Beginner</option>
                  <option value="A2">A2 - Elementary</option>
                  <option value="B1">B1 - Intermediate</option>
                  <option value="B2">B2 - Upper Intermediate</option>
                  <option value="C1">C1 - Advanced</option>
                  <option value="C2">C2 - Proficient</option>
                </select>
                @if (isFieldInvalid('level')) {
                  <span class="error-message">Level is required</span>
                }
              </div>
            </div>

            <div class="form-group">
              <label for="description">Description *</label>
              <textarea 
                id="description" 
                formControlName="description"
                class="form-control"
                rows="4"
                [class.error]="isFieldInvalid('description')"
              ></textarea>
              @if (isFieldInvalid('description')) {
                <span class="error-message">Description is required</span>
              }
            </div>
          </div>

          <!-- Details -->
          <div class="form-card">
            <h3>Course Details</h3>

            <div class="form-row">
              <div class="form-group">
                <label for="duration">Duration *</label>
                <input 
                  type="text" 
                  id="duration" 
                  formControlName="duration"
                  placeholder="e.g., 8 weeks"
                  class="form-control"
                  [class.error]="isFieldInvalid('duration')"
                >
                @if (isFieldInvalid('duration')) {
                  <span class="error-message">Duration is required</span>
                }
              </div>

              <div class="form-group">
                <label for="price">Price ($) *</label>
                <input 
                  type="number" 
                  id="price" 
                  formControlName="price"
                  class="form-control"
                  [class.error]="isFieldInvalid('price')"
                >
                @if (isFieldInvalid('price')) {
                  <span class="error-message">Price is required</span>
                }
              </div>
            </div>

            <div class="form-group">
              <label for="teacher">Teacher *</label>
              <input 
                type="text" 
                id="teacher" 
                formControlName="teacher"
                class="form-control"
                [class.error]="isFieldInvalid('teacher')"
              >
              @if (isFieldInvalid('teacher')) {
                <span class="error-message">Teacher is required</span>
              }
            </div>

            <div class="form-group">
              <label for="image">Image URL</label>
              <input 
                type="text" 
                id="image" 
                formControlName="image"
                placeholder="assets/images/course-img-1.jpg"
                class="form-control"
              >
            </div>
          </div>
        </div>

        <div class="form-actions">
          <a routerLink="/admin/courses" class="btn-cancel">Cancel</a>
          <button type="submit" class="btn-submit" [disabled]="courseForm.invalid">
            <i class="ti ti-check"></i>
            {{ isEditMode ? 'Update Course' : 'Create Course' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .crud-page { animation: fadeIn 0.3s ease; }

    .page-header { margin-bottom: 24px; }

    .header-nav { display: flex; flex-direction: column; gap: 12px; }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--color-gray-500);
      text-decoration: none;
      font-size: 14px;
      transition: color 0.2s;
      &:hover { color: var(--color-primary); }
    }

    .page-title {
      font-family: var(--font-family);
      font-size: 28px;
      font-weight: 700;
      color: var(--color-primary);
      margin: 0;
    }

    .form-container { display: flex; flex-direction: column; gap: 24px; }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }

    .form-card {
      background: var(--color-white);
      border-radius: 20px;
      padding: 24px;
      box-shadow: var(--shadow-card);

      h3 {
        font-size: 18px;
        font-weight: 700;
        color: var(--color-primary);
        margin: 0 0 20px;
        padding-bottom: 12px;
        border-bottom: 1px solid rgba(61, 61, 96, 0.08);
      }
    }

    .form-group {
      margin-bottom: 20px;

      label {
        display: block;
        font-size: 14px;
        font-weight: 600;
        color: var(--color-primary);
        margin-bottom: 8px;
      }
    }

    .form-control {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid rgba(61, 61, 96, 0.1);
      border-radius: 12px;
      font-size: 14px;
      transition: all 0.2s;
      background: var(--color-white);

      &:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 4px rgba(61, 61, 96, 0.08);
      }

      &.error {
        border-color: var(--color-cta);
      }
    }

    .error-message {
      display: block;
      font-size: 12px;
      color: var(--color-cta);
      margin-top: 4px;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    textarea.form-control { resize: vertical; min-height: 100px; }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 12px;
    }

    .btn-cancel {
      padding: 12px 24px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      border: 2px solid rgba(61, 61, 96, 0.1);
      color: var(--color-gray-600);
      transition: all 0.2s;
      &:hover {
        border-color: var(--color-primary);
        color: var(--color-primary);
      }
    }

    .btn-submit {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      border: none;
      background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
      color: #fff;
      cursor: pointer;
      transition: all 0.25s;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(61, 61, 96, 0.3);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @media (max-width: 768px) {
      .form-grid { grid-template-columns: 1fr; }
      .form-row { grid-template-columns: 1fr; }
    }
  `]
})
export class CourseFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  courseForm: FormGroup;
  isEditMode = false;
  courseId: number | null = null;

  constructor() {
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      level: ['', Validators.required],
      description: ['', Validators.required],
      duration: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      teacher: ['', Validators.required],
      image: ['assets/images/course-img-1.jpg']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.courseId = +id;
      const course = this.dataService.getCourseById(this.courseId);
      if (course) {
        this.courseForm.patchValue(course);
      }
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.courseForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  onSubmit(): void {
    if (this.courseForm.valid) {
      const formData = this.courseForm.value;
      
      if (this.isEditMode && this.courseId) {
        this.dataService.updateCourse(this.courseId, formData);
      } else {
        this.dataService.addCourse(formData);
      }
      
      this.router.navigate(['/admin/courses']);
    }
  }
}
