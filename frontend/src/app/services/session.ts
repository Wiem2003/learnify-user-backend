import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type SessionUser = {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  role?: string;
};

@Injectable({ providedIn: 'root' })
export class SessionService {

  private userSubject = new BehaviorSubject<SessionUser | null>(this.load());
  user$ = this.userSubject.asObservable();

  setUser(user: SessionUser) {
    this.userSubject.next(user);
    localStorage.setItem('session_user', JSON.stringify(user));
  }

  clear() {
    this.userSubject.next(null);
    localStorage.removeItem('session_user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
  }

  private load(): SessionUser | null {
    const raw = localStorage.getItem('session_user');
    return raw ? JSON.parse(raw) : null;
  }
}
