import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Signin } from './signin/signin';
import { Signup } from './signup/signup';

const routes: Routes = [
  { path: 'login', component: Signin },
  { path: 'signup', component: Signup }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
