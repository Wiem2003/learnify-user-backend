import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClubService } from '../../../services/club.service';
import { ClubRequest } from '../../../models/club.model';

@Component({
  selector: 'app-club-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="crud-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Club Join Requests</h1>
          <p class="page-subtitle">Manage membership requests</p>
        </div>
        <div class="header-actions">
          <select [(ngModel)]="filter" (change)="applyFilter()" class="filter-select">
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      <div *ngIf="loading" class="text-center py-5">
        <div class="spinner-border text-primary"></div>
      </div>

      <div class="table-container" *ngIf="!loading">
        <table class="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Club</th>
              <th>Level</th>
              <th>Requested At</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let req of filtered">
              <td>{{ req.userEmail }}</td>
              <td>{{ req.club?.name }}</td>
              <td><span class="badge-level">{{ req.userLevel }}</span></td>
              <td>{{ req.requestedAt | date:'dd/MM/yyyy HH:mm' }}</td>
              <td>
                <span class="status-badge" [ngClass]="req.status.toLowerCase()">
                  {{ req.status }}
                </span>
              </td>
              <td>
                <div class="action-buttons" *ngIf="req.status === 'PENDING'">
                  <button class="btn-action accept" (click)="accept(req)" title="Accept">
                    <i class="bi bi-check-lg"></i>
                  </button>
                  <button class="btn-action reject" (click)="openReject(req)" title="Reject">
                    <i class="bi bi-x-lg"></i>
                  </button>
                </div>
                <span *ngIf="req.status !== 'PENDING'" class="text-muted small">—</span>
              </td>
            </tr>
            <tr *ngIf="filtered.length === 0">
              <td colspan="6" class="empty-state">No requests found</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Reject modal -->
      <div class="modal-overlay" *ngIf="showRejectModal" (click)="cancelReject()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Reject Request</h3>
            <button class="modal-close" (click)="cancelReject()"><i class="bi bi-x"></i></button>
          </div>
          <div class="modal-body">
            <label class="form-label">Reason (optional)</label>
            <textarea class="form-control" rows="3" [(ngModel)]="rejectReason"
              placeholder="e.g. Insufficient level, club full..."></textarea>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="cancelReject()">Cancel</button>
            <button class="btn btn-danger" (click)="confirmReject()">Reject</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .crud-page { animation: fadeIn 0.3s ease; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
    .page-title { font-size: 28px; font-weight: 700; color: var(--color-primary); margin: 0; }
    .page-subtitle { font-size: 15px; color: var(--color-gray-500); margin: 6px 0 0; }
    .filter-select { padding: 10px 16px; border: 2px solid rgba(61,61,96,0.1); border-radius: 12px; font-size: 14px; }
    .table-container { background: var(--color-white); border-radius: 20px; box-shadow: var(--shadow-card); overflow: hidden; }
    .data-table { width: 100%; border-collapse: collapse; th, td { padding: 16px 20px; text-align: left; } th { background: rgba(61,61,96,0.03); font-size: 12px; font-weight: 600; text-transform: uppercase; color: var(--color-gray-500); } td { border-bottom: 1px solid rgba(61,61,96,0.06); font-size: 14px; } }
    .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; &.pending { background: rgba(246,189,96,0.2); color: #b8860b; } &.accepted { background: rgba(16,185,129,0.1); color: #10b981; } &.rejected { background: rgba(200,70,48,0.1); color: #c84630; } }
    .badge-level { background: rgba(59,130,246,0.1); color: #3b82f6; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .action-buttons { display: flex; gap: 8px; }
    .btn-action { width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; border-radius: 8px; border: none; cursor: pointer; &.accept { background: rgba(16,185,129,0.1); color: #10b981; } &.reject { background: rgba(200,70,48,0.1); color: #c84630; } }
    .empty-state { text-align: center; padding: 40px !important; color: var(--color-gray-400); }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000; }
    .modal-content { background: #fff; border-radius: 20px; width: 100%; max-width: 440px; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid rgba(61,61,96,0.08); h3 { margin: 0; font-size: 18px; font-weight: 700; } }
    .modal-close { border: none; background: rgba(61,61,96,0.06); border-radius: 8px; width: 32px; height: 32px; cursor: pointer; }
    .modal-body { padding: 24px; }
    .modal-footer { display: flex; gap: 12px; justify-content: flex-end; padding: 16px 24px; border-top: 1px solid rgba(61,61,96,0.08); }
    .form-control { width: 100%; padding: 10px 14px; border: 2px solid rgba(61,61,96,0.1); border-radius: 10px; font-size: 14px; }
    .form-label { font-size: 14px; font-weight: 600; margin-bottom: 8px; display: block; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class ClubRequestsComponent implements OnInit {
  private clubService = inject(ClubService);

  requests: ClubRequest[] = [];
  filtered: ClubRequest[] = [];
  filter = 'ALL';
  loading = false;
  showRejectModal = false;
  rejectReason = '';
  selectedRequest: ClubRequest | null = null;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.clubService.getAllRequests().subscribe({
      next: (reqs) => { this.requests = reqs; this.applyFilter(); this.loading = false; },
      error: () => this.loading = false
    });
  }

  applyFilter(): void {
    this.filtered = this.filter === 'ALL'
      ? this.requests
      : this.requests.filter(r => r.status === this.filter);
  }

  accept(req: ClubRequest): void {
    this.clubService.acceptRequest(req.id).subscribe({
      next: () => this.load(),
      error: (err) => alert(err.error?.error || 'Failed to accept')
    });
  }

  openReject(req: ClubRequest): void {
    this.selectedRequest = req;
    this.rejectReason = '';
    this.showRejectModal = true;
  }

  cancelReject(): void {
    this.showRejectModal = false;
    this.selectedRequest = null;
  }

  confirmReject(): void {
    if (!this.selectedRequest) return;
    this.clubService.rejectRequest(this.selectedRequest.id, this.rejectReason).subscribe({
      next: () => { this.cancelReject(); this.load(); },
      error: (err) => alert(err.error?.error || 'Failed to reject')
    });
  }
}
