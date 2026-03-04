import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CourseListComponent } from './pages/courses/course-list/course-list.component';
import { CourseManagementComponent } from './pages/course-management/course-management.component';
import { ClubsComponent } from './pages/clubs/clubs.component';
import { EventsComponent } from './pages/events/events.component';
import { MessengerComponent } from './pages/messenger/messenger.component';
import { PreevaluationComponent } from './pages/preevaluation/preevaluation.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { CertificateComponent } from './pages/certificate/certificate.component';
import { FeedbackComponent } from './pages/feedback/feedback.component';
import { CvComponent } from './pages/cv/cv.component';
import { JobOffersComponent } from './pages/job-offers/job-offers.component';
import { QuizComponent } from './pages/quiz/quiz.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';
import { LoginComponent } from './pages/auth/login/login.component';

// Client Interface Components (to be created)
import { ClientCoursesListComponent } from './pages/courses/client-courses-list/client-courses-list.component';
import { ClientCourseDetailsComponent } from './pages/courses/client-course-details/client-course-details.component';
import { ClientEventsListComponent } from './pages/events/client-events-list/client-events-list.component';
import { ClientEventDetailsComponent } from './pages/events/client-event-details/client-event-details.component';
import { ClientClubsListComponent } from './pages/clubs/client-clubs-list/client-clubs-list.component';
import { ClientClubDetailsComponent } from './pages/clubs/client-club-details/client-club-details.component';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  
  // Client Courses
  { path: 'courses', component: ClientCoursesListComponent },
  { path: 'courses/:id', component: ClientCourseDetailsComponent },
  
  // Client Events
  { path: 'events', component: ClientEventsListComponent },
  { path: 'events/:id', component: ClientEventDetailsComponent },
  
  // Client Clubs
  { path: 'clubs', component: ClientClubsListComponent },
  { path: 'clubs/:id', component: ClientClubDetailsComponent },
  
  // Legacy routes (keeping for backward compatibility)
  { path: 'courses/manage', component: CourseManagementComponent },
  { path: 'messenger', component: MessengerComponent },
  { path: 'preevaluation', component: PreevaluationComponent },
  { path: 'quiz', component: QuizComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'certificate', component: CertificateComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'cv', component: CvComponent },
  { path: 'job-offers', component: JobOffersComponent },
  { path: 'schedule', component: ScheduleComponent },
  { path: 'auth/login', component: LoginComponent },
  
  // Admin (protégé : connexion + rôle ADMIN requis)
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
  },
  { path: '**', redirectTo: '' },
];