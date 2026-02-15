import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserManagementRoutingModule } from './user-management-routing-module';
import { Signin } from './signin/signin';
import { Signup } from './signup/signup';

@NgModule({
  declarations: [
    Signin,
    Signup
  ],
  imports: [
    CommonModule,
    FormsModule,
    UserManagementRoutingModule
  ]
})
export class UserManagementModule { }
