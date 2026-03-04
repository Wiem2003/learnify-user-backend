import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { Job, JobService, JobStatus } from '../../services/job.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin-job-form',
  templateUrl: './admin-job-form.component.html',
  styleUrl: './admin-job-form.component.scss',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
})
export class AdminJobFormComponent implements OnInit {
  isEdit = false;
  id: number | null = null;
  loading = true;
  saving = false;
  error = '';

  titre = '';
  nbPlaces: number | null = null;
  description = '';
  requirements = '';
  deadline = '';
  /** Date/heure de publication programmée (création uniquement). Si renseigné et dans le futur, l'offre reste en attente. */
  scheduledOpensAt = '';
  /** Statut actuel de l'offre (pour la modification). */
  currentStatus: JobStatus = 'OPEN';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.id = +idParam;
      this.jobService.getById(this.id).subscribe({
        next: (job) => {
          this.titre = job.titre ?? '';
          this.nbPlaces = job.nbPlaces ?? null;
          this.description = job.description ?? '';
          this.requirements = job.requirements ?? '';
          this.deadline = job.deadline ? job.deadline.slice(0, 16) : '';
          this.currentStatus = job.status ?? 'OPEN';
          this.loading = false;
        },
        error: () => {
          this.error = 'Offre introuvable';
          this.loading = false;
        },
      });
    } else {
      const d = new Date();
      d.setMonth(d.getMonth() + 1);
      this.deadline = d.toISOString().slice(0, 16);
      this.loading = false;
    }
  }

  submit(f: NgForm): void {
    this.error = '';
    if (f.invalid) {
      f.form.markAllAsTouched();
      return;
    }
    if (!this.titre?.trim()) {
      this.error = 'Le titre est requis';
      return;
    }
    const nb = this.nbPlaces != null ? Number(this.nbPlaces) : 0;
    if (isNaN(nb) || nb < 1) {
      this.error = 'Nombre de places invalide (min. 1)';
      return;
    }
    if (!this.deadline?.trim()) {
      this.error = 'La date limite est requise';
      return;
    }
    this.saving = true;

    const deadlineStr = this.deadline.length === 16 ? this.deadline + ':00' : this.deadline;
    const payload: Partial<Job> & { opensAt?: string | null } = {
      titre: this.titre.trim(),
      nbPlaces: nb,
      description: this.description.trim(),
      requirements: this.requirements.trim(),
      deadline: deadlineStr,
    };
    if (this.isEdit) payload.status = this.currentStatus;
    if (!this.isEdit && this.scheduledOpensAt?.trim()) {
      const opensStr = this.scheduledOpensAt.length === 16 ? this.scheduledOpensAt + ':00' : this.scheduledOpensAt.trim();
      payload.opensAt = opensStr;
    }

    if (this.isEdit && this.id != null) {
      this.jobService.update(this.id, payload).subscribe({
        next: () => {
          this.saving = false;
          this.toast.success('Offre mise à jour');
          this.router.navigate(['/admin/jobs']);
        },
        error: (err) => {
          this.error = err?.error?.message || 'Erreur lors de la mise à jour';
          this.saving = false;
          this.toast.error(this.error);
        },
      });
    } else {
      this.jobService.create(payload).subscribe({
        next: () => {
          this.saving = false;
          this.toast.success('Offre créée');
          this.router.navigate(['/admin/jobs']);
        },
        error: (err) => {
          this.error = err?.error?.message || 'Erreur lors de la création';
          this.saving = false;
          this.toast.error(this.error);
        },
      });
    }
  }
}
