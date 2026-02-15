import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';   

import { BackofficeRoutingModule } from './backoffice-routing-module';
import { Dashboard } from './dashboard/dashboard';
import { UsersComponent } from './userslist/users';
import { UsersStatsComponent } from './users-stats/users-stats'; 


@NgModule({
  declarations: [
    Dashboard,
    UsersComponent,
    UsersStatsComponent            

  ],
  imports: [
    CommonModule,
    FormsModule,  
    BackofficeRoutingModule
  ]
})
export class BackofficeModule { }
