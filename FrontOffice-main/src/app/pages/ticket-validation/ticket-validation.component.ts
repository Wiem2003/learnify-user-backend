import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TicketValidationService, TicketValidationResponse } from '../../services/ticket-validation.service';
import { ReservationService } from '../../services/reservation.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-ticket-validation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="validation-page">
      <div class="container">
        <div class="validation-card" *ngIf="!loading && validationResult">
          <!-- Valid Ticket -->
          <div *ngIf="validationResult.valid" class="valid-ticket">
            <div class="success-icon">
              <i class="ti ti-check"></i>
            </div>
            <h1>✅ Ticket Valide</h1>
            <p class="welcome-message">{{ validationResult.message }}</p>
            
            <div class="ticket-info">
              <div class="info-row">
                <span class="label">Code:</span>
                <span class="value">{{ validationResult.ticketCode }}</span>
              </div>
              <div class="info-row">
                <span class="label">Événement:</span>
                <span class="value">{{ validationResult.eventName }}</span>
              </div>
              <div class="info-row">
                <span class="label">Date:</span>
                <span class="value">{{ validationResult.eventDate | date:'fullDate' }}</span>
              </div>
              <div class="info-row">
                <span class="label">Lieu:</span>
                <span class="value">{{ validationResult.eventLocation }}</span>
              </div>
              <div class="info-row">
                <span class="label">Participant:</span>
                <span class="value">{{ validationResult.participantName }}</span>
              </div>
              <div class="info-row status-row">
                <span class="label">Statut:</span>
                <span class="value" [class.used]="validationResult.alreadyUsed">
                  {{ validationResult.alreadyUsed ? '⚠️ Déjà utilisé' : '✅ Non utilisé' }}
                </span>
              </div>
            </div>

            <div class="actions">
              <button *ngIf="!validationResult.alreadyUsed" 
                      class="btn-primary" 
                      (click)="markAsUsed()">
                Marquer comme utilisé
              </button>
              <button class="btn-secondary" (click)="downloadPDF()">
                <i class="ti ti-download"></i> Télécharger PDF
              </button>
            </div>
          </div>

          <!-- Invalid Ticket -->
          <div *ngIf="!validationResult.valid" class="invalid-ticket">
            <div class="error-icon">
              <i class="ti ti-x"></i>
            </div>
            <h1>❌ Ticket Invalide</h1>
            <p class="error-message">{{ validationResult.message }}</p>
          </div>
        </div>

        <!-- Loading -->
        <div *ngIf="loading" class="loading">
          <div class="spinner"></div>
          <p>Validation en cours...</p>
        </div>

        <!-- Error -->
        <div *ngIf="error" class="error-card">
          <div class="error-icon">
            <i class="ti ti-alert-circle"></i>
          </div>
          <h1>Erreur</h1>
          <p>{{ error }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .validation-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .container {
      max-width: 500px;
      width: 100%;
    }

    .validation-card, .error-card {
      background: white;
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      text-align: center;
    }

    .success-icon, .error-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      font-size: 40px;
    }

    .success-icon {
      background: #10b981;
      color: white;
    }

    .error-icon {
      background: #ef4444;
      color: white;
    }

    h1 {
      font-size: 28px;
      margin: 0 0 10px;
      color: #1f2937;
    }

    .welcome-message, .error-message {
      font-size: 16px;
      color: #6b7280;
      margin-bottom: 30px;
    }

    .ticket-info {
      background: #f9fafb;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 30px;
      text-align: left;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #e5e7eb;
    }

    .info-row:last-child {
      border-bottom: none;
    }

    .label {
      font-weight: 600;
      color: #6b7280;
    }

    .value {
      color: #1f2937;
      font-weight: 500;
    }

    .value.used {
      color: #ef4444;
    }

    .status-row .value:not(.used) {
      color: #10b981;
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .btn-primary, .btn-secondary {
      padding: 14px 24px;
      border-radius: 12px;
      border: none;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .btn-primary {
      background: #10b981;
      color: white;
    }

    .btn-primary:hover {
      background: #059669;
      transform: translateY(-2px);
    }

    .btn-secondary {
      background: #f3f4f6;
      color: #1f2937;
    }

    .btn-secondary:hover {
      background: #e5e7eb;
    }

    .loading {
      text-align: center;
      color: white;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loading p {
      font-size: 18px;
    }
  `]
})
export class TicketValidationComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private validationService = inject(TicketValidationService);
  private reservationService = inject(ReservationService);
  
  ticketCode: string = '';
  validationResult: TicketValidationResponse | null = null;
  loading = true;
  error: string = '';

  ngOnInit(): void {
    // Récupérer le code ticket depuis l'URL
    this.ticketCode = this.route.snapshot.paramMap.get('code') || '';
    
    if (this.ticketCode) {
      this.validateTicket();
    } else {
      this.error = 'Code ticket manquant';
      this.loading = false;
    }
  }

  validateTicket(): void {
    this.validationService.validateTicket(this.ticketCode).subscribe({
      next: (result) => {
        this.validationResult = result;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors de la validation du ticket';
        this.loading = false;
        console.error('Validation error:', err);
      }
    });
  }

  markAsUsed(): void {
    if (confirm('Marquer ce ticket comme utilisé ?')) {
      this.validationService.markAsUsed(this.ticketCode).subscribe({
        next: () => {
          if (this.validationResult) {
            this.validationResult.alreadyUsed = true;
          }
          alert('✅ Ticket marqué comme utilisé');
        },
        error: () => {
          alert('❌ Erreur lors du marquage');
        }
      });
    }
  }

  downloadPDF(): void {
    window.open(`${environment.apiBase}/reservations/ticket/${this.ticketCode}`, '_blank');
  }
}
