import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Rating, RatingService } from '../../services/rating.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin-ratings-list',
  templateUrl: './admin-ratings-list.component.html',
  styleUrl: './admin-ratings-list.component.scss',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
})
export class AdminRatingsListComponent implements OnInit {
  ratings: Rating[] = [];
  loading = true;
  error = '';
  searchTerm = '';
  pageSize = 10;
  currentPage = 1;

  constructor(
    private ratingService: RatingService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadRatings();
  }

  loadRatings(): void {
    this.loading = true;
    this.error = '';
    this.ratingService.getAll().subscribe({
      next: (list) => {
        this.ratings = list ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Erreur lors du chargement des avis';
        this.loading = false;
      },
    });
  }

  get filteredRatings(): Rating[] {
    let list = this.ratings;
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      list = list.filter(
        (r) =>
          this.teacherName(r).toLowerCase().includes(term) ||
          this.studentName(r).toLowerCase().includes(term) ||
          (r.commentaire ?? '').toLowerCase().includes(term)
      );
    }
    return list;
  }

  get paginatedRatings(): Rating[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredRatings.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredRatings.length / this.pageSize));
  }

  setPage(p: number): void {
    this.currentPage = Math.max(1, Math.min(p, this.totalPages));
  }

  teacherName(r: Rating): string {
    return r.teacherName ?? r.teacher?.name ?? `#${r.teacherId ?? r.teacher?.id ?? '?'}`;
  }

  studentName(r: Rating): string {
    return r.studentName ?? r.student?.name ?? `#${r.studentId ?? r.student?.id ?? '?'}`;
  }

  formatDate(d: string | undefined): string {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  deleteRating(r: Rating): void {
    if (!confirm('Supprimer cet avis ?')) return;
    this.ratingService.delete(r.id).subscribe({
      next: () => {
        this.loadRatings();
        this.toast.success('Avis supprimé');
      },
      error: (err) => {
        this.toast.error(err?.error?.message ?? 'Suppression impossible');
      },
    });
  }
}
