import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Feedback } from '../../../models/quiz-feedback.models';
import { FeedbackService } from '../../../services/quiz-feedback.services';

interface FeedbackStats {
  total: number;
  averageRating: number;
  byRating: { [key: number]: number };
  byType: { [key: string]: number };
  positivePercentage: number;
}

@Component({
  selector: 'app-feedback-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './feedback-manager.component.html',
  styleUrls: ['./feedback-manager.component.scss']
})
export class FeedbackManagerComponent implements OnInit, OnDestroy {
  feedbacks: Feedback[] = [];
  filteredFeedbacks: Feedback[] = [];
  loading = false;
  
  // Expose Math to template
  Math = Math;
  
  // Filtres
  searchTerm = '';
  selectedRating: number | null = null;
  selectedType: string = 'ALL';
  sortBy: 'date' | 'rating' = 'date';
  sortOrder: 'asc' | 'desc' = 'desc';
  
  // Statistiques
  stats: FeedbackStats = {
    total: 0,
    averageRating: 0,
    byRating: {},
    byType: {},
    positivePercentage: 0
  };
  
  // Modal de suppression
  showDeleteModal = false;
  feedbackToDelete: Feedback | null = null;
  deleting = false;
  
  // Modal de détails
  showDetailsModal = false;
  selectedFeedback: Feedback | null = null;
  
  private destroy$ = new Subject<void>();

  constructor(
    private feedbackService: FeedbackService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadFeedbacks(): void {
    this.loading = true;
    this.feedbackService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.feedbacks = data;
          this.calculateStats();
          this.applyFilters();
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des feedbacks:', error);
          this.loading = false;
        }
      });
  }

  calculateStats(): void {
    this.stats.total = this.feedbacks.length;
    
    if (this.feedbacks.length === 0) {
      this.stats.averageRating = 0;
      this.stats.positivePercentage = 0;
      return;
    }
    
    // Moyenne des notes
    const totalRating = this.feedbacks.reduce((sum, f) => sum + f.rating, 0);
    this.stats.averageRating = totalRating / this.feedbacks.length;
    
    // Répartition par note
    this.stats.byRating = {};
    for (let i = 1; i <= 5; i++) {
      this.stats.byRating[i] = this.feedbacks.filter(f => f.rating === i).length;
    }
    
    // Répartition par type
    this.stats.byType = {};
    this.feedbacks.forEach(f => {
      const type = f.type || 'GENERAL';
      this.stats.byType[type] = (this.stats.byType[type] || 0) + 1;
    });
    
    // Pourcentage de feedbacks positifs (4-5 étoiles)
    const positiveFeedbacks = this.feedbacks.filter(f => f.rating >= 4).length;
    this.stats.positivePercentage = Math.round((positiveFeedbacks / this.feedbacks.length) * 100);
  }

  applyFilters(): void {
    let result = [...this.feedbacks];

    // Filtre par recherche
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(f =>
        (f.studentName && f.studentName.toLowerCase().includes(term)) ||
        (f.comment && f.comment.toLowerCase().includes(term))
      );
    }

    // Filtre par note
    if (this.selectedRating !== null) {
      result = result.filter(f => f.rating === this.selectedRating);
    }

    // Filtre par type
    if (this.selectedType !== 'ALL') {
      result = result.filter(f => f.type === this.selectedType);
    }

    // Tri
    result.sort((a, b) => {
      let comparison = 0;
      
      if (this.sortBy === 'date') {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        comparison = dateA - dateB;
      } else if (this.sortBy === 'rating') {
        comparison = a.rating - b.rating;
      }
      
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });

    this.filteredFeedbacks = result;
  }

  setRatingFilter(rating: number | null): void {
    this.selectedRating = rating;
    this.applyFilters();
  }

  setTypeFilter(type: string): void {
    this.selectedType = type;
    this.applyFilters();
  }

  setSortBy(field: 'date' | 'rating'): void {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'desc';
    }
    this.applyFilters();
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  createFeedback(): void {
    this.router.navigate(['/dashboard/feedbacks/new']);
  }

  viewDetails(feedback: Feedback): void {
    this.selectedFeedback = feedback;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.selectedFeedback = null;
    this.showDetailsModal = false;
  }

  editFeedback(id: number, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.router.navigate(['/dashboard/feedbacks', id, 'edit']);
  }

  confirmDelete(feedback: Feedback, event: Event): void {
    event.stopPropagation();
    this.feedbackToDelete = feedback;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.feedbackToDelete = null;
    this.showDeleteModal = false;
    this.deleting = false;
  }

  deleteFeedback(): void {
    if (!this.feedbackToDelete?.id) return;
    
    this.deleting = true;
    this.feedbackService.delete(this.feedbackToDelete.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadFeedbacks();
          this.cancelDelete();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          alert('Erreur lors de la suppression du feedback.');
          this.deleting = false;
        }
      });
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < rating ? 1 : 0);
  }

  getTypeBadgeClass(type: string): string {
    switch (type) {
      case 'QUIZ_FEEDBACK': return 'type-badge type-quiz';
      case 'COURSE_FEEDBACK': return 'type-badge type-course';
      case 'GENERAL': return 'type-badge type-general';
      default: return 'type-badge';
    }
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'QUIZ_FEEDBACK': return 'Quiz';
      case 'COURSE_FEEDBACK': return 'Cours';
      case 'GENERAL': return 'Général';
      default: return type;
    }
  }

  getRatingColor(rating: number): string {
    if (rating >= 4) return '#10b981'; // Vert
    if (rating === 3) return '#f59e0b'; // Orange
    return '#ef4444'; // Rouge
  }

  getRatingPercentage(rating: number): number {
    if (this.stats.total === 0) return 0;
    return Math.round((this.stats.byRating[rating] || 0) / this.stats.total * 100);
  }

  getTypePercentage(type: string): number {
    if (this.stats.total === 0) return 0;
    return Math.round((this.stats.byType[type] || 0) / this.stats.total * 100);
  }
}
