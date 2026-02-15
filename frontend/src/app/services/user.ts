import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
 avatarUrl?: string; // ✅

}

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = 'http://localhost:8080/api/users';        // me, update, password...
  private adminUrl = 'http://localhost:8080/api/admin/users'; // ✅ admin list/delete

  constructor(private http: HttpClient) {}

  // me
  getMe(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me`);
  }

  updateMe(data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/me`, data);
  }

  changePassword(payload: { currentPassword: string; newPassword: string; confirmNewPassword: string }): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/me/password`, payload);
  }

  uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ avatarUrl: string }>(`${this.baseUrl}/me/avatar`, formData);
  }

  // ✅ admin users
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.adminUrl);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminUrl}/${id}`);
  }
}
