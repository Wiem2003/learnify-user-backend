import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type UserSessionDto = {
  sessionId: string;
  browser: string;
  os: string;
  ip: string;
  createdAt: string;
  lastSeenAt: string;
  revoked: boolean;
};

@Injectable({ providedIn: 'root' })
export class SessionsService {

  private readonly API = 'http://localhost:8080/api/me';

  constructor(private http: HttpClient) {}

  getMySessions(): Observable<UserSessionDto[]> {
    return this.http.get<UserSessionDto[]>(`${this.API}/sessions`);
  }
}
