import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminLayoutComponent } from './layout/admin-layout.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './users/admin-users.component';
import { AdminCoursesComponent } from './courses/admin-courses.component';
import { AdminEventsComponent } from './events/admin-events.component';
import { AdminJobsListComponent } from './jobs/admin-jobs-list.component';
import { AdminJobFormComponent } from './jobs/admin-job-form.component';
import { AdminApplicationsListComponent } from './applications/admin-applications-list.component';
import { AdminMeetingsListComponent } from './meetings/admin-meetings-list.component';
import { AdminRatingsListComponent } from './ratings/admin-ratings-list.component';
import { AdminMeetingFormComponent } from './meetings/admin-meeting-form.component';

import { CoursesListComponent } from './courses/courses-list/courses-list.component';
import { CourseFormComponent } from './courses/course-form/course-form.component';
import { CourseDetailsComponent } from './courses/course-details/course-details.component';
import { EventsListComponent } from './events/events-list/events-list.component';
import { EventFormComponent } from './events/event-form/event-form.component';
import { EventDetailsComponent } from './events/event-details/event-details.component';
import { ClubsListComponent } from './clubs/clubs-list/clubs-list.component';
import { ClubFormComponent } from './clubs/club-form/club-form.component';
import { ClubDetailsComponent } from './clubs/club-details/club-details.component';

const routes: Routes = [
    {
        path: '',
        component: AdminLayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: AdminDashboardComponent },
            { path: 'users', component: AdminUsersComponent },

            { path: 'jobs', component: AdminJobsListComponent },
            { path: 'jobs/create', component: AdminJobFormComponent },
            { path: 'jobs/edit/:id', component: AdminJobFormComponent },

            { path: 'applications', component: AdminApplicationsListComponent },

            { path: 'ratings', component: AdminRatingsListComponent },

            { path: 'meetings', component: AdminMeetingsListComponent },
            { path: 'meetings/create', component: AdminMeetingFormComponent },
            { path: 'meetings/edit/:id', component: AdminMeetingFormComponent },

            { path: 'courses', component: CoursesListComponent },
            { path: 'courses/create', component: CourseFormComponent },
            { path: 'courses/edit/:id', component: CourseFormComponent },
            { path: 'courses/:id', component: CourseDetailsComponent },

            { path: 'events', component: EventsListComponent },
            { path: 'events/create', component: EventFormComponent },
            { path: 'events/edit/:id', component: EventFormComponent },
            { path: 'events/:id', component: EventDetailsComponent },

            { path: 'clubs', component: ClubsListComponent },
            { path: 'clubs/create', component: ClubFormComponent },
            { path: 'clubs/edit/:id', component: ClubFormComponent },
            { path: 'clubs/:id', component: ClubDetailsComponent },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule { }
