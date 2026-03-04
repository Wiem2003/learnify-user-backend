import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Job, JobService } from '../../services/job.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin-jobs-list',
  templateUrl: './admin-jobs-list.component.html',
  styleUrl: './admin-jobs-list.component.scss',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
})
export class AdminJobsListComponent implements OnInit {
  jobs: Job[] = [];
  /** jobId -> opensAt (ISO) pour afficher "En attente (publication le ...)". */
  scheduledByJobId: Record<number, string> = {};
  loading = true;
  error = '';
  searchTerm = '';
  filterStatus = '';
  showDeleteModal = false;
  jobToDelete: Job | null = null;
  pageSize = 5;
  currentPage = 1;

  constructor(
    private jobService: JobService,
    private router: Router,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.loading = true;
    this.error = '';
    this.jobService.getAllJobs().subscribe({
      next: (list) => {
        this.jobs = list;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Erreur lors du chargement des offres';
        this.loading = false;
      },
    });
    this.jobService.getScheduledPublications().subscribe({
      next: (list) => {
        this.scheduledByJobId = {};
        list.forEach((s) => (this.scheduledByJobId[s.jobId] = s.opensAt));
      },
    });
  }

  getScheduledOpensAt(jobId: number): string | null {
    return this.scheduledByJobId[jobId] ?? null;
  }

  formatScheduledDate(opensAt: string): string {
    if (!opensAt) return '';
    const d = new Date(opensAt);
    return d.toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });
  }

  get filteredJobs(): Job[] {
    let list = this.jobs;
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      list = list.filter(
        (j) =>
          j.titre?.toLowerCase().includes(term) ||
          j.description?.toLowerCase().includes(term)
      );
    }
    if (this.filterStatus) {
      list = list.filter((j) => j.status === this.filterStatus);
    }
    return list;
  }

  get paginatedJobs(): Job[] {
    const total = this.totalPages;
    const page = Math.min(this.currentPage, total);
    const start = (page - 1) * this.pageSize;
    return this.filteredJobs.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredJobs.length / this.pageSize));
  }

  get effectivePage(): number {
    return Math.min(this.currentPage, this.totalPages);
  }

  setPage(p: number): void {
    this.currentPage = Math.max(1, Math.min(p, this.totalPages));
  }

  confirmDelete(job: Job): void {
    this.jobToDelete = job;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.jobToDelete = null;
    this.showDeleteModal = false;
  }

  deleteJob(): void {
    if (!this.jobToDelete) return;
    this.jobService.delete(this.jobToDelete.id).subscribe({
      next: () => {
        this.loadJobs();
        this.cancelDelete();
        this.toast.success('Offre supprimée');
      },
      error: (err) => {
        this.error = err?.error?.message || 'Suppression impossible';
        this.toast.error(this.error);
      },
    });
  }

  renew(job: Job): void {
    const newDeadline = new Date();
    newDeadline.setMonth(newDeadline.getMonth() + 1);
    const deadlineStr = newDeadline.toISOString().slice(0, 19);
    this.jobService.renew(job.id, deadlineStr).subscribe({
      next: () => {
        this.loadJobs();
        this.toast.success('Offre renouvelée');
      },
      error: (err) => {
        this.error = err?.error?.message || 'Renouvellement impossible';
        this.toast.error(this.error);
      },
    });
  }

  close(job: Job): void {
    this.jobService.close(job.id).subscribe({
      next: () => {
        this.loadJobs();
        this.toast.success('Offre clôturée');
      },
      error: (err) => {
        this.error = err?.error?.message || 'Clôture impossible';
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
    });
  }

  statusLabel(status: string): string {
    const labels: Record<string, string> = { OPEN: 'Ouvert', EXPIRED: 'Expiré', CLOSED: 'Fermé' };
    return labels[status] ?? status;
  }

  /** Lance la vérification d'expiration (offres dont la date limite est dépassée → statut Expiré + notification aux admins). */
  runExpirationCheck(): void {
    this.jobService.runExpirationCheck().subscribe({
      next: () => {
        this.loadJobs();
        this.toast.success('Vérification d\'expiration effectuée. Les offres concernées sont passées en « Expiré » et les admins ont été notifiés.');
      },
      error: (err) => {
        this.toast.error(err?.error?.message ?? 'Impossible de lancer la vérification.');
      },
    });
  }
}
