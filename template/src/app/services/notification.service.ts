import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from './api-base.service';

export interface NotificationDTO {
  id: number;
  type: string;
  title: string;
  message: string;
  meetingId?: number;
  read: boolean;
  createdAt: string;
  meetingDate?: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private api: ApiBaseService) {}

  /** Liste des notifications non lues (avec sync pour les enseignants). */
  getUnread(): Observable<NotificationDTO[]> {
    return this.api.get<NotificationDTO[]>('/api/notifications');
  }

  /** Nombre de notifications non lues. */
  getUnreadCount(): Observable<{ count: number }> {
    return this.api.get<{ count: number }>('/api/notifications/count');
  }

  /** Marquer une notification comme lue. */
  markAsRead(id: number): Observable<void> {
    return this.api.patch<void>(`/api/notifications/${id}/read`);
  }

  /** Marquer toutes comme lues. */
  markAllAsRead(): Observable<void> {
    return this.api.patch<void>('/api/notifications/read-all');
  }
}
