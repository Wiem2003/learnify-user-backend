import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from './api-base.service';

export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface Application {
  id: number;
  jobId: number;
  jobTitle: string;
  teacherId: number;
  teacherName: string;
  cvPath?: string;
  certificatPath?: string;
  motivation?: string;
  status: ApplicationStatus;
  createdAt?: string;
  updatedAt?: string;
  matchScore?: number;
}

@Injectable({ providedIn: 'root' })
export class ApplicationService {
  constructor(private api: ApiBaseService) {}

  getAll(params?: { keyword?: string; minScore?: number; sortBy?: string }): Observable<Application[]> {
    return this.api.get<Application[]>('/api/applications', params as Record<string, unknown>);
  }

  getByJob(jobId: number, params?: { keyword?: string; minScore?: number; sortBy?: string }): Observable<Application[]> {
    return this.api.get<Application[]>(`/api/applications/job/${jobId}`, params as Record<string, unknown>);
  }

  getById(id: number): Observable<Application> {
    return this.api.get<Application>(`/api/applications/${id}`);
  }

  /** Liste des candidatures de l'enseignant connecté. */
  getMyApplications(): Observable<Application[]> {
    return this.api.get<Application[]>('/api/applications/my-applications');
  }

  /** Créer une candidature (enseignant). */
  applyToJob(jobId: number, motivation: string, cv?: File | null, certificat?: File | null): Observable<Application> {
    const formData = new FormData();
    const payload = { jobId, motivation };
    formData.append('application', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
    if (cv) formData.append('cv', cv);
    if (certificat) formData.append('certificat', certificat);
    return this.api.postFormData<Application>('/api/applications', formData);
  }

  /** Modifier sa candidature (enseignant). */
  updateApplication(
    id: number,
    motivation: string,
    cv?: File | null,
    certificat?: File | null
  ): Observable<Application> {
    const formData = new FormData();
    formData.append(
      'application',
      new Blob([JSON.stringify({ motivation })], { type: 'application/json' })
    );
    if (cv) formData.append('cv', cv);
    if (certificat) formData.append('certificat', certificat);
    return this.api.postFormData<Application>(`/api/applications/${id}/update`, formData);
  }

  updateStatus(id: number, status: ApplicationStatus): Observable<Application> {
    return this.api.put<{ status: string }, Application>(`/api/applications/${id}/status`, { status });
  }

  delete(id: number): Observable<{ message: string }> {
    return this.api.delete<{ message: string }>(`/api/applications/${id}`);
  }

  /** Récupère le CV d'une candidature en blob (avec auth). */
  getCvBlob(applicationId: number): Observable<Blob> {
    return this.api.getBlob(`/api/applications/${applicationId}/cv/file`);
  }

  /** Récupère le certificat d'une candidature en blob (avec auth). */
  getCertificatBlob(applicationId: number): Observable<Blob> {
    return this.api.getBlob(`/api/applications/${applicationId}/certificat/file`);
  }
}
