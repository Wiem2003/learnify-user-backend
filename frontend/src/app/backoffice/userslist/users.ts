import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../../services/user';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})
export class UsersComponent implements OnInit {

  // =========================
  // (1) USER LIST DISPLAY
  // =========================
  users: User[] = [];
  loading = false;

  // Search text
  q = '';

  // =========================
  // (2) AVATAR / IMAGE DISPLAY
  // =========================
  private readonly API_BASE = 'http://localhost:8080'; // backend base URL

  // =========================
  // (3) PAGINATION (5 per page)
  // =========================
  pageSize = 5;
  page = 1;

  // =========================
  // (4) SORTING (by id / name / email)
  // =========================
  sortField: 'id' | 'name' | 'email' = 'id';
  sortDir: 'asc' | 'desc' = 'asc';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.reload();
  }

  // =========================
  // (4) SORTING - change sort field / toggle direction
  // =========================
  setSort(field: 'id' | 'name' | 'email') {
    // if same field -> toggle direction
    if (this.sortField === field) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
      return;
    }

    // new field -> set asc by default
    this.sortField = field;
    this.sortDir = 'asc';
  }

  // =========================
  // (1) USER LIST DISPLAY + SEARCH FILTER + (4) SORTING
  // =========================
  get filteredUsers(): User[] {
    const s = this.q.trim().toLowerCase();

    // (1) filter
    let data = this.users.filter(u =>
      !s ||
      `${u.firstName ?? ''} ${u.lastName ?? ''}`.toLowerCase().includes(s) ||
      (u.email ?? '').toLowerCase().includes(s)
    );

    // (4) sort
    data = [...data].sort((a, b) => {
      let v1: any;
      let v2: any;

      if (this.sortField === 'id') {
        v1 = a.id;
        v2 = b.id;
      } else if (this.sortField === 'email') {
        v1 = (a.email ?? '').toLowerCase();
        v2 = (b.email ?? '').toLowerCase();
      } else {
        // name
        v1 = `${a.firstName ?? ''} ${a.lastName ?? ''}`.toLowerCase();
        v2 = `${b.firstName ?? ''} ${b.lastName ?? ''}`.toLowerCase();
      }

      if (v1 < v2) return this.sortDir === 'asc' ? -1 : 1;
      if (v1 > v2) return this.sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return data;
  }

  // =========================
  // (3) PAGINATION - current page items only
  // =========================
  get pagedUsers(): User[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  // =========================
  // (3) PAGINATION - total pages
  // =========================
  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredUsers.length / this.pageSize));
  }

  // =========================
  // (3) PAGINATION - controls
  // =========================
  setPage(p: number) {
    if (p < 1) p = 1;
    if (p > this.totalPages) p = this.totalPages;
    this.page = p;
  }

  prevPage() { this.setPage(this.page - 1); }
  nextPage() { this.setPage(this.page + 1); }

  // Optional helper for "Showing X-Y of Z"
  get fromIndex(): number {
    if (this.filteredUsers.length === 0) return 0;
    return (this.page - 1) * this.pageSize + 1;
  }

  get toIndex(): number {
    return Math.min(this.page * this.pageSize, this.filteredUsers.length);
  }

  // =========================
  // (2) AVATAR / IMAGE DISPLAY - build correct image URL
  // =========================
  getAvatar(u: User): string | null {
    if (!u.avatarUrl) return null;

    // already absolute
    if (u.avatarUrl.startsWith('http')) return u.avatarUrl;

    // relative path coming from backend (example: "/uploads/avatars/1.png")
    return this.API_BASE + u.avatarUrl;
  }

  // =========================
  // (2) AVATAR / IMAGE DISPLAY - if image fails => show placeholder
  // =========================
  onAvatarError(u: User) {
    u.avatarUrl = undefined; // triggers placeholder
  }

  // =========================
  // (1) USER LIST DISPLAY - load users from backend
  // =========================
  reload() {
    this.loading = true;

    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data ?? [];

        // (3) PAGINATION - reset to first page after reload
        this.page = 1;

        // (4) SORTING - optional: reset sort on reload (keep if you want)
        // this.sortField = 'id';
        // this.sortDir = 'asc';

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.users = [];

        // (3) PAGINATION - reset
        this.page = 1;

        this.loading = false;
      }
    });
  }

  // =========================
  // (1) USER LIST DISPLAY - delete user
  // =========================
  delete(u: User) {
    if (!confirm(`Delete ${u.email}?`)) return;

    this.userService.deleteUser(u.id).subscribe({
      next: () => {
        this.users = this.users.filter(x => x.id !== u.id);

        // (3) PAGINATION - if you deleted the last item on the page, fix page
        if (this.page > this.totalPages) this.page = this.totalPages;
      },
      error: (err) => console.error(err)
    });
  }
}
