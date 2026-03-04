import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService, NotificationDTO } from '../../services/notification.service';

@Component({
    selector: 'app-admin-layout',
    templateUrl: './admin-layout.component.html',
    styleUrl: './admin-layout.component.scss',
    standalone: false,
})
export class AdminLayoutComponent implements OnInit {
    sidebarCollapsed = false;
    currentDate = new Date();
    showNotifications = false;
    notifications: NotificationDTO[] = [];
    unreadCount = 0;
    notificationsLoading = false;

    constructor(
        private router: Router,
        public auth: AuthService,
        private notificationService: NotificationService,
    ) {}

    ngOnInit(): void {
        this.loadUnreadCount();
    }

    loadUnreadCount(): void {
        this.notificationService.getUnreadCount().subscribe({
            next: (res) => (this.unreadCount = res.count ?? 0),
            error: () => (this.unreadCount = 0),
        });
    }

    toggleNotifications(): void {
        this.showNotifications = !this.showNotifications;
        if (this.showNotifications) {
            this.loadNotifications();
        }
    }

    loadNotifications(): void {
        this.notificationsLoading = true;
        this.notificationService.getUnread().subscribe({
            next: (list) => {
                this.notifications = list ?? [];
                this.notificationsLoading = false;
            },
            error: () => {
                this.notifications = [];
                this.notificationsLoading = false;
            },
        });
    }

    markAsRead(n: NotificationDTO): void {
        if (n.read) return;
        this.notificationService.markAsRead(n.id).subscribe({
            next: () => {
                n.read = true;
                this.notifications = this.notifications.filter((x) => x.id !== n.id);
                this.unreadCount = Math.max(0, this.unreadCount - 1);
            },
        });
    }

    markAllAsRead(): void {
        this.notificationService.markAllAsRead().subscribe({
            next: () => {
                this.notifications = [];
                this.unreadCount = 0;
            },
        });
    }

    closeNotifications(): void {
        this.showNotifications = false;
    }

    formatNotificationDate(d: string | undefined): string {
        if (!d) return '';
        const date = new Date(d);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1) return 'À l\'instant';
        if (diffMins < 60) return `Il y a ${diffMins} min`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `Il y a ${diffHours} h`;
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays < 7) return `Il y a ${diffDays} j`;
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    }

    logout(): void {
        this.auth.logout().subscribe({
            next: () => this.router.navigateByUrl('/auth/login'),
            error: () => {
                this.auth.clearLocalSession();
                this.router.navigateByUrl('/auth/login');
            },
        });
    }

    toggleSidebar(): void {
        this.sidebarCollapsed = !this.sidebarCollapsed;
    }

    /** Navigation explicite vers une route admin pour éviter la redirection vers l'accueil. */
    goToAdmin(path: string): void {
        this.router.navigateByUrl('/admin/' + path).catch(() => {
            this.router.navigate(['/admin', path]);
        });
    }

    /** Indique si la route est active (pour le style du menu). */
    isActive(path: string): boolean {
        const url = this.router.url;
        if (path === 'dashboard') {
            return url === '/admin' || url === '/admin/' || url === '/admin/dashboard';
        }
        return url.startsWith('/admin/' + path);
    }

    navItems = [
        { path: 'dashboard', icon: 'ti ti-dashboard', label: 'Dashboard' },
        { path: 'users', icon: 'ti ti-users', label: 'Users' },
        { path: 'jobs', icon: 'ti ti-briefcase', label: 'Offres' },
        { path: 'applications', icon: 'ti ti-file-description', label: 'Candidatures' },
        { path: 'meetings', icon: 'ti ti-calendar', label: 'Réunions' },
        { path: 'ratings', icon: 'ti ti-star', label: 'Rating' },
        { path: 'courses', icon: 'ti ti-book', label: 'Courses' },
        { path: 'events', icon: 'ti ti-calendar-event', label: 'Events' },
        { path: 'clubs', icon: 'ti ti-users-group', label: 'Clubs' },
    ];

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        if (this.showNotifications && target && !target.closest('.notification-wrap')) {
            this.closeNotifications();
        }
    }
}
