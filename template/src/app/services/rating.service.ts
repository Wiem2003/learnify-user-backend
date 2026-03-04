import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from './api-base.service';

export interface Rating {
  id: number;
  teacherId?: number;
  teacherName?: string;
  teacher?: { id: number; name?: string };
  studentId?: number;
  studentName?: string;
  student?: { id: number; name?: string };
  note: number;
  commentaire?: string;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class RatingService {
  constructor(private api: ApiBaseService) {}

  /** Tous les avis (admin). */
  getAll(): Observable<Rating[]> {
    return this.api.get<Rating[]>('/api/ratings');
  }

  /** Mes avis (étudiant connecté). */
  getMyRatings(): Observable<Rating[]> {
    return this.api.get<Rating[]>('/api/ratings/my-ratings');
  }

  /** Créer un avis sur un enseignant (étudiant). */
  createRating(teacherId: number, note: number, commentaire: string): Observable<Rating> {
    return this.api.post<{ teacherId: number; note: number; commentaire: string }, Rating>('/api/ratings', {
      teacherId,
      note,
      commentaire,
    });
  }

  delete(id: number): Observable<{ message: string }> {
    return this.api.delete<{ message: string }>(`/api/ratings/${id}`);
  }
}
