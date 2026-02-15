import { Component } from '@angular/core';

interface JobOffer {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  requiredLevel: string;
  description: string;
  postedDate: string;
}

@Component({
  selector: 'app-job-offers',
  templateUrl: './job-offers.component.html',
  styleUrl: './job-offers.component.scss',
  standalone: false,
})
export class JobOffersComponent {
  jobOffers: JobOffer[] = [
    {
      id: 1,
      title: 'Bilingual Customer Support',
      company: 'TechCorp International',
      location: 'Remote',
      type: 'Full-time',
      requiredLevel: 'B2',
      description: 'Support customers in French and English. Excellent communication skills required.',
      postedDate: '2024-03-12',
    },
    {
      id: 2,
      title: 'Language Tutor',
      company: 'LearnHub',
      location: 'Hybrid',
      type: 'Part-time',
      requiredLevel: 'C1',
      description: 'Teach language courses online. Native or near-native fluency required.',
      postedDate: '2024-03-10',
    },
    {
      id: 3,
      title: 'Translation Intern',
      company: 'Global Media',
      location: 'Paris',
      type: 'Internship',
      requiredLevel: 'B2',
      description: 'Translate documents from French to English. Great for language learners.',
      postedDate: '2024-03-08',
    },
  ];

  applyForJob(job: JobOffer): void {
    console.log('Applying for:', job.title);
  }

  viewJob(job: JobOffer): void {
    console.log('View job:', job.title);
  }
}
