import { Component, OnInit } from '@angular/core';
import { User, UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';

@Component({
    selector: 'app-admin-users',
    templateUrl: './admin-users.component.html',
    styleUrl: './admin-users.component.scss',
    standalone: false,
})
export class AdminUsersComponent implements OnInit {
    searchTerm = '';
    filterRole = '';
    users: User[] = [];
    loading = true;
    pageSize = 10;
    currentPage = 1;
    sortBy: 'name' | 'email' | 'role' | 'createdAt' = 'name';
    sortDir: 'asc' | 'desc' = 'asc';
    error = '';
    showDeleteModal = false;
    userToDelete: User | null = null;
    showEditModal = false;
    editUser: User | null = null;
    editName = '';
    editEmail = '';
    editRole: User['role'] = 'USER';
    saving = false;

    constructor(
        private userService: UserService,
        private toast: ToastService,
    ) {}

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        this.loading = true;
        this.error = '';
        this.userService.getAll().subscribe({
            next: (list) => {
                this.users = list;
                this.loading = false;
            },
            error: (err) => {
                this.error = err?.error?.message || 'Erreur lors du chargement des utilisateurs';
                this.loading = false;
            },
        });
    }

    get filteredUsers(): User[] {
        let list = this.users.filter((u) => {
            const matchSearch =
                !this.searchTerm ||
                u.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                u.email.toLowerCase().includes(this.searchTerm.toLowerCase());
            const roleLabel = this.roleLabel(u.role);
            const matchRole = !this.filterRole || roleLabel === this.filterRole;
            return matchSearch && matchRole;
        });
        const mult = this.sortDir === 'asc' ? 1 : -1;
        list = [...list].sort((a, b) => {
            let va: string | number = a[this.sortBy] ?? '';
            let vb: string | number = b[this.sortBy] ?? '';
            if (this.sortBy === 'createdAt') {
                va = new Date(va as string).getTime();
                vb = new Date(vb as string).getTime();
            }
            if (va < vb) return -1 * mult;
            if (va > vb) return 1 * mult;
            return 0;
        });
        return list;
    }

    get paginatedUsers(): User[] {
        const start = (this.currentPage - 1) * this.pageSize;
        return this.filteredUsers.slice(start, start + this.pageSize);
    }

    get totalPages(): number {
        return Math.max(1, Math.ceil(this.filteredUsers.length / this.pageSize));
    }

    setPage(p: number): void {
        this.currentPage = Math.max(1, Math.min(p, this.totalPages));
    }

    setSort(field: 'name' | 'email' | 'role' | 'createdAt'): void {
        if (this.sortBy === field) this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
        else {
            this.sortBy = field;
            this.sortDir = 'asc';
        }
        this.currentPage = 1;
    }

    roleLabel(role: User['role']): string {
        const map = { USER: 'Student', TEACHER: 'Instructor', ADMIN: 'Admin' };
        return map[role] ?? role;
    }

    openEdit(u: User): void {
        this.editUser = u;
        this.editName = u.name;
        this.editEmail = u.email;
        this.editRole = u.role;
        this.showEditModal = true;
    }

    closeEdit(): void {
        this.editUser = null;
        this.showEditModal = false;
    }

    saveEdit(): void {
        if (!this.editUser) return;
        this.saving = true;
        this.userService.update(this.editUser.id, { name: this.editName, email: this.editEmail, role: this.editRole }).subscribe({
            next: () => {
                this.loadUsers();
                this.closeEdit();
                this.saving = false;
                this.toast.success('Utilisateur mis à jour');
            },
            error: (err) => {
                this.error = err?.error?.message || 'Erreur lors de la mise à jour';
                this.saving = false;
                this.toast.error(this.error);
            },
        });
    }

    confirmDelete(u: User): void {
        this.userToDelete = u;
        this.showDeleteModal = true;
    }

    cancelDelete(): void {
        this.userToDelete = null;
        this.showDeleteModal = false;
    }

    deleteUser(): void {
        if (!this.userToDelete) return;
        this.userService.delete(this.userToDelete.id).subscribe({
            next: () => {
                this.loadUsers();
                this.cancelDelete();
                this.toast.success('Utilisateur supprimé');
            },
            error: (err) => {
                this.error = err?.error?.message || 'Suppression impossible';
                this.toast.error(this.error);
            },
        });
    }

    formatDate(d: string | undefined): string {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    initials(name: string): string {
        return name
            .split(/\s+/)
            .map((s) => s[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }
}
