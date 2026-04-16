import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClubService } from '../../services/club.service';
import { AdminManagementService } from '../../services/admin-management.service';
import { Club, ClubRequest } from '../../models/club.model';

@Component({
  selector: 'app-clubs',
  templateUrl: './clubs.component.html',
  styleUrl: './clubs.component.scss',
  standalone: false,
})
export class ClubsComponent implements OnInit {
  clubs: Club[] = [];
  myRequests: ClubRequest[] = [];
  loading = false;
  error = '';
  private currentUserId: number | null = null;
  private currentUserEmail = '';
  private currentUserLevel = 'A1';

  constructor(
    private clubService: ClubService,
    private userService: AdminManagementService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClubs();
    // Load current user profile to get id, email and preevaluation level
    this.userService.getMe().subscribe({
      next: (user) => {
        this.currentUserId = user.id;
        this.currentUserEmail = user.email;
        this.currentUserLevel = user.preevaluationFinalLevel || 'A1';
        this.loadMyRequests();
      },
      error: () => {}
    });
  }

  loadClubs(): void {
    this.loading = true;
    this.clubService.getAll().subscribe({
      next: (clubs) => { this.clubs = clubs; this.loading = false; },
      error: () => { this.error = 'Failed to load clubs'; this.loading = false; }
    });
  }

  loadMyRequests(): void {
    if (!this.currentUserId) return;
    this.clubService.getMyRequests(this.currentUserId).subscribe({
      next: (reqs) => this.myRequests = reqs,
      error: () => {}
    });
  }

  getRequestStatus(clubId: number): string | null {
    const req = this.myRequests.find(r => r.club?.id === clubId);
    return req ? req.status : null;
  }

  requestJoin(club: Club): void {
    if (!this.currentUserId) { this.router.navigate(['/auth/login']); return; }

    this.clubService.requestJoin(club.id, {
      userId: this.currentUserId,
      userEmail: this.currentUserEmail,
      userLevel: this.currentUserLevel
    }).subscribe({
      next: () => this.loadMyRequests(),
      error: (err) => alert(err.error?.error || 'Request failed')
    });
  }

  openChat(club: Club): void {
    this.router.navigate(['/clubs', club.id, 'chat']);
  }

  isFull(club: Club): boolean {
    const members = club.currentMembers ?? 0;
    const cap = club.capacity ?? club.maxMembers ?? 0;
    return cap > 0 && members >= cap;
  }
}
