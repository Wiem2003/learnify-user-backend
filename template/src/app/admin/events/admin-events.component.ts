import { Component } from '@angular/core';

@Component({
    selector: 'app-admin-events',
    templateUrl: './admin-events.component.html',
    styleUrl: './admin-events.component.scss',
    standalone: false,
})
export class AdminEventsComponent {
    searchTerm = '';
    filterStatus = '';

    events = [
        { id: 1, title: 'Web Dev Hackathon 2026', date: 'Mar 15, 2026', location: 'Main Campus', capacity: 200, registered: 187, status: 'Upcoming' },
        { id: 2, title: 'AI Summit Workshop', date: 'Mar 22, 2026', location: 'Virtual', capacity: 500, registered: 342, status: 'Upcoming' },
        { id: 3, title: 'Design Thinking Bootcamp', date: 'Feb 28, 2026', location: 'Room 301', capacity: 50, registered: 50, status: 'Upcoming' },
        { id: 4, title: 'Career Fair - Spring 2026', date: 'Apr 10, 2026', location: 'Auditorium', capacity: 1000, registered: 456, status: 'Upcoming' },
        { id: 5, title: 'Open Source Day', date: 'Feb 10, 2026', location: 'Lab B4', capacity: 80, registered: 72, status: 'Ongoing' },
        { id: 6, title: 'JavaScript Conference', date: 'Jan 20, 2026', location: 'Virtual', capacity: 300, registered: 298, status: 'Completed' },
        { id: 7, title: 'Cloud Workshop', date: 'Dec 15, 2025', location: 'Room 102', capacity: 60, registered: 55, status: 'Completed' },
        { id: 8, title: 'Mobile Dev Sprint', date: 'Nov 5, 2025', location: 'Main Campus', capacity: 100, registered: 0, status: 'Cancelled' },
    ];

    get filteredEvents() {
        return this.events.filter(e => {
            const matchSearch = !this.searchTerm || e.title.toLowerCase().includes(this.searchTerm.toLowerCase()) || e.location.toLowerCase().includes(this.searchTerm.toLowerCase());
            const matchStatus = !this.filterStatus || e.status === this.filterStatus;
            return matchSearch && matchStatus;
        });
    }
}
