import { Component } from '@angular/core';

@Component({
  selector: 'app-cv',
  templateUrl: './cv.component.html',
  styleUrl: './cv.component.scss',
  standalone: false,
})
export class CvComponent {
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

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveCv(): void {
    this.isEditing = false;
    console.log('CV saved');
  }
}
