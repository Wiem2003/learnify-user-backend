import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AdminRoutingModule } from './admin-routing.module';
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

@NgModule({
  declarations: [
    AdminLayoutComponent,
    AdminDashboardComponent,
    AdminUsersComponent,
    AdminCoursesComponent,
    AdminEventsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AdminRoutingModule,
    AdminJobsListComponent,
    AdminJobFormComponent,
    AdminApplicationsListComponent,
    AdminMeetingsListComponent,
    AdminRatingsListComponent,
    AdminMeetingFormComponent,
    CoursesListComponent,
    CourseFormComponent,
    CourseDetailsComponent,
    EventsListComponent,
    EventFormComponent,
    EventDetailsComponent,
    ClubsListComponent,
    ClubFormComponent,
    ClubDetailsComponent,
  ],
})
export class AdminModule {}
