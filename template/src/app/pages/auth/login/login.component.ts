import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, LoginRequest, LoginResponse } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  form: LoginRequest = { email: '', password: '' };
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit(): void {
    if (!this.form.email || !this.form.password || this.loading) return;
    this.loading = true;
    this.error = '';
    this.auth.login(this.form).subscribe({
      next: (res: LoginResponse) => {
        this.loading = false;
        if (res.user?.role === 'ADMIN') {
          this.router.navigateByUrl('/admin');
        } else if (res.user?.role === 'USER') {
          this.router.navigateByUrl('/feedback');
        } else {
          this.router.navigateByUrl('/job-offers');
        }
      },
      error: (e) => {
        this.loading = false;
        this.error = e?.error?.message ?? e?.message ?? 'Login failed';
      },
    });
  }
}

