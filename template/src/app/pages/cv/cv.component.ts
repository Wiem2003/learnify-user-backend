import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { JobService } from '../../services/job.service';

@Component({
  selector: 'app-cv',
  templateUrl: './cv.component.html',
  styleUrl: './cv.component.scss',
  standalone: false,
})
export class CvComponent implements OnInit {
  cv = {
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 890',
    summary: 'Experienced language learner with B2 French and A2 Spanish. Seeking opportunities to apply language skills in international environments.',
    education: [
      { school: 'LearnHub', degree: 'French B2', year: '2024' },
      { school: 'LearnHub', degree: 'Spanish A2', year: '2023' },
    ],
    skills: ['French (B2)', 'Spanish (A2)', 'English (Native)', 'Communication', 'Teamwork'],
    experience: [
      { role: 'Language Tutor Assistant', company: 'LearnHub', period: '2023-Present', desc: 'Helped students practice conversation.' },
    ],
  };

  isEditing = false;

  /** ATS CV profil (enseignants) */
  isTeacher = false;
  hasCv = false;
  atsLoading = false;
  atsUploading = false;
  atsError = '';
  atsSuccess = '';

  constructor(
    private auth: AuthService,
    private jobService: JobService,
  ) {}

  ngOnInit(): void {
    this.isTeacher = this.auth.hasRole('TEACHER');
    if (this.isTeacher) {
      this.loadHasCv();
    }
  }

  loadHasCv(): void {
    this.atsLoading = true;
    this.atsError = '';
    this.jobService.hasMyCv().subscribe({
      next: (res) => {
        this.hasCv = res.hasCv;
        this.atsLoading = false;
      },
      error: () => {
        this.atsLoading = false;
        this.hasCv = false;
      },
    });
  }

  onCvFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      this.atsError = 'Veuillez sélectionner un fichier PDF.';
      return;
    }
    this.atsError = '';
    this.atsSuccess = '';
    this.atsUploading = true;
    this.jobService.uploadMyCv(file).subscribe({
      next: (res) => {
        this.atsSuccess = res.message || 'CV enregistré.';
        this.hasCv = true;
        this.atsUploading = false;
        input.value = '';
      },
      error: (err) => {
        this.atsError = err?.error?.message || 'Erreur lors de l\'envoi du CV.';
        this.atsUploading = false;
      },
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveCv(): void {
    this.isEditing = false;
    console.log('CV saved');
  }
}
