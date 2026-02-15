import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { UsersComponent } from './userslist/users';
import { UsersStatsComponent } from './users-stats/users-stats';



const routes: Routes = [
  { path: '', component: Dashboard},
  {
    path: 'users',
    component: UsersComponent
  },
  { path: 'users-stats', component: UsersStatsComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackofficeRoutingModule { }
