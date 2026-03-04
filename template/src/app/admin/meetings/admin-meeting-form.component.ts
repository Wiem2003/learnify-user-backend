import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Meeting, MeetingService } from '../../services/meeting.service';
import { User, UserService } from '../../services/user.service';
import { Application, ApplicationService } from '../../services/application.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-admin-meeting-form',
  templateUrl: './admin-meeting-form.component.html',
  styleUrl: './admin-meeting-form.component.scss',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
})
export class AdminMeetingFormComponent implements OnInit {
  isEdit = false;
  id: number | null = null;
  loading = true;
  saving = false;
  error = '';

  applications: Application[] = [];
  evaluators: User[] = [];

  applicationId: number | null = null;
  evaluatorId: number | null = null;
  meetingDate = '';
  notes = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private meetingService: MeetingService,
    private userService: UserService,
    private applicationService: ApplicationService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.userService.getTeachers().subscribe({
      next: (list) => (this.evaluators = list),
      error: () => (this.evaluators = []),
    });
    this.applicationService.getAll().subscribe({
      next: (list) => (this.applications = list),
      error: () => (this.applications = []),
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.id = +idParam;
      this.meetingService.getById(this.id).subscribe({
        next: (m) => {
          this.applicationId = m.applicationId ?? null;
          this.evaluatorId = m.assignedToId ?? m.assignedTo?.id ?? null;
          this.meetingDate = m.meetingDate ? m.meetingDate.slice(0, 16) : '';
          this.notes = m.notes ?? '';
          this.loading = false;
        },
        error: () => {
          this.error = 'Réunion introuvable';
          this.loading = false;
        },
      });
    } else {
      const d = new Date();
      d.setMinutes(d.getMinutes() + 60);
      this.meetingDate = d.toISOString().slice(0, 16);
      this.loading = false;
    }
  }

  submit(): void {
    const evId = this.evaluatorId != null ? Number(this.evaluatorId) : null;
    if (evId == null || isNaN(evId)) {
      this.error = 'Veuillez choisir un évaluateur';
      return;
    }
    if (!this.meetingDate?.trim()) {
      this.error = 'La date est requise';
      return;
    }

    this.error = '';
    this.saving = true;

    const dateStr = this.meetingDate.replace('T', 'T');
    const meetingDateISO = dateStr.length <= 16 ? dateStr + ':00' : dateStr;

    if (this.isEdit && this.id != null) {
      this.meetingService
        .update(this.id, {
          meetingDate: meetingDateISO,
          evaluatorId: evId,
          notes: this.notes.trim() || undefined,
        })
        .subscribe({
          next: () => {
            this.saving = false;
            this.toast.success('Réunion mise à jour');
            this.router.navigate(['/admin/meetings']);
          },
          error: (err) => {
            this.error = err?.error?.message || 'Erreur lors de la mise à jour';
            this.saving = false;
            this.toast.error(this.error);
          },
        });
    } else {
      const payload: { applicationId?: number; evaluatorId: number; meetingDate: string } = {
        evaluatorId: evId,
        meetingDate: meetingDateISO,
      };
      if (this.applicationId != null) payload.applicationId = this.applicationId;
      this.meetingService.create(payload).subscribe({
        next: () => {
          this.saving = false;
          this.toast.success('Réunion créée');
          this.router.navigate(['/admin/meetings']);
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
