import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Rating, RatingService } from '../../services/rating.service';
import { User, UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss',
  standalone: false,
})
export class FeedbackComponent implements OnInit {
  teachers: User[] = [];
  myRatings: Rating[] = [];
  loading = false;
  loadingRatings = false;
  error = '';
  submitting = false;

  selectedTeacherId: number | null = null;
  note = 0;
  commentaire = '';

  constructor(
    private auth: AuthService,
    private userService: UserService,
    private ratingService: RatingService,
    private toast: ToastService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (this.canRate()) {
      this.loadTeachers();
      this.loadMyRatings();
    }
  }

  canRate(): boolean {
    return this.auth.isAuthenticated() && this.auth.hasRole('USER');
  }

  loadTeachers(): void {
    this.loading = true;
    this.userService.getTeachers().subscribe({
      next: (list) => {
        this.teachers = list ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Impossible de charger la liste des enseignants.';
        this.loading = false;
      },
    });
  }

  loadMyRatings(): void {
    this.loadingRatings = true;
    this.ratingService.getMyRatings().subscribe({
      next: (list) => {
        this.myRatings = list ?? [];
        this.loadingRatings = false;
      },
      error: () => {
        this.myRatings = [];
        this.loadingRatings = false;
      },
    });
  }

  setRating(r: number): void {
    this.note = r;
  }

  submitRating(): void {
    if (!this.selectedTeacherId || this.note < 1 || this.note > 5) {
      this.toast.error('Veuillez sélectionner un enseignant et une note (1 à 5).');
      return;
    }
    const comment = (this.commentaire ?? '').trim();
    if (!comment) {
      this.toast.error('Veuillez ajouter un commentaire.');
      return;
    }
    this.submitting = true;
    this.error = '';
    this.ratingService.createRating(this.selectedTeacherId, this.note, comment).subscribe({
      next: () => {
        this.submitting = false;
        this.selectedTeacherId = null;
        this.note = 0;
        this.commentaire = '';
        this.loadMyRatings();
        this.toast.success('Votre avis a bien été enregistré.');
      },
      error: (err) => {
        this.submitting = false;
        const msg = err?.error?.message ?? err?.message ?? 'Impossible d\'enregistrer l\'avis.';
        this.error = msg;
        this.toast.error(msg);
      },
    });
  }

  teacherName(r: Rating): string {
    return r.teacherName ?? r.teacher?.name ?? `Enseignant #${r.teacherId ?? ''}`;
  }

  formatDate(d: string | undefined): string {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  goToLogin(): void {
    this.router.navigateByUrl('/login');
  }
}
