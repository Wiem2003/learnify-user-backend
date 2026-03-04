import { Injectable } from '@angular/core';
import { ApiBaseService } from './api-base.service';
import { Observable } from 'rxjs';

export interface CourseDto {
  id: number;
  title: string;
  category: string;
  level: string;
  description?: string;
  duration?: string;
  price?: number;
  teacher?: string;
  image?: string;
  thumbnail?: string;
  lessons?: string[];
  students?: number;
  createdAt?: string;
}

export interface Paged<T> { items: T[]; page: number; size: number; totalElements: number; totalPages: number }

@Injectable({ providedIn: 'root' })
export class CourseService {
  constructor(private api: ApiBaseService) {}

  list(page = 0, size = 10): Observable<Paged<CourseDto>> {
    return this.api.get<Paged<CourseDto>>('/courses', { page, size });
  }

  get(id: number) {
    return this.api.get<CourseDto>(`/courses/${id}`);
  }

  create(payload: Partial<CourseDto>) {
    return this.api.post<Partial<CourseDto>, CourseDto>('/admin/courses', payload);
  }

  update(id: number, payload: Partial<CourseDto>) {
    return this.api.put<Partial<CourseDto>, CourseDto>(`/admin/courses/${id}`, payload);
  }

  delete(id: number) {
    return this.api.delete(`/admin/courses/${id}`);
  }
}
