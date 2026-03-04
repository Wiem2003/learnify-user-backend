import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts$ = new BehaviorSubject<Toast[]>([]);
  private nextId = 1;
  private defaultDuration = 4000;

  get toasts() {
    return this.toasts$.asObservable();
  }

  get snapshot(): Toast[] {
    return this.toasts$.value;
  }

  success(message: string, duration = this.defaultDuration): void {
    this.push('success', message, duration);
  }

  error(message: string, duration = this.defaultDuration): void {
    this.push('error', message, duration);
  }

  info(message: string, duration = this.defaultDuration): void {
    this.push('info', message, duration);
  }

  private push(type: ToastType, message: string, duration: number): void {
    const id = this.nextId++;
    const toast: Toast = { id, type, message, duration };
    this.toasts$.next([...this.toasts$.value, toast]);
    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
  }

  dismiss(id: number): void {
    this.toasts$.next(this.toasts$.value.filter((t) => t.id !== id));
  }

  clear(): void {
    this.toasts$.next([]);
  }
}
