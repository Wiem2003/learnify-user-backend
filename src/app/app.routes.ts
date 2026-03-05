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
import { MyApplicationsComponent } from './pages/my-applications/my-applications.component';
import { RateTutorComponent } from './pages/rate-tutor/rate-tutor.component';
import { QuizComponent } from './pages/quiz/quiz.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';

// Client Interface Components
import { ClientCoursesListComponent } from './pages/courses/client-courses-list/client-courses-list.component';
import { ClientCourseDetailsComponent } from './pages/courses/client-course-details/client-course-details.component';
import { ClientEventsListComponent } from './pages/events/client-events-list/client-events-list.component';
import { ClientEventDetailsComponent } from './pages/events/client-event-details/client-event-details.component';
import { ClientClubsListComponent } from './pages/clubs/client-clubs-list/client-clubs-list.component';
import { ClientClubDetailsComponent } from './pages/clubs/client-club-details/client-club-details.component';

// Event features (PI)
import { EventStatisticsComponent } from './components/event-statistics/event-statistics.component';
import { TicketScannerComponent } from './components/ticket-scanner/ticket-scanner.component';
import { EventsAdvancedComponent } from './pages/events-advanced/events-advanced.component';

// Payment/Cart (CODE2)
import { CartComponent } from './pages/cart/cart.component';

// Quiz-Feedback (CODE3)
import { QuizListComponent } from './quiz-feedback/components/quiz/quiz-list/quiz-list.component';
import { QuizDetailComponent } from './quiz-feedback/components/quiz/quiz-detail/quiz-detail.component';
import { QuizFormComponent } from './quiz-feedback/components/quiz/quiz-form/quiz-form.component';
import { TakeQuizComponent } from './quiz-feedback/components/quiz-attempt/take-quiz/take-quiz.component';
import { AttemptResultComponent } from './quiz-feedback/components/quiz-attempt/attempt-result/attempt-result.component';
import { FeedbackListComponent } from './quiz-feedback/components/feedback/feedback-list/feedback-list.component';
import { FeedbackFormComponent } from './quiz-feedback/components/feedback/feedback-form/feedback-form.component';

// Auth guard
import { guestGuard } from './guards/guest.guard';
import { adminGuard } from './guards/auth.guard';

// OAuth2 redirect component (inline — Spring sends the browser here after Google login)
import { Oauth2Redirect } from './user-management/oauth2Redirect/oauth2-redirect';

export const routes: Routes = [
  { path: '', component: HomeComponent },

  // Client Courses
  { path: 'courses', component: ClientCoursesListComponent },
  { path: 'courses/:id', component: ClientCourseDetailsComponent },

  // Client Events
  { path: 'events', component: ClientEventsListComponent },
  { path: 'events/:id', component: ClientEventDetailsComponent },
  { path: 'events-advanced', component: EventsAdvancedComponent },

  // Client Clubs
  { path: 'clubs', component: ClientClubsListComponent },
  { path: 'clubs/:id', component: ClientClubDetailsComponent },

  // Event features (PI)
  { path: 'statistics', component: EventStatisticsComponent },
  { path: 'scanner', component: TicketScannerComponent },

  // Cart (CODE2)
  { path: 'cart', component: CartComponent },

  // Quizzes (CODE3)
  { path: 'quizzes', component: QuizListComponent },
  { path: 'quizzes/new', component: QuizFormComponent },
  { path: 'quizzes/:id', component: QuizDetailComponent },
  { path: 'quizzes/:id/edit', component: QuizFormComponent },
  { path: 'quizzes/:id/take', component: TakeQuizComponent },
  { path: 'attempts/:id/result', component: AttemptResultComponent },

  // Feedbacks (CODE3)
  { path: 'feedbacks', component: FeedbackListComponent },
  { path: 'feedbacks/new', component: FeedbackFormComponent },
  { path: 'feedbacks/:id/edit', component: FeedbackFormComponent },

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
  { path: 'my-applications', component: MyApplicationsComponent },
  { path: 'rate-tutor', component: RateTutorComponent },
  { path: 'schedule', component: ScheduleComponent },

  // Auth module (lazy-loaded) — guest guard prevents access when already logged in
  {
    path: 'auth',
    loadChildren: () =>
      import('./user-management/user-management-module').then(m => m.UserManagementModule),
    canActivate: [guestGuard],
  },

  // Top-level OAuth2 redirect — Spring redirects here after Google login
  // Must be at root level because Spring is configured with redirectUri ending in /oauth2/redirect
  { path: 'oauth2/redirect', component: Oauth2Redirect },

  // Admin (lazy-loaded)
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [adminGuard],
  },

  { path: '**', redirectTo: '' },
];
