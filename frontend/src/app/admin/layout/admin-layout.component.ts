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
        { path: '/admin/tutors', icon: 'ti ti-chalkboard', label: 'Tutors' },
        { path: '/admin/courses', icon: 'ti ti-book', label: 'Courses' },
        { path: '/admin/events', icon: 'ti ti-calendar-event', label: 'Events' },
        { path: '/admin/clubs', icon: 'ti ti-users-group', label: 'Clubs' },
        { path: '/admin/quizzes', icon: 'ti ti-help-circle', label: 'Quizzes' },
        { path: '/admin/feedbacks', icon: 'ti ti-message-star', label: 'Feedbacks' },
        { path: '/admin/jobs', icon: 'ti ti-briefcase', label: 'Jobs' },
        { path: '/admin/meetings', icon: 'ti ti-calendar-check', label: 'Meetings' },
        { path: '/admin/ratings', icon: 'ti ti-star', label: 'Ratings' },
    ];
}
