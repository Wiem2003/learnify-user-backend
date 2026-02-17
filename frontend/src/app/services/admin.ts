import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RegisterAdminRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private adminUrl = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) {}

  // ✅ Create Admin
  createAdmin(payload: RegisterAdminRequest): Observable<any> {
    return this.http.post(`${this.adminUrl}/create-admin`, payload);
  }

  // ✅ CREATE TUTOR ➜ AJOUTE ICI
  createTutor(payload: RegisterAdminRequest): Observable<any> {
    return this.http.post(`${this.adminUrl}/create-tutor`, payload);
  }
}
