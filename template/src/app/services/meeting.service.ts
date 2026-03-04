import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from './api-base.service';

export interface Meeting {
  id: number;
  applicationId?: number;
  applicationJobTitle?: string;
  application?: { id: number };
  assignedToId?: number;
  assignedToName?: string;
  assignedTo?: { id: number; name: string };
  meetingDate: string;
  notes?: string;
}

@Injectable({ providedIn: 'root' })
export class MeetingService {
  constructor(private api: ApiBaseService) {}

  getAll(): Observable<Meeting[]> {
    return this.api.get<Meeting[]>('/api/meetings');
  }

  getById(id: number): Observable<Meeting> {
    return this.api.get<Meeting>(`/api/meetings/${id}`);
  }

  getByApplication(applicationId: number): Observable<Meeting> {
    return this.api.get<Meeting>(`/api/meetings/application/${applicationId}`);
  }

  create(payload: { applicationId?: number; evaluatorId: number; meetingDate: string }): Observable<Meeting> {
    return this.api.post<typeof payload, Meeting>('/api/meetings', payload);
  }

  update(id: number, payload: { meetingDate?: string; evaluatorId?: number; notes?: string }): Observable<Meeting> {
    return this.api.put<typeof payload, Meeting>(`/api/meetings/${id}`, payload);
  }

  delete(id: number): Observable<{ message: string }> {
    return this.api.delete<{ message: string }>(`/api/meetings/${id}`);
  }
}
