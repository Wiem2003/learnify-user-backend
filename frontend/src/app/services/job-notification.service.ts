import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface JobNotification {
  id: number;
  userId: number;
  message: string;
  read: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class JobNotificationService {
  private base = `${environment.apiBase}/job-notifications`;

  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  getMyNotifications(): Observable<JobNotification[]> {
    return this.http.get<JobNotification[]>(this.base, { headers: this.authHeaders() });
  }

  getUnreadCount(): Observable<number> {
    return this.http.get<number>(`${this.base}/unread-count`, { headers: this.authHeaders() });
  }

  markAsRead(id: number): Observable<void> {
    return this.http.patch<void>(`${this.base}/${id}/read`, {}, { headers: this.authHeaders() });
  }

  markAllAsRead(): Observable<void> {
    return this.http.patch<void>(`${this.base}/read-all`, {}, { headers: this.authHeaders() });
  }
}
