import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from './api-base.service';

/** ADMIN = admin, TEACHER = enseignant, USER = étudiant (en base de données). */
export type Role = 'ADMIN' | 'TEACHER' | 'USER';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
  password?: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private api: ApiBaseService) {}

  getAll(): Observable<User[]> {
    return this.api.get<User[]>('/api/users');
  }

  getTeachers(): Observable<User[]> {
    return this.api.get<User[]>('/api/users/teachers');
  }

  getById(id: number): Observable<User> {
    return this.api.get<User>(`/api/users/${id}`);
  }

  update(id: number, user: Partial<User>): Observable<User> {
    return this.api.put<Partial<User>, User>(`/api/users/${id}`, user);
  }

  delete(id: number): Observable<{ message: string }> {
    return this.api.delete<{ message: string }>(`/api/users/${id}`);
  }
}
