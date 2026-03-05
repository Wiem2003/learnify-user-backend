import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Signin } from './signin/signin';
import { Signup } from './signup/signup';
import { ForgotPassword } from './forgot-password/forgot-password';
import { ResetPassword } from './reset-password/reset-password';
import { PinCheck } from './pin-check/pin-check'; // ✅
import { Oauth2Redirect } from './oauth2Redirect/oauth2-redirect';
const routes: Routes = [
  { path: 'login', component: Signin },
  { path: 'signup', component: Signup },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'reset-password', component: ResetPassword },
  { path: 'pin-check', component: PinCheck },
  { path: 'oauth2/redirect', component: Oauth2Redirect},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }