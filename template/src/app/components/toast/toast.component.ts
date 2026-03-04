import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast, ToastType } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" aria-live="polite">
      @for (t of (toastService.toasts | async) ?? []; track t.id) {
        <div class="toast toast-{{ t.type }}" role="alert">
          <span class="toast-icon">
            @switch (t.type) {
              @case ('success') { <i class="ti ti-circle-check"></i> }
              @case ('error') { <i class="ti ti-alert-circle"></i> }
              @case ('info') { <i class="ti ti-info-circle"></i> }
            }
          </span>
          <span class="toast-message">{{ t.message }}</span>
          <button type="button" class="toast-close" (click)="toastService.dismiss(t.id)" aria-label="Fermer">
            <i class="ti ti-x"></i>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 380px;
    }
    .toast {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 18px;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease;
    }
    .toast-success { background: #10b981; color: #fff; }
    .toast-error { background: #ef4444; color: #fff; }
    .toast-info { background: #3b82f6; color: #fff; }
    .toast-icon { font-size: 22px; flex-shrink: 0; }
    .toast-message { flex: 1; font-size: 14px; }
    .toast-close {
      background: none;
      border: none;
      color: inherit;
      opacity: 0.9;
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .toast-close:hover { opacity: 1; }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `],
})
export class ToastComponent {
  toastService = inject(ToastService);
}
