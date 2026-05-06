import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Quiz } from '../../quiz-feedback/models/quiz-feedback.models';
import { QuizService } from '../../quiz-feedback/services/quiz-feedback.services';

@Component({
  selector: 'app-admin-quiz-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-quiz-list.component.html',
  styleUrls: ['./admin-quiz-list.component.scss']
})
export class AdminQuizListComponent implements OnInit, OnDestroy {
  quizzes: Quiz[] = [];
  filteredQuizzes: Quiz[] = [];
  loading = false;
  searchTerm = '';
  
  // Filtres
  selectedStatus: string = 'ALL';
  selectedView: 'grid' | 'list' = 'grid';
  sortBy: 'title' | 'createdAt' | 'questionCount' | 'averageScore' = 'createdAt';
  sortOrder: 'asc' | 'desc' = 'desc';
  
  // Modal de suppression
  showDeleteModal = false;
  quizToDelete: Quiz | null = null;
  deleting = false;
  
  // Statistiques
  stats = {
    total: 0,
    published: 0,
    draft: 0,
    archived: 0,
    totalQuestions: 0
  };
  
  private destroy$ = new Subject<void>();

  constructor(
    private quizService: QuizService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadQuizzes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadQuizzes(): void {
    this.loading = true;
    this.quizService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.quizzes = data;
          this.calculateStats();
          this.applyFilters();
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des quiz:', error);
          this.loading = false;
        }
      });
  }

  calculateStats(): void {
    this.stats.total = this.quizzes.length;
    this.stats.published = this.quizzes.filter(q => q.status === 'PUBLISHED').length;
    this.stats.draft = this.quizzes.filter(q => q.status === 'DRAFT').length;
    this.stats.archived = this.quizzes.filter(q => q.status === 'ARCHIVED').length;
    this.stats.totalQuestions = this.quizzes.reduce((sum, q) => sum + (q.questionCount || 0), 0);
  }

  applyFilters(): void {
    let result = [...this.quizzes];

    // Filtre par recherche
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(quiz =>
        quiz.title.toLowerCase().includes(term) ||
        (quiz.description && quiz.description.toLowerCase().includes(term))
      );
    }

    // Filtre par statut
    if (this.selectedStatus !== 'ALL') {
      result = result.filter(quiz => quiz.status === this.selectedStatus);
    }

    // Tri
    result.sort((a, b) => {
      let aVal: any = a[this.sortBy];
      let bVal: any = b[this.sortBy];

      if (aVal === undefined || aVal === null) aVal = 0;
      if (bVal === undefined || bVal === null) bVal = 0;

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });

    this.filteredQuizzes = result;
  }

  setStatusFilter(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  toggleView(view: 'grid' | 'list'): void {
    this.selectedView = view;
  }

  setSortBy(field: 'title' | 'createdAt' | 'questionCount' | 'averageScore'): void {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'desc';
    }
    this.applyFilters();
  }

  createQuiz(): void {
    this.router.navigate(['/dashboard/quizzes/new']);
  }

  manageQuestions(id: number, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/dashboard/quizzes', id, 'questions']);
  }

  viewQuiz(id: number): void {
    this.router.navigate(['/dashboard/quizzes', id]);
  }

  editQuiz(id: number, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.router.navigate(['/dashboard/quizzes', id, 'edit']);
  }

  duplicateQuiz(quiz: Quiz, event: Event): void {
    event.stopPropagation();
    // TODO: Implémenter la duplication
    console.log('Dupliquer le quiz:', quiz.id);
  }

  toggleStatus(quiz: Quiz, event: Event): void {
    event.stopPropagation();
    
    if (quiz.status === 'PUBLISHED') {
      this.archiveQuiz(quiz);
    } else {
      this.publishQuiz(quiz);
    }
  }

  publishQuiz(quiz: Quiz): void {
    if (!quiz.id) return;
    
    this.quizService.publish(quiz.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadQuizzes();
        },
        error: (error) => console.error('Erreur lors de la publication:', error)
      });
  }

  archiveQuiz(quiz: Quiz): void {
    if (!quiz.id) return;
    
    this.quizService.archive(quiz.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadQuizzes();
        },
        error: (error) => console.error('Erreur lors de l\'archivage:', error)
      });
  }

  confirmDelete(quiz: Quiz, event: Event): void {
    event.stopPropagation();
    this.quizToDelete = quiz;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.quizToDelete = null;
    this.showDeleteModal = false;
    this.deleting = false;
  }

  deleteQuiz(): void {
    if (!this.quizToDelete?.id) return;
    
    this.deleting = true;
    this.quizService.delete(this.quizToDelete.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadQuizzes();
          this.cancelDelete();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          alert('Erreur lors de la suppression du quiz. Vérifiez que le service backend est démarré.');
          this.deleting = false;
        }
      });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PUBLISHED': return 'status-badge status-published';
      case 'DRAFT': return 'status-badge status-draft';
      case 'ARCHIVED': return 'status-badge status-archived';
      default: return 'status-badge';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'PUBLISHED': return 'bi-check-circle-fill';
      case 'DRAFT': return 'bi-pencil-square';
      case 'ARCHIVED': return 'bi-archive-fill';
      default: return 'bi-question-circle';
    }
  }
}
