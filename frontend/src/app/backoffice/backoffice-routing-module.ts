import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { UsersComponent } from './userslist/users';
import { UsersStatsComponent } from './users-stats/users-stats';
import { AddAdminComponent } from './admins/add-admin';
import { AddTutorComponent } from './tutors/add-tutor';



const routes: Routes = [
  { path: '', component: Dashboard},
  {
    path: 'users',
    component: UsersComponent
  },
  { path: 'users-stats', component: UsersStatsComponent },
  { path: 'admins/add', component: AddAdminComponent },
  { path: 'tutors/add', component: AddTutorComponent }



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackofficeRoutingModule { }
