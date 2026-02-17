import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // ✅ UN SEUL IMPORT

import { BackofficeRoutingModule } from './backoffice-routing-module';
import { Dashboard } from './dashboard/dashboard';
import { UsersComponent } from './userslist/users';
import { UsersStatsComponent } from './users-stats/users-stats';
import { AddAdminComponent } from './admins/add-admin';
import { AddTutorComponent } from './tutors/add-tutor';


@NgModule({
  declarations: [
    Dashboard,
    UsersComponent,
    UsersStatsComponent,
    AddAdminComponent,
    AddTutorComponent

  ],
  imports: [
    CommonModule,
    FormsModule,          // pour ngModel
    ReactiveFormsModule,  // pour formGroup
    BackofficeRoutingModule
  ]
})
export class BackofficeModule { }
