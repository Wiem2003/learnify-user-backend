import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CoreModule } from '../core/core.module';

import { ClubsComponent } from '../pages/clubs/clubs.component';
import { MessengerComponent } from '../pages/messenger/messenger.component';
import { PreevaluationComponent } from '../pages/preevaluation/preevaluation.component';
import { PaymentComponent } from '../pages/payment/payment.component';
import { CertificateComponent } from '../pages/certificate/certificate.component';
import { FeedbackComponent } from '../pages/feedback/feedback.component';
import { CvComponent } from '../pages/cv/cv.component';
import { JobOffersComponent } from '../pages/job-offers/job-offers.component';
import { QuizComponent } from '../pages/quiz/quiz.component';
import { ScheduleComponent } from '../pages/schedule/schedule.component';

@NgModule({
  declarations: [
    ClubsComponent,
    MessengerComponent,
    PreevaluationComponent,
    PaymentComponent,
    CertificateComponent,
    FeedbackComponent,
    CvComponent,
    JobOffersComponent,
    QuizComponent,
    ScheduleComponent,
  ],
  imports: [CommonModule, RouterModule, FormsModule, CoreModule],
  exports: [
    ClubsComponent,
    MessengerComponent,
    PreevaluationComponent,
    PaymentComponent,
    CertificateComponent,
    FeedbackComponent,
    CvComponent,
    JobOffersComponent,
    QuizComponent,
    ScheduleComponent,
  ],
})
export class FeaturesModule {}
