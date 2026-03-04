import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { Meeting, MeetingService } from '../../services/meeting.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin-meetings-list',
  templateUrl: './admin-meetings-list.component.html',
  styleUrl: './admin-meetings-list.component.scss',
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class AdminMeetingsListComponent implements OnInit {
  meetings: Meeting[] = [];
  loading = true;
  error = '';
  showDeleteModal = false;
  meetingToDelete: Meeting | null = null;
  pageSize = 3;
  currentPage = 1;

  constructor(
    private meetingService: MeetingService,
    private router: Router,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadMeetings();
  }

  loadMeetings(): void {
    this.loading = true;
    this.error = '';
    this.meetingService
      .getAll()
      .pipe(
        catchError((err) => {
          this.error = err?.error?.message || 'Erreur lors du chargement des réunions. Connectez-vous en tant qu\'admin.';
          return of([]);
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe((list) => {
        this.meetings = list ?? [];
        this.currentPage = 1;
      });
  }

  get paginatedMeetings(): Meeting[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.meetings.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.meetings.length / this.pageSize));
  }

  setPage(p: number): void {
    this.currentPage = Math.max(1, Math.min(p, this.totalPages));
  }

  confirmDelete(m: Meeting): void {
    this.meetingToDelete = m;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.meetingToDelete = null;
    this.showDeleteModal = false;
  }

  deleteMeeting(): void {
    if (!this.meetingToDelete) return;
    this.meetingService.delete(this.meetingToDelete.id).subscribe({
      next: () => {
        this.loadMeetings();
        this.cancelDelete();
        this.toast.success('Réunion supprimée');
      },
      error: (err) => {
        this.error = err?.error?.message || 'Suppression impossible';
        this.toast.error(this.error);
      },
    });
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
}
