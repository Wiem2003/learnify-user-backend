import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Event } from '../../../models/event.model';
import { EventService } from '../../../services/event.service';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { FooterComponent } from '../../../components/footer/footer.component';

@Component({
  selector: 'app-client-event-details',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    @if (event) {
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
              <h1 class="event-title">{{ event.title }}</h1>
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
                    <span class="meta-label">Time</span>
                    <span class="meta-value">{{ event.time }}</span>
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
                    <span class="meta-label">Spots Left</span>
                    <span class="meta-value">{{ event.maxParticipants }} participants</span>
                  </div>
                </div>
              </div>
              <button class="btn-register-hero">Register for Event</button>
            </div>
            <div class="hero-image">
              <img [src]="event.image" [alt]="event.title">
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
                <button class="btn-register-full">Register Now</button>
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
                  <li><i class="ti ti-users"></i> {{ event.maxParticipants }} max participants</li>
                  <li><i class="ti ti-certificate"></i> Certificate included</li>
                  <li><i class="ti ti-mood-smile"></i> All levels welcome</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    } @else {
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
    }
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
    .btn-register-hero { padding: 16px 32px; background: var(--color-accent); color: var(--color-primary); border: none; border-radius: 14px; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.3s ease; &:hover { transform: scale(1.05); box-shadow: 0 10px 30px rgba(246, 189, 96, 0.4); } }
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
    .btn-register-full { width: 100%; padding: 16px; background: linear-gradient(135deg, var(--color-cta), #e05540); color: #fff; border: none; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.3s ease; margin-bottom: 12px; &:hover { transform: scale(1.02); box-shadow: 0 8px 25px rgba(200,70,48,0.35); } }
    .register-note { font-size: 13px; color: var(--color-gray-500); margin: 0 0 20px; }
    .share-section { border-top: 1px solid rgba(61,61,96,0.08); padding-top: 20px; span { display: block; font-size: 13px; color: var(--color-gray-500); margin-bottom: 12px; } }
    .share-buttons { display: flex; gap: 10px; justify-content: center; }
    .share-btn { width: 40px; height: 40px; border-radius: 10px; border: 1px solid rgba(61,61,96,0.1); background: var(--color-background); cursor: pointer; transition: all 0.2s ease; &:hover { background: var(--color-primary); color: #fff; border-color: var(--color-primary); } }
    .highlights-list { list-style: none; padding: 0; margin: 0; li { display: flex; align-items: center; gap: 12px; padding: 10px 0; font-size: 14px; color: var(--color-gray-600); border-bottom: 1px solid rgba(61,61,96,0.06); &:last-child { border-bottom: none; } i { font-size: 20px; color: var(--color-secondary); } } }
    .not-found-page { min-height: 100vh; background: var(--color-background); }
    .not-found { text-align: center; padding: 100px 20px; i { font-size: 80px; color: var(--color-gray-300); margin-bottom: 24px; } h2 { font-size: 28px; color: var(--color-primary); margin: 0 0 12px; } p { color: var(--color-gray-500); margin: 0 0 24px; } }
    .btn-back { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: var(--color-primary); color: #fff; border-radius: 12px; text-decoration: none; font-weight: 600; }
    @media (max-width: 992px) { .event-hero .container { grid-template-columns: 1fr; } .hero-image { display: none; } .event-content { grid-template-columns: 1fr; } .experience-list { grid-template-columns: 1fr; } }
  `]
})
export class ClientEventDetailsComponent implements OnInit {
  private eventService = inject(EventService);
  private route = inject(ActivatedRoute);
  event: Event | undefined;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.eventService.getById(+id).subscribe({
        next: (event) => this.event = event,
        error: () => { this.event = undefined; }
      });
    }
  }
}
