import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Event } from '../../../models/event.model';
import { EventService } from '../../../services/event.service';
import { ReservationService, ReservationRequest } from '../../../services/reservation.service';
import { AIService, PredictionResponse, RecommendedEvent } from '../../../services/ai.service';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-client-event-details',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    <ng-container *ngIf="event; else notFound">
      <div class="client-page">
        <div class="event-hero">
          <div class="container">
            <div class="hero-content">
              <div class="breadcrumb">
                <a routerLink="/events">Events</a>
                <i class="ti ti-chevron-right"></i>
                <span>{{ event.category }}</span>
              </div>
              <span class="event-badge" [attr.data-category]="event.category">{{ event.category }}</span>
              <h1 class="event-title">{{ event.name }}</h1>
              <div class="event-meta">
                <div class="meta-block">
                  <i class="ti ti-calendar"></i>
                  <div>
                    <span class="meta-label">Date</span>
                    <span class="meta-value">{{ event.date | date:'fullDate' }}</span>
                  </div>
                </div>
                <div class="meta-block">
                  <i class="ti ti-clock"></i>
                  <div>
                    <span class="meta-label">Status</span>
                    <span class="meta-value">{{ event.status }}</span>
                  </div>
                </div>
                <div class="meta-block" *ngIf="event.organizerFirstName || event.organizerLastName">
                  <i class="ti ti-user"></i>
                  <div>
                    <span class="meta-label">Organizer</span>
                    <span class="meta-value">{{ event.organizerFirstName }} {{ event.organizerLastName }}</span>
                  </div>
                </div>
                <div class="meta-block">
                  <i class="ti ti-map-pin"></i>
                  <div>
                    <span class="meta-label">Location</span>
                    <span class="meta-value">{{ event.location }}</span>
                  </div>
                </div>
                <div class="meta-block">
                  <i class="ti ti-users"></i>
                  <div>
                    <span class="meta-label">Places Limit</span>
                    <span class="meta-value">{{ event.placesLimit }}</span>
                  </div>
                </div>
              </div>
              <button class="btn-register-hero" (click)="reserveSpot()" [disabled]="reservationStatus === 'loading' || reservationStatus === 'success'">
                {{ reservationStatus === 'loading' ? 'Réservation...' : reservationStatus === 'success' ? '✅ Réservé' : 'Réserver' }}
              </button>
              
              <!-- AI Prediction Badge -->
              <div *ngIf="aiPrediction && !aiPredictionLoading" class="ai-prediction-badge" [ngClass]="getRiskBadgeClass()">
                <i class="ti" [ngClass]="getRiskIcon()"></i>
                <div class="prediction-content">
                  <span class="prediction-title">{{ aiPrediction.result === 'RISQUE_ELEVE' ? 'Risque Élevé' : 'Disponible' }}</span>
                  <span class="prediction-message">{{ getRiskMessage() }}</span>
                  <span class="prediction-reason">{{ aiPrediction.reason }}</span>
                </div>
              </div>

              <!-- Loading state -->
              <div *ngIf="aiPredictionLoading" class="ai-prediction-loading">
                <span class="spinner-border spinner-border-sm"></span>
                <span>Analyse en cours...</span>
              </div>
              
              <!-- Ticket Info after reservation -->
              <div *ngIf="reservationStatus === 'success' && ticketCode" class="ticket-info">
                <div class="ticket-header">
                  <i class="ti ti-ticket"></i>
                  <h3>Votre Ticket</h3>
                </div>
                <div class="ticket-code">
                  <span class="label">Code:</span>
                  <span class="code">{{ ticketCode }}</span>
                </div>
                <!-- QR Code Image -->
                <div class="qr-code-container" *ngIf="reservationId">
                  <img [src]="getQRCodeUrl()" alt="QR Code" class="qr-code-image">
                  <p class="qr-hint">Scannez ce code à l'entrée</p>
                </div>
                <button class="btn-download-ticket" (click)="downloadTicket()">
                  <i class="ti ti-download"></i> Télécharger le PDF
                </button>
              </div>
            </div>
            <div class="hero-image">
              <img [src]="event.photoUrl ? (event.photoUrl.startsWith('http') ? event.photoUrl : backendUrl + event.photoUrl) : ''" [alt]="event.name">
            </div>
          </div>
        </div>
        <div class="container">
          <div class="event-content">
            <div class="content-main">
              <section class="content-section">
                <h2>About This Event</h2>
                <p class="description">{{ event.description }}</p>
                <p>Join us for an exciting event designed to help you improve your English skills. Whether you're a beginner or advanced learner, this event offers valuable opportunities for learning and networking.</p>
              </section>
              <section class="content-section">
                <h2>What You'll Experience</h2>
                <ul class="experience-list">
                  <li><i class="ti ti-microphone"></i> Interactive sessions with expert speakers</li>
                  <li><i class="ti ti-users"></i> Network with fellow English learners</li>
                  <li><i class="ti ti-certificate"></i> Receive a participation certificate</li>
                  <li><i class="ti ti-gift"></i> Access to exclusive learning materials</li>
                </ul>
              </section>
              <section class="content-section">
                <h2>Schedule</h2>
                <div class="schedule-timeline">
                  <div class="schedule-item">
                    <div class="schedule-time">09:00 AM</div>
                    <div class="schedule-content">
                      <h4>Registration & Welcome Coffee</h4>
                      <p>Check-in and networking</p>
                    </div>
                  </div>
                  <div class="schedule-item">
                    <div class="schedule-time">09:30 AM</div>
                    <div class="schedule-content">
                      <h4>Opening Session</h4>
                      <p>Introduction and event overview</p>
                    </div>
                  </div>
                  <div class="schedule-item">
                    <div class="schedule-time">10:00 AM</div>
                    <div class="schedule-content">
                      <h4>Main Program</h4>
                      <p>Interactive workshop and activities</p>
                    </div>
                  </div>
                  <div class="schedule-item">
                    <div class="schedule-time">12:00 PM</div>
                    <div class="schedule-content">
                      <h4>Lunch Break</h4>
                      <p>Networking lunch</p>
                    </div>
                  </div>
                  <div class="schedule-item">
                    <div class="schedule-time">01:00 PM</div>
                    <div class="schedule-content">
                      <h4>Closing Session</h4>
                      <p>Q&A and certificates distribution</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            <div class="content-sidebar">
              <div class="sidebar-card register-card">
                <div class="register-header">
                  <span class="price-free">FREE</span>
                  <span class="event-status">Limited Spots Available</span>
                </div>
                
                <ng-container *ngIf="reservationStatus === 'success'">
                  <div class="success-message">
                    <i class="ti ti-check"></i> Spot Reserved Successfully!
                  </div>
                  <div class="ticket-details" *ngIf="ticketCode">
                    <h4>Your Ticket</h4>
                    <div class="ticket-code-box">
                      <span class="code-label">Code:</span>
                      <span class="code-value">{{ ticketCode }}</span>
                    </div>
                    <!-- QR Code Image -->
                    <div class="qr-code-display" *ngIf="reservationId">
                      <img [src]="getQRCodeUrl()" alt="QR Code" class="qr-image">
                      <p class="qr-text">Scannez à l'entrée</p>
                    </div>
                    <button class="btn-download-pdf" (click)="downloadTicket()">
                      <i class="ti ti-file-download"></i> Download PDF Ticket
                    </button>
                  </div>
                </ng-container>
                <ng-container *ngIf="reservationStatus !== 'success'">
                  <button class="btn-register-full" (click)="reserveSpot()" [disabled]="reservationStatus === 'loading'">
                    {{ reservationStatus === 'loading' ? 'Réservation...' : 'Réserver' }}
                  </button>
                  <p class="error-message" *ngIf="reservationStatus === 'error'">Failed to reserve spot. Please try again.</p>
                </ng-container>
                
                <p class="register-note">No payment required. Secure your spot today!</p>
                <div class="share-section">
                  <span>Share this event:</span>
                  <div class="share-buttons">
                    <button class="share-btn"><i class="ti ti-brand-facebook"></i></button>
                    <button class="share-btn"><i class="ti ti-brand-twitter"></i></button>
                    <button class="share-btn"><i class="ti ti-brand-linkedin"></i></button>
                  </div>
                </div>
              </div>
              <div class="sidebar-card">
                <h3>Event Highlights</h3>
                <ul class="highlights-list">
                  <li><i class="ti ti-clock"></i> 3 hours duration</li>
                  <li><i class="ti ti-users"></i> {{ event.placesLimit }} places limit</li>
                  <li><i class="ti ti-certificate"></i> Certificate included</li>
                  <li><i class="ti ti-mood-smile"></i> All levels welcome</li>
                </ul>
              </div>
            </div>
          </div>
          
          <!-- AI Recommendations Section -->
          <section class="recommendations-section" *ngIf="recommendedEvents.length > 0 || recommendationsLoading">
            <div class="section-header">
              <h2><i class="ti ti-sparkles"></i> Événements Recommandés pour Vous</h2>
              <p>Basé sur vos intérêts et cet événement</p>
            </div>
            
            <div *ngIf="recommendationsLoading" class="recommendations-loading">
              <span class="spinner-border"></span>
              <p>Chargement des recommandations...</p>
            </div>
            
            <div *ngIf="!recommendationsLoading && recommendedEvents.length > 0" class="recommendations-grid">
              <div class="recommendation-card" *ngFor="let recEvent of recommendedEvents">
                <div class="rec-badge">
                  <i class="ti ti-robot"></i>
                  <span>Recommandé par IA</span>
                </div>
                <h3>{{ recEvent.name }}</h3>
                <div class="rec-meta">
                  <span class="rec-category">
                    <i class="ti ti-tag"></i>
                    {{ recEvent.category }}
                  </span>
                  <span class="rec-date">
                    <i class="ti ti-calendar"></i>
                    {{ recEvent.date | date:'shortDate' }}
                  </span>
                </div>
                <p class="rec-description">{{ recEvent.description }}</p>
                <div class="rec-footer">
                  <span class="rec-seats">
                    <i class="ti ti-users"></i>
                    {{ recEvent.availableSeats }} places disponibles
                  </span>
                  <a [routerLink]="['/events', recEvent.id]" class="btn-view-event">
                    Voir l'événement
                    <i class="ti ti-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </ng-container>
    <ng-template #notFound>
      <div class="not-found-page">
        <div class="not-found">
          <div class="container">
            <i class="ti ti-calendar"></i>
            <h2>Event Not Found</h2>
            <p>The event you're looking for doesn't exist.</p>
            <a routerLink="/events" class="btn-back">Browse Events</a>
          </div>
        </div>
      </div>
    </ng-template>
    <app-footer></app-footer>
  `,
  styles: [`
    .client-page { min-height: 100vh; background: var(--color-background); }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    .event-hero { background: linear-gradient(135deg, var(--color-secondary) 0%, #1a3a3a 100%); padding: 60px 0; }
    .event-hero .container { display: grid; grid-template-columns: 1fr 450px; gap: 60px; align-items: center; }
    .breadcrumb { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; font-size: 14px; a { color: rgba(255,255,255,0.8); text-decoration: none; &:hover { color: var(--color-accent); } } span { color: rgba(255,255,255,0.8); } i { font-size: 12px; color: rgba(255,255,255,0.5); } }
    .event-badge { display: inline-block; padding: 8px 18px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-bottom: 16px; &[data-category="Workshop"] { background: #3b82f6; color: #fff; } &[data-category="Competition"] { background: var(--color-cta); color: #fff; } &[data-category="Webinar"] { background: #8b5cf6; color: #fff; } &[data-category="Cultural Event"] { background: #10b981; color: #fff; } }
    .event-title { font-family: var(--font-family); font-size: 38px; font-weight: 800; color: #fff; margin: 0 0 24px; line-height: 1.2; }
    .event-meta { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 32px; }
    .meta-block { display: flex; align-items: flex-start; gap: 12px; i { font-size: 24px; color: var(--color-accent); margin-top: 2px; } div { display: flex; flex-direction: column; } }
    .meta-label { font-size: 12px; color: rgba(255,255,255,0.6); text-transform: uppercase; }
    .meta-value { font-size: 15px; font-weight: 600; color: #fff; }
    .btn-register-hero { padding: 16px 32px; background: var(--color-accent); color: var(--color-primary); border: none; border-radius: 14px; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.3s ease; &:hover:not(:disabled) { transform: scale(1.05); box-shadow: 0 10px 30px rgba(246, 189, 96, 0.4); } &:disabled { opacity: 0.7; cursor: not-allowed; } }
    .ticket-info { margin-top: 24px; padding: 20px; background: rgba(255,255,255,0.1); border-radius: 12px; backdrop-filter: blur(10px); }
    .ticket-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; i { font-size: 24px; color: var(--color-accent); } h3 { margin: 0; color: #fff; font-size: 18px; } }
    .ticket-code { background: rgba(255,255,255,0.15); padding: 12px; border-radius: 8px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; .label { color: rgba(255,255,255,0.7); font-size: 14px; } .code { color: #fff; font-weight: 700; font-size: 16px; font-family: monospace; } }
    .btn-download-ticket { width: 100%; padding: 12px; background: var(--color-accent); color: var(--color-primary); border: none; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.3s ease; &:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(246, 189, 96, 0.4); } }
    .qr-code-container { margin: 16px 0; text-align: center; padding: 16px; background: rgba(255,255,255,0.2); border-radius: 12px; .qr-code-image { width: 200px; height: 200px; border-radius: 8px; background: white; padding: 8px; } .qr-hint { margin-top: 8px; font-size: 13px; color: rgba(255,255,255,0.9); } }
    .hero-image { border-radius: 20px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.3); img { width: 100%; height: 350px; object-fit: cover; } }
    .event-content { display: grid; grid-template-columns: 1fr 340px; gap: 40px; padding: 60px 0; }
    .content-section { background: var(--color-white); border-radius: 20px; padding: 32px; margin-bottom: 24px; box-shadow: var(--shadow-card); h2 { font-size: 24px; font-weight: 700; color: var(--color-primary); margin: 0 0 20px; } p { font-size: 15px; line-height: 1.7; color: var(--color-gray-600); margin: 0 0 16px; &:last-child { margin-bottom: 0; } } }
    .description { font-size: 16px !important; }
    .experience-list { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; li { display: flex; align-items: center; gap: 12px; font-size: 15px; color: var(--color-gray-600); i { font-size: 22px; color: var(--color-secondary); } } }
    .schedule-timeline { display: flex; flex-direction: column; gap: 4px; }
    .schedule-item { display: flex; gap: 20px; padding: 16px; background: var(--color-background); border-radius: 12px; }
    .schedule-time { font-size: 14px; font-weight: 700; color: var(--color-secondary); min-width: 80px; }
    .schedule-content { flex: 1; h4 { font-size: 15px; font-weight: 600; color: var(--color-primary); margin: 0 0 4px; } p { font-size: 13px; color: var(--color-gray-500); margin: 0; } }
    .sidebar-card { background: var(--color-white); border-radius: 20px; padding: 28px; box-shadow: var(--shadow-card); margin-bottom: 24px; h3 { font-size: 18px; font-weight: 700; color: var(--color-primary); margin: 0 0 20px; } }
    .register-card { text-align: center; }
    .register-header { margin-bottom: 20px; }
    .price-free { display: block; font-size: 32px; font-weight: 800; color: #10b981; margin-bottom: 4px; }
    .event-status { font-size: 13px; color: var(--color-cta); font-weight: 600; }
    .btn-register-full { width: 100%; padding: 16px; background: linear-gradient(135deg, var(--color-cta), #e05540); color: #fff; border: none; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.3s ease; margin-bottom: 12px; &:hover:not(:disabled) { transform: scale(1.02); box-shadow: 0 8px 25px rgba(200,70,48,0.35); } &:disabled { opacity: 0.7; cursor: not-allowed; } }
    .success-message { background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 16px; border-radius: 12px; margin-bottom: 12px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; }
    .ticket-details { margin-top: 16px; padding: 16px; background: rgba(246, 189, 96, 0.1); border-radius: 12px; h4 { margin: 0 0 12px; font-size: 16px; color: var(--color-primary); } }
    .ticket-code-box { background: #fff; padding: 12px; border-radius: 8px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; .code-label { font-size: 13px; color: var(--color-gray-500); } .code-value { font-weight: 700; font-family: monospace; color: var(--color-primary); } }
    .btn-download-pdf { width: 100%; padding: 12px; background: var(--color-accent); color: var(--color-primary); border: none; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.3s ease; &:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(246, 189, 96, 0.3); } }
    .qr-code-display { margin: 16px 0; text-align: center; padding: 16px; background: rgba(246, 189, 96, 0.05); border-radius: 12px; .qr-image { width: 180px; height: 180px; border-radius: 8px; background: white; padding: 8px; border: 2px solid var(--color-accent); } .qr-text { margin-top: 8px; font-size: 12px; color: var(--color-gray-500); } }
    .error-message { color: var(--color-cta); font-size: 13px; margin: 0 0 12px; }
    .register-note { font-size: 13px; color: var(--color-gray-500); margin: 0 0 20px; }
    .share-section { border-top: 1px solid rgba(61,61,96,0.08); padding-top: 20px; span { display: block; font-size: 13px; color: var(--color-gray-500); margin-bottom: 12px; } }
    .share-buttons { display: flex; gap: 10px; justify-content: center; }
    .share-btn { width: 40px; height: 40px; border-radius: 10px; border: 1px solid rgba(61,61,96,0.1); background: var(--color-background); cursor: pointer; transition: all 0.2s ease; &:hover { background: var(--color-primary); color: #fff; border-color: var(--color-primary); } }
    .highlights-list { list-style: none; padding: 0; margin: 0; li { display: flex; align-items: center; gap: 12px; padding: 10px 0; font-size: 14px; color: var(--color-gray-600); border-bottom: 1px solid rgba(61,61,96,0.06); &:last-child { border-bottom: none; } i { font-size: 20px; color: var(--color-secondary); } } }
    .not-found-page { min-height: 100vh; background: var(--color-background); }
    .not-found { text-align: center; padding: 100px 20px; i { font-size: 80px; color: var(--color-gray-300); margin-bottom: 24px; } h2 { font-size: 28px; color: var(--color-primary); margin: 0 0 12px; } p { color: var(--color-gray-500); margin: 0 0 24px; } }
    .btn-back { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: var(--color-primary); color: #fff; border-radius: 12px; text-decoration: none; font-weight: 600; }
    
    // AI Prediction Badge
    .ai-prediction-badge { margin-top: 24px; padding: 20px; border-radius: 16px; display: flex; align-items: flex-start; gap: 16px; backdrop-filter: blur(10px); animation: slideIn 0.5s ease; i { font-size: 32px; margin-top: 4px; } &.risk-high { background: rgba(239, 68, 68, 0.15); border: 2px solid rgba(239, 68, 68, 0.3); i { color: #ef4444; } .prediction-title { color: #ef4444; } } &.risk-low { background: rgba(16, 185, 129, 0.15); border: 2px solid rgba(16, 185, 129, 0.3); i { color: #10b981; } .prediction-title { color: #10b981; } } }
    .prediction-content { flex: 1; display: flex; flex-direction: column; gap: 4px; }
    .prediction-title { font-size: 18px; font-weight: 700; }
    .prediction-message { font-size: 15px; color: rgba(255, 255, 255, 0.9); font-weight: 600; }
    .prediction-reason { font-size: 13px; color: rgba(255, 255, 255, 0.7); font-style: italic; }
    .ai-prediction-loading { margin-top: 24px; padding: 16px; background: rgba(255, 255, 255, 0.1); border-radius: 12px; display: flex; align-items: center; gap: 12px; color: rgba(255, 255, 255, 0.8); font-size: 14px; }
    
    // Recommendations Section
    .recommendations-section { margin-top: 60px; padding: 40px 0; border-top: 2px solid rgba(61, 61, 96, 0.08); }
    .section-header { text-align: center; margin-bottom: 40px; h2 { font-size: 32px; font-weight: 800; color: var(--color-primary); margin: 0 0 8px; display: flex; align-items: center; justify-content: center; gap: 12px; i { color: var(--color-accent); font-size: 36px; } } p { font-size: 16px; color: var(--color-gray-500); margin: 0; } }
    .recommendations-loading { text-align: center; padding: 60px 20px; .spinner-border { width: 3rem; height: 3rem; color: var(--color-accent); margin-bottom: 16px; } p { color: var(--color-gray-500); font-size: 15px; } }
    .recommendations-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
    .recommendation-card { background: var(--color-white); border-radius: 20px; padding: 24px; box-shadow: var(--shadow-card); transition: all 0.3s ease; position: relative; overflow: hidden; &:hover { transform: translateY(-8px); box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12); } &::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, var(--color-accent), var(--color-cta)); } }
    .rec-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: linear-gradient(135deg, rgba(246, 189, 96, 0.15), rgba(200, 70, 48, 0.15)); border-radius: 20px; font-size: 12px; font-weight: 600; color: var(--color-accent); margin-bottom: 16px; i { font-size: 14px; } }
    .recommendation-card h3 { font-size: 18px; font-weight: 700; color: var(--color-primary); margin: 0 0 12px; line-height: 1.3; }
    .rec-meta { display: flex; gap: 16px; margin-bottom: 12px; span { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--color-gray-500); i { font-size: 16px; color: var(--color-secondary); } } }
    .rec-category { font-weight: 600; }
    .rec-description { font-size: 14px; line-height: 1.6; color: var(--color-gray-600); margin: 0 0 16px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .rec-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid rgba(61, 61, 96, 0.08); }
    .rec-seats { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #10b981; font-weight: 600; i { font-size: 16px; } }
    .btn-view-event { display: flex; align-items: center; gap: 6px; padding: 8px 16px; background: var(--color-primary); color: #fff; border-radius: 10px; text-decoration: none; font-size: 13px; font-weight: 600; transition: all 0.3s ease; &:hover { background: var(--color-secondary); transform: translateX(4px); } i { font-size: 14px; } }
    
    @keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    
    @media (max-width: 992px) { .event-hero .container { grid-template-columns: 1fr; } .hero-image { display: none; } .event-content { grid-template-columns: 1fr; } .experience-list { grid-template-columns: 1fr; } .recommendations-grid { grid-template-columns: 1fr; } }
  `]
})
export class ClientEventDetailsComponent implements OnInit {
  private eventService = inject(EventService);
  private reservationService = inject(ReservationService);
  private aiService = inject(AIService);
  private route = inject(ActivatedRoute);
  backendUrl = environment.apiBase.replace(/\/?api$/, '');
  event: Event | undefined;
  reservationStatus: 'idle' | 'loading' | 'success' | 'error' = 'idle';
  reservationId: number | null = null;
  ticketCode: string | null = null;
  
  // AI Features
  aiPrediction: PredictionResponse | null = null;
  aiPredictionLoading: boolean = false;
  recommendedEvents: RecommendedEvent[] = [];
  recommendationsLoading: boolean = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.eventService.getById(+id).subscribe({
        next: (event) => {
          this.event = event;
          // Charger automatiquement la prédiction et les recommandations
          this.loadAIPrediction();
          this.loadAIRecommendations();
        },
        error: () => { this.event = undefined; }
      });
    }
  }

  /**
   * Charge la prédiction IA pour cet événement
   */
  loadAIPrediction(): void {
    if (!this.event) return;
    
    this.aiPredictionLoading = true;
    const availableSeats = this.event.placesLimit - (this.event.reservedPlaces || 0);
    
    console.log('🤖 Loading AI Prediction for event:', this.event.name);
    console.log('📊 Data:', {
      likes: 0,
      reservations: this.event.reservedPlaces || 0,
      placesRestantes: availableSeats
    });
    
    this.aiService.predictEventCompletion({
      likes: 0, // TODO: Ajouter le compteur de likes si disponible
      reservations: this.event.reservedPlaces || 0,
      placesRestantes: availableSeats
    }).subscribe({
      next: (prediction) => {
        console.log('✅ AI Prediction received:', prediction);
        this.aiPrediction = prediction;
        this.aiPredictionLoading = false;
      },
      error: (err) => {
        console.error('❌ AI Prediction error:', err);
        console.error('Error details:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          url: err.url
        });
        this.aiPredictionLoading = false;
      }
    });
  }

  /**
   * Charge les recommandations IA basées sur la catégorie de l'événement
   */
  loadAIRecommendations(): void {
    if (!this.event) return;
    
    this.recommendationsLoading = true;
    
    console.log('🤖 Loading AI Recommendations for category:', this.event.category);
    
    this.aiService.recommendEvents({
      categoriesLiked: [this.event.category]
    }).subscribe({
      next: (events) => {
        console.log('✅ AI Recommendations received:', events);
        // Filtrer l'événement actuel des recommandations
        this.recommendedEvents = events.filter(e => e.id !== this.event?.id).slice(0, 3);
        console.log('📋 Filtered recommendations:', this.recommendedEvents);
        this.recommendationsLoading = false;
      },
      error: (err) => {
        console.error('❌ AI Recommendations error:', err);
        console.error('Error details:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          url: err.url
        });
        this.recommendationsLoading = false;
      }
    });
  }

  /**
   * Retourne la classe CSS pour le badge de risque
   */
  getRiskBadgeClass(): string {
    if (!this.aiPrediction) return '';
    return this.aiPrediction.result === 'RISQUE_ELEVE' ? 'risk-high' : 'risk-low';
  }

  /**
   * Retourne l'icône pour le badge de risque
   */
  getRiskIcon(): string {
    if (!this.aiPrediction) return '';
    return this.aiPrediction.result === 'RISQUE_ELEVE' ? 'ti-alert-triangle' : 'ti-check-circle';
  }

  /**
   * Retourne le message de risque
   */
  getRiskMessage(): string {
    if (!this.aiPrediction) return '';
    return this.aiPrediction.result === 'RISQUE_ELEVE' 
      ? '⚠️ Attention ! Cet événement risque d\'être complet bientôt.'
      : '✅ Peu de risque que cet événement soit complet.';
  }

  reserveSpot(): void {
    if (!this.event) return;
    this.reservationStatus = 'loading';
    
    // Utiliser un ID de participant fixe (1) pour les tests
    // En production, ceci devrait venir de l'authentification de l'utilisateur
    const request: ReservationRequest = {
      eventId: this.event.id,
      participantId: 1  // ID du premier participant dans la base
    };

    console.log('✅ Attempting reservation:', request);

    this.reservationService.createReservation(request).subscribe({
      next: (response) => {
        console.log('✅ Reservation successful:', response);
        this.reservationStatus = 'success';
        this.reservationId = response.id;
        this.ticketCode = response.ticketCode;
      },
      error: (err) => {
        console.error('❌ Reservation error:', err);
        
        // Extract the actual error message from backend
        let errorMessage = 'Failed to reserve spot. Please try again.';
        
        if (typeof err.error === 'string') {
          // Backend returns plain string error message
          errorMessage = err.error;
        } else if (err.error?.message) {
          // Backend returns JSON with message property
          errorMessage = err.error.message;
        } else if (err.message) {
          // HTTP error message
          errorMessage = err.message;
        }
        
        console.error('📋 Backend error message:', errorMessage);
        console.error('📊 Full error details:', {
          status: err.status,
          statusText: err.statusText,
          message: errorMessage,
          fullError: err.error
        });
        
        this.reservationStatus = 'error';
        
        // Show error message to user
        alert('❌ Erreur de réservation:\n\n' + errorMessage);
      }
    });
  }

  downloadTicket(): void {
    if (this.reservationId) {
      this.reservationService.downloadTicket(this.reservationId);
    }
  }

  getQRCodeUrl(): string {
    if (this.reservationId) {
      return `${environment.apiBase}/reservations/${this.reservationId}/qrcode`;
    }
    return '';
  }
}
