import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from './api-base.service';

export type JobStatus = 'OPEN' | 'EXPIRED' | 'CLOSED';

export interface Job {
  id: number;
  titre: string;
  nbPlaces: number;
  description?: string;
  requirements?: string;
  createdAt?: string;
  deadline: string;
  status: JobStatus;
}

/** Offre avec score de correspondance ATS (CV profil enseignant vs offre). */
export interface JobWithScore {
  job: Job;
  matchScore: number;
}

@Injectable({ providedIn: 'root' })
export class JobService {
  constructor(private api: ApiBaseService) {}

  /** Offres ouvertes (côté public / enseignants). */
  getOpenJobs(): Observable<Job[]> {
    return this.api.get<Job[]>('/api/jobs/open');
  }

  /** Offres ouvertes classées par pertinence ATS (CV profil). Réservé enseignants. */
  getOpenJobsRecommended(): Observable<JobWithScore[]> {
    return this.api.get<JobWithScore[]>('/api/jobs/open/recommended');
  }

  /** Indique si l'enseignant connecté a un CV profil pour les recommandations ATS. */
  hasMyCv(): Observable<{ hasCv: boolean }> {
    return this.api.get<{ hasCv: boolean }>('/api/jobs/my-cv');
  }

  /** Upload du CV profil pour les recommandations ATS (PDF recommandé). */
  uploadMyCv(file: File): Observable<{ message: string }> {
    const formData = new FormData();
    formData.append('cv', file);
    return this.api.postFormData<{ message: string }>('/api/jobs/my-cv', formData);
  }

  /** Toutes les offres (admin). */
  getAllJobs(): Observable<Job[]> {
    return this.api.get<Job[]>('/api/jobs');
  }

  /** Planifications de publication à venir (admin). jobId -> opensAt ISO string. */
  getScheduledPublications(): Observable<{ jobId: number; opensAt: string }[]> {
    return this.api.get<{ jobId: number; opensAt: string }[]>('/api/jobs/scheduled-publications');
  }

  getById(id: number): Observable<Job> {
    return this.api.get<Job>(`/api/jobs/${id}`);
  }

  /** Création d'offre. opensAt optionnel : si fourni et dans le futur, l'offre reste en attente jusqu'à cette date. */
  create(payload: Partial<Job> & { opensAt?: string | null }): Observable<Job> {
    return this.api.post<typeof payload, Job>('/api/jobs', payload);
  }

  update(id: number, job: Partial<Job>): Observable<Job> {
    return this.api.put<Partial<Job>, Job>(`/api/jobs/${id}`, job);
  }

  renew(id: number, deadline: string): Observable<Job> {
    return this.api.put<{ deadline: string }, Job>(`/api/jobs/${id}/renew`, { deadline });
  }

  close(id: number): Observable<Job> {
    return this.api.put<unknown, Job>(`/api/jobs/${id}/close`, {});
  }

  delete(id: number): Observable<{ message: string }> {
    return this.api.delete<{ message: string }>(`/api/jobs/${id}`);
  }

  /** IDs des offres enregistrées en favoris (enseignant). */
  getSavedJobIds(): Observable<number[]> {
    return this.api.get<number[]>('/api/jobs/saved/ids');
  }

  /** Liste des offres enregistrées en favoris (enseignant). */
  getSavedJobs(): Observable<Job[]> {
    return this.api.get<Job[]>('/api/jobs/saved');
  }

  /** Ajouter une offre aux favoris. */
  saveJob(id: number): Observable<{ message: string }> {
    return this.api.post<unknown, { message: string }>(`/api/jobs/${id}/save`, {});
  }

  /** Retirer une offre des favoris. */
  unsaveJob(id: number): Observable<{ message: string }> {
    return this.api.delete<{ message: string }>(`/api/jobs/${id}/save`);
  }

  /** Lance la vérification d'expiration des offres (admin). Les offres dont la date limite est dépassée passent en EXPIRED et les admins sont notifiés. */
  runExpirationCheck(): Observable<{ message: string }> {
    return this.api.post<unknown, { message: string }>('/api/jobs/run-expiration', {});
  }
}

