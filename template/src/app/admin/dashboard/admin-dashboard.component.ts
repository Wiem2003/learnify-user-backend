import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { JobService } from '../../services/job.service';
import { ApplicationService } from '../../services/application.service';
import { MeetingService } from '../../services/meeting.service';

@Component({
    selector: 'app-admin-dashboard',
    templateUrl: './admin-dashboard.component.html',
    styleUrl: './admin-dashboard.component.scss',
    standalone: false,
})
export class AdminDashboardComponent implements OnInit {
    stats = [
        { label: 'Utilisateurs', value: '—', icon: 'ti ti-users', trend: '', trendUp: true, color: '#6366f1' },
        { label: 'Offres d\'emploi', value: '—', icon: 'ti ti-briefcase', trend: '', trendUp: true, color: '#10b981' },
        { label: 'Candidatures', value: '—', icon: 'ti ti-file-description', trend: '', trendUp: true, color: '#f59e0b' },
        { label: 'Réunions', value: '—', icon: 'ti ti-calendar', trend: '', trendUp: true, color: '#ef4444' },
    ];
    statsLoading = true;

    recentActivity = [
        { action: 'New user registered', user: 'Sarah Johnson', time: '2 minutes ago', icon: 'ti ti-user-plus', color: '#6366f1' },
        { action: 'Course published', user: 'Mark Davis', time: '15 minutes ago', icon: 'ti ti-book-upload', color: '#10b981' },
        { action: 'Event created', user: 'Emily Chen', time: '1 hour ago', icon: 'ti ti-calendar-plus', color: '#f59e0b' },
        { action: 'Payment received', user: 'Alex Rivera', time: '2 hours ago', icon: 'ti ti-cash', color: '#10b981' },
        { action: 'Course completed', user: 'Jordan Lee', time: '3 hours ago', icon: 'ti ti-certificate', color: '#6366f1' },
        { action: 'User deactivated', user: 'Chris Park', time: '5 hours ago', icon: 'ti ti-user-minus', color: '#ef4444' },
    ];

    quickActions = [
        { label: 'Ajouter un utilisateur', icon: 'ti ti-user-plus', link: '/admin/users' },
        { label: 'Créer une offre', icon: 'ti ti-briefcase', link: '/admin/jobs' },
        { label: 'Voir les candidatures', icon: 'ti ti-file-description', link: '/admin/applications' },
        { label: 'Planifier une réunion', icon: 'ti ti-calendar-plus', link: '/admin/meetings' },
    ];

    constructor(
        private userService: UserService,
        private jobService: JobService,
        private applicationService: ApplicationService,
        private meetingService: MeetingService,
    ) {}

    ngOnInit(): void {
        this.loadStats();
    }

    loadStats(): void {
        this.statsLoading = true;
        let done = 0;
        const total = 4;
        const finish = () => {
            done++;
            if (done >= total) this.statsLoading = false;
        };

        this.userService.getAll().subscribe({
            next: (list) => {
                this.stats[0].value = String(list?.length ?? 0);
                finish();
            },
            error: () => {
                this.stats[0].value = '0';
                finish();
            },
        });
        this.jobService.getAllJobs().subscribe({
            next: (list) => {
                this.stats[1].value = String(list?.length ?? 0);
                finish();
            },
            error: () => {
                this.stats[1].value = '0';
                finish();
            },
        });
        this.applicationService.getAll().subscribe({
            next: (list) => {
                this.stats[2].value = String(list?.length ?? 0);
                finish();
            },
            error: () => {
                this.stats[2].value = '0';
                finish();
            },
        });
        this.meetingService.getAll().subscribe({
            next: (list) => {
                this.stats[3].value = String(list?.length ?? 0);
                finish();
            },
            error: () => {
                this.stats[3].value = '0';
                finish();
            },
        });
    }
}
