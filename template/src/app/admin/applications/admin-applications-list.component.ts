import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Application, ApplicationService, ApplicationStatus } from '../../services/application.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin-applications-list',
  templateUrl: './admin-applications-list.component.html',
  styleUrl: './admin-applications-list.component.scss',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
})
export class AdminApplicationsListComponent implements OnInit {
  applications: Application[] = [];
  loading = true;
  error = '';
  searchTerm = '';
  filterStatus = '';
  pageSize = 3;
  currentPage = 1;

  constructor(
    private applicationService: ApplicationService,
    private router: Router,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.loading = true;
    this.error = '';
    this.applicationService.getAll().subscribe({
      next: (list) => {
        this.applications = list;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Erreur lors du chargement des candidatures';
        this.loading = false;
      },
    });
  }

  get filteredApplications(): Application[] {
    let list = this.applications;
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      list = list.filter(
        (a) =>
          a.teacherName?.toLowerCase().includes(term) ||
          a.jobTitle?.toLowerCase().includes(term) ||
          a.motivation?.toLowerCase().includes(term)
      );
    }
    if (this.filterStatus) {
      list = list.filter((a) => a.status === this.filterStatus);
    }
    return list;
  }

  get paginatedApplications(): Application[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredApplications.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredApplications.length / this.pageSize));
  }

  setPage(p: number): void {
    this.currentPage = Math.max(1, Math.min(p, this.totalPages));
  }

  setStatus(app: Application, status: ApplicationStatus): void {
    this.applicationService.updateStatus(app.id, status).subscribe({
      next: () => {
        this.loadApplications();
        this.toast.success('Statut mis à jour : ' + this.statusLabel(status));
      },
      error: (err) => {
        this.error = err?.error?.message || 'Changement de statut impossible';
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

  statusLabel(s: ApplicationStatus): string {
    const map: Record<ApplicationStatus, string> = {
      PENDING: 'En attente',
      ACCEPTED: 'Acceptée',
      REJECTED: 'Refusée',
    };
    return map[s] ?? s;
  }

  /** Ouvre le CV dans un nouvel onglet pour affichage (pas de téléchargement). */
  viewCv(app: Application): void {
    this.applicationService.getCvBlob(app.id).subscribe({
      next: (blob) => {
        const type = blob.type || 'application/pdf';
        const displayBlob = new Blob([blob], { type });
        const url = URL.createObjectURL(displayBlob);
        window.open(url, '_blank', 'noopener');
        setTimeout(() => URL.revokeObjectURL(url), 60000);
      },
      error: (err) => {
        const msg = err?.error?.message ?? err?.message ?? 'Impossible d\'ouvrir le CV.';
        this.toast.error(msg);
      },
    });
  }

  /** Ouvre le certificat dans un nouvel onglet (PDF, JPG ou PNG selon le fichier). */
  viewCertificat(app: Application): void {
    this.applicationService.getCertificatBlob(app.id).subscribe({
      next: (blob) => {
        const type = blob.type || 'application/pdf';
        const displayBlob = new Blob([blob], { type });
        const url = URL.createObjectURL(displayBlob);
        window.open(url, '_blank', 'noopener');
        setTimeout(() => URL.revokeObjectURL(url), 60000);
      },
      error: (err) => {
        const msg = err?.error?.message ?? err?.message ?? 'Impossible d\'ouvrir le certificat.';
        this.toast.error(msg);
      },
    });
  }
}
