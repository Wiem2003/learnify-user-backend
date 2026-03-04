import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export type Role = 'ADMIN' | 'TEACHER' | 'USER';

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  sessionId: string;
  user: UserDTO;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = environment.apiBase;
  private readonly userSubject = new BehaviorSubject<UserDTO | null>(this.readUser());
  readonly user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/api/auth/login`, payload).pipe(
      tap((res) => {
        localStorage.setItem('sessionId', res.sessionId);
        localStorage.setItem('currentUser', JSON.stringify(res.user));
        this.userSubject.next(res.user);
      })
    );
  }

  logout(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/api/auth/logout`, {}).pipe(
      tap(() => this.clearLocalSession())
    );
  }

  clearLocalSession(): void {
    localStorage.removeItem('sessionId');
    localStorage.removeItem('currentUser');
    this.userSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('sessionId');
  }

  getSessionId(): string | null {
    return localStorage.getItem('sessionId');
  }

  getCurrentUser(): UserDTO | null {
    return this.userSubject.value;
  }

  hasRole(role: Role): boolean {
    return this.userSubject.value?.role === role;
  }

  private readUser(): UserDTO | null {
    const raw = localStorage.getItem('currentUser');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserDTO;
    } catch {
      return null;
    }
  }
}

