import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Club, ClubRequest, JoinRequestDto } from '../models/club.model';

@Injectable({ providedIn: 'root' })
export class ClubService {
  private base = '/api/clubs';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Club[]> {
    return this.http.get<Club[]>(this.base);
  }

  getById(id: number): Observable<Club> {
    return this.http.get<Club>(`${this.base}/${id}`);
  }

  create(payload: Partial<Club>): Observable<Club> {
    return this.http.post<Club>(this.base, payload);
  }

  update(id: number, payload: Partial<Club>): Observable<Club> {
    return this.http.put<Club>(`${this.base}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  requestJoin(clubId: number, dto: JoinRequestDto): Observable<ClubRequest> {
    return this.http.post<ClubRequest>(`${this.base}/${clubId}/request`, dto);
  }

  getMyRequests(userId: number): Observable<ClubRequest[]> {
    return this.http.get<ClubRequest[]>(`${this.base}/requests/user/${userId}`);
  }

  getAllRequests(): Observable<ClubRequest[]> {
    return this.http.get<ClubRequest[]>(`${this.base}/requests`);
  }

  getPendingRequests(): Observable<ClubRequest[]> {
    return this.http.get<ClubRequest[]>(`${this.base}/requests/pending`);
  }

  acceptRequest(requestId: number): Observable<ClubRequest> {
    return this.http.put<ClubRequest>(`${this.base}/requests/${requestId}/accept`, {});
  }

  rejectRequest(requestId: number, reason: string): Observable<ClubRequest> {
    return this.http.put<ClubRequest>(`${this.base}/requests/${requestId}/reject`, { reason });
  }

  checkAccess(clubId: number, userId: number): Observable<{ access: boolean }> {
    return this.http.get<{ access: boolean }>(`${this.base}/${clubId}/access/${userId}`);
  }

  getMembers(clubId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/${clubId}/members`);
  }
}
