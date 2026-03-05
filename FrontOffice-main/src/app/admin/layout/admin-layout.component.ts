import { Component } from '@angular/core';

@Component({
    selector: 'app-admin-layout',
    templateUrl: './admin-layout.component.html',
    styleUrl: './admin-layout.component.scss',
    standalone: false,
})
export class AdminLayoutComponent {
    sidebarCollapsed = false;
    currentDate = new Date();

    toggleSidebar(): void {
        this.sidebarCollapsed = !this.sidebarCollapsed;
    }

    navItems = [
        { path: '/admin/dashboard', icon: 'ti ti-dashboard', label: 'Dashboard' },
        { path: '/admin/users', icon: 'ti ti-users', label: 'Users' },
        { path: '/admin/courses', icon: 'ti ti-book', label: 'Courses' },
        { path: '/admin/events', icon: 'ti ti-calendar-event', label: 'Events' },
    ];
}
