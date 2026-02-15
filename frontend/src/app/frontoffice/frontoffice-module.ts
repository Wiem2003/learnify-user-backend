import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrontofficeRoutingModule } from './frontoffice-routing-module';
import { AdminAccess } from './admin-access/admin-access';
import { TutorAccess } from './tutor-access/tutor-access';
import { CandidateAccess } from './candidate-access/candidate-access';
import { StudentAccess } from './student-access/student-access';
import { Home } from './home/home';


@NgModule({
  declarations: [
    AdminAccess,
    TutorAccess,
    CandidateAccess,
    StudentAccess,
    Home
  ],
  imports: [
    CommonModule,
    FrontofficeRoutingModule
  ]
})
export class FrontofficeModule { }
