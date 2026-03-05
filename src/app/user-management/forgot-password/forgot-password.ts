import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export class ForgotPassword {

  email = '';
  loading = false;
  message = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  sendPin() {
    this.message = '';
    this.error = '';

    if (!this.email) {
      this.error = 'Please enter your email.';
      return;
    }

    this.loading = true;

    this.auth.forgotPassword(this.email).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.message = res || 'PIN sent to your email.';

        // ✅ redirect to reset page (email prefilled)
        setTimeout(() => {
          this.router.navigate(['/auth/reset-password'], {
            queryParams: { email: this.email }
          });
        }, 500);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error || 'Failed to send PIN.';
      }
    });
  }
}
