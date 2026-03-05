import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminLayoutComponent } from './layout/admin-layout.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './users/admin-users.component';
import { AdminCoursesComponent } from './courses/admin-courses.component';
import { AdminEventsComponent } from './events/admin-events.component';

// CRUD reuse for other modules
import { CoursesListComponent } from './courses/courses-list/courses-list.component';
import { CourseFormComponent } from './courses/course-form/course-form.component';
import { CourseDetailsComponent } from './courses/course-details/course-details.component';
// note: admin events CRUD is handled by AdminEventsComponent, no separate list/form/details components needed
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
            
            // Courses CRUD
            { path: 'courses', component: CoursesListComponent },
            { path: 'courses/create', component: CourseFormComponent },
            { path: 'courses/edit/:id', component: CourseFormComponent },
            { path: 'courses/:id', component: CourseDetailsComponent },
            
            // Events management handled by single component with modal CRUD
            { path: 'events', component: AdminEventsComponent },
            
            // Clubs CRUD
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
