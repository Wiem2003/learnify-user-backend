import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Event } from '../../../models/event.model';
import { EventService } from '../../../services/event.service';
import { EventLikeService } from '../../../services/event-like.service';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-client-events-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="client-page">
      <div class="page-hero">
        <div class="container">
          <h1 class="hero-title">Upcoming <span class="highlight">Events</span></h1>
          <p class="hero-subtitle">Join workshops, competitions, and webinars to enhance your English skills</p>
        </div>
      </div>
      <div class="container">
        <div class="filters-bar">
          <div class="search-box">
            <i class="ti ti-search"></i>
            <input type="text" placeholder="Search events..." [(ngModel)]="searchTerm" (input)="filterEvents()">
          </div>
          <div class="filter-group">
            <select [(ngModel)]="selectedCategory" (change)="filterEvents()" class="filter-select">
              <option value="">All Categories</option>
              <option *ngFor="let cat of categories" [value]="cat">{{ cat }}</option>
            </select>
          </div>
        </div>
        <div class="events-grid">
          <div *ngFor="let event of filteredEvents">
            <div class="event-card">
              <div class="card-image">
                <img [src]="event.photoUrl ? (event.photoUrl.startsWith('http') ? event.photoUrl : backendUrl + event.photoUrl) : ''" [alt]="event.name">
                <div class="card-date">
                  <span class="date-day">{{ event.date | date:'d' }}</span>
                  <span class="date-month">{{ event.date | date:'MMM' }}</span>
                </div>
                <div class="card-badge" [attr.data-category]="event.category">{{ event.category }}</div>
                <button class="like-btn" 
                        [class.liked]="likedStatus[event.id]"
                        (click)="toggleLike(event.id, $event)"
                        title="{{ likedStatus[event.id] ? 'Unlike' : 'Like' }}">
                  <i class="ti" [class.ti-heart-filled]="likedStatus[event.id]" [class.ti-heart]="!likedStatus[event.id]"></i>
                  <span class="like-count">{{ likesCount[event.id] || 0 }}</span>
                </button>
              </div>
              <div class="card-content">
                <h3 class="card-title"><a [routerLink]="['/events', event.id]">{{ event.name }}</a></h3>
                <p class="card-description">{{ event.description }}</p>
                <div class="card-meta">
                  <span class="meta-item"><i class="ti ti-activity"></i> {{ event.status }}</span>
                  <span class="meta-item" *ngIf="event.organizerFirstName || event.organizerLastName">
                    <i class="ti ti-user"></i> {{ event.organizerFirstName }} {{ event.organizerLastName }}
                  </span>
                  <span class="meta-item"><i class="ti ti-map-pin"></i> {{ event.location }}</span>
                  <span class="meta-item"><i class="ti ti-users"></i> {{ event.placesLimit }} spots</span>
                </div>
                <div class="card-footer">
                  <a [routerLink]="['/events', event.id]" class="btn-register">Réserver</a>
                </div>
              </div>
            </div>
          </div>
          <div *ngIf="filteredEvents.length === 0" class="no-results">
            <i class="ti ti-calendar"></i>
            <h3>No events found</h3>
            <p>Check back later for upcoming events</p>
          </div>
        </div>
      </div>
    </div>
    <app-footer></app-footer>
  `,
  styles: [`
    .client-page { min-height: 100vh; background: var(--color-background); }
    .page-hero { background: linear-gradient(135deg, var(--color-secondary) 0%, #1a3a3a 100%); padding: 80px 0 60px; text-align: center; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    .hero-title { font-family: var(--font-family); font-size: 48px; font-weight: 800; color: #fff; margin: 0 0 16px; }
    .highlight { color: var(--color-accent); }
    .hero-subtitle { font-size: 18px; color: rgba(255, 255, 255, 0.85); margin: 0; }
    .filters-bar { display: flex; gap: 20px; justify-content: space-between; align-items: center; padding: 24px; background: var(--color-white); border-radius: 20px; margin: -40px auto 40px; position: relative; z-index: 10; box-shadow: var(--shadow-card); }
    .search-box { display: flex; align-items: center; gap: 12px; flex: 1; max-width: 400px; background: var(--color-background); border-radius: 12px; padding: 12px 16px; i { color: var(--color-gray-400); } input { border: none; background: none; outline: none; font-size: 14px; width: 100%; font-family: var(--font-family); } }
    .filter-group { display: flex; gap: 12px; }
    .filter-select { padding: 12px 16px; border-radius: 12px; border: 1px solid rgba(61, 61, 96, 0.1); background: var(--color-background); font-size: 14px; font-family: var(--font-family); cursor: pointer; &:focus { outline: 2px solid var(--color-accent); } }
    .events-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 28px; padding-bottom: 60px; }
    .event-card { background: var(--color-white); border-radius: 20px; overflow: hidden; box-shadow: var(--shadow-card); transition: all 0.3s ease; &:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(61, 61, 96, 0.15); } }
    .card-image { position: relative; height: 200px; overflow: hidden; img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; } &:hover img { transform: scale(1.05); } }
    .card-date { position: absolute; top: 16px; left: 16px; background: var(--color-white); border-radius: 12px; padding: 10px 14px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .date-day { display: block; font-size: 24px; font-weight: 800; color: var(--color-primary); line-height: 1; }
    .date-month { display: block; font-size: 12px; font-weight: 600; color: var(--color-secondary); text-transform: uppercase; }
    .card-badge { position: absolute; top: 16px; right: 16px; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; &[data-category="Workshop"] { background: #3b82f6; color: #fff; } &[data-category="Competition"] { background: var(--color-cta); color: #fff; } &[data-category="Webinar"] { background: #8b5cf6; color: #fff; } &[data-category="Cultural Event"] { background: #10b981; color: #fff; } }
    .like-btn { position: absolute; bottom: 16px; right: 16px; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border: none; border-radius: 20px; padding: 8px 14px; display: flex; align-items: center; gap: 6px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.1); i { font-size: 18px; color: var(--color-gray-400); transition: all 0.3s ease; } .like-count { font-size: 13px; font-weight: 600; color: var(--color-primary); } &:hover { transform: scale(1.05); box-shadow: 0 6px 16px rgba(0,0,0,0.15); } &.liked { background: rgba(239, 68, 68, 0.1); i { color: #ef4444; } } }
    .card-content { padding: 24px; }
    .card-title { font-size: 20px; font-weight: 700; color: var(--color-primary); margin: 0 0 12px; line-height: 1.4; a { color: inherit; text-decoration: none; &:hover { color: var(--color-accent); } } }
    .card-description { font-size: 14px; color: var(--color-gray-500); line-height: 1.6; margin: 0 0 16px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .card-meta { display: flex; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
    .meta-item { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--color-gray-500); i { font-size: 16px; color: var(--color-secondary); } }
    .card-footer { padding-top: 16px; border-top: 1px solid rgba(61, 61, 96, 0.08); }
    .btn-register { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: linear-gradient(135deg, var(--color-secondary), #1a3a3a); color: #fff; border-radius: 12px; font-size: 14px; font-weight: 600; text-decoration: none; transition: all 0.3s ease; &:hover { transform: scale(1.05); box-shadow: 0 8px 20px rgba(45, 87, 87, 0.3); } }
    .no-results { grid-column: 1 / -1; text-align: center; padding: 80px 20px; i { font-size: 64px; color: var(--color-gray-300); margin-bottom: 24px; } h3 { font-size: 24px; color: var(--color-primary); margin: 0 0 12px; } p { color: var(--color-gray-500); } }
    @media (max-width: 768px) { .filters-bar { flex-direction: column; .search-box { max-width: 100%; } .filter-group { width: 100%; select { flex: 1; } } } .events-grid { grid-template-columns: 1fr; } }
  `]
})
export class ClientEventsListComponent implements OnInit {
  private eventService = inject(EventService);
  private likeService = inject(EventLikeService);
  backendUrl = environment.apiBase.replace(/\/?api$/, '');
  events: Event[] = [];
  filteredEvents: Event[] = [];
  searchTerm = '';
  selectedCategory = '';
  categories: string[] = [];
  likesCount: { [eventId: number]: number } = {};
  likedStatus: { [eventId: number]: boolean } = {};
  participantId = 1; // TODO: Get from auth service

  ngOnInit(): void {
    this.eventService.getAll().subscribe({
      next: (events) => {
        this.events = events ?? [];
        this.filteredEvents = [...this.events];
        console.log('Events loaded:', this.events.length);
        // Load likes for each event
        this.events.forEach(event => {
          this.loadLikesForEvent(event.id);
        });
      },
      error: () => { this.events = []; this.filteredEvents = []; }
    });
    this.eventService.getCategories().subscribe(cat => this.categories = cat);
  }

  loadLikesForEvent(eventId: number): void {
    this.likeService.getLikesCount(eventId).subscribe({
      next: (count) => {
        this.likesCount[eventId] = count;
        console.log(`Event ${eventId} likes:`, count);
      },
      error: (err) => {
        console.error(`Error loading likes for event ${eventId}:`, err);
        this.likesCount[eventId] = 0;
      }
    });
    this.likeService.isLiked(eventId, this.participantId).subscribe({
      next: (status) => {
        this.likedStatus[eventId] = status;
        console.log(`Event ${eventId} liked status:`, status);
      },
      error: (err) => {
        console.error(`Error loading like status for event ${eventId}:`, err);
        this.likedStatus[eventId] = false;
      }
    });
  }

  toggleLike(eventId: number, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    const isLiked = this.likedStatus[eventId];
    const action$ = isLiked 
      ? this.likeService.unlikeEvent(eventId, this.participantId)
      : this.likeService.likeEvent(eventId, this.participantId);

    action$.subscribe({
      next: () => {
        this.likedStatus[eventId] = !isLiked;
        this.likesCount[eventId] = (this.likesCount[eventId] || 0) + (isLiked ? -1 : 1);
      },
      error: (err) => console.error('Error toggling like:', err)
    });
  }

  filterEvents(): void {
    this.filteredEvents = this.events.filter(event => {
      const matchesSearch = event.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = !this.selectedCategory || event.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }
}
