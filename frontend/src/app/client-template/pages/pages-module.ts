import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CoreModule } from '../core/core.module';
import { ComponentsModule } from '../components/components-module';

// IMPORT DES PAGES
import { CertificateComponent } from './certificate/certificate.component';
import { ClubsComponent } from './clubs/clubs.component';
import { CourseManagementComponent } from './course-management/course-management.component';
import { CourseListComponent } from './courses/course-list/course-list.component';
import { CvComponent } from './cv/cv.component';
import { EventsComponent } from './events/events.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { JobOffersComponent } from './job-offers/job-offers.component';
import { MessengerComponent } from './messenger/messenger.component';
import { PaymentComponent } from './payment/payment.component';
import { PreevaluationComponent } from './preevaluation/preevaluation.component';
import { QuizComponent } from './quiz/quiz.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { ProfileComponent } from './profile/profile';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CoreModule,
    ComponentsModule
  ],

  declarations: [
    CertificateComponent,
    ClubsComponent,
    CourseManagementComponent,
    CourseListComponent,
    CvComponent,
    EventsComponent,
    FeedbackComponent,
    JobOffersComponent,
    MessengerComponent,
    PaymentComponent,
    PreevaluationComponent,
    QuizComponent,
    ScheduleComponent,
    ProfileComponent  
  ],

  exports: [
  ]
})
export class PagesModule { }
