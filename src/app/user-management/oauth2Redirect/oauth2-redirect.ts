import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminManagementService } from '../../services/admin-management.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-oauth2-redirect',
  standalone: true,
  templateUrl: './oauth2-redirect.html',
  styleUrls: ['./oauth2-redirect.css']
})
export class Oauth2Redirect implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: AdminManagementService,
    private session: SessionService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {

      // ✅ 0) Google OAuth errors
      const error = params['error'];
      if (error) {
        const role = (params['role'] || '').toString().toLowerCase();

        if (error === 'account_exists') {
          alert("This account already exists. Please log in with Google.");
          this.router.navigate(['/auth/login'], { queryParams: { role } });
          return;
        }

        if (error === 'account_not_found') {
          alert("No account found. Sign up with Google first.");
          this.router.navigate(['/auth/signup'], { queryParams: { role: role || 'student' } });
          return;
        }

        alert("Google OAuth error: " + error);
        this.router.navigate(['/auth/login'], { queryParams: { role: 'student' } });
        return;
      }

      // device-pending flow is removed — skip pending params entirely

      // ✅ 2) token normal
      const token = params['token'];
      if (!token) {
        this.router.navigate(['/auth/login'], { queryParams: { role: 'student' } });
        return;
      }

      // 🔐 stocker token
      localStorage.setItem('token', token);

      // ✅ récupérer role depuis JWT
      const role = (this.getRoleFromJwt(token) || '').toUpperCase();
      localStorage.setItem('role', role);

      // ✅ charger profil utilisateur (optionnel)
      this.userService.getMe().subscribe({
        next: (u: any) => {
          localStorage.setItem('email', u.email);

          this.session.setUser({
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email,
            avatarUrl: u.avatarUrl,
            role
          });

          this.navigateByRole(role);
        },
        error: () => {
          this.navigateByRole(role);
        }
      });
    });
  }

  private getRoleFromJwt(token: string): string | null {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      return decoded.role || null;
    } catch {
      return null;
    }
  }

  private navigateByRole(role: string) {
    const r = (role || '').toUpperCase();

    if (r === 'ADMIN') this.router.navigate(['/admin']);
    else if (r === 'TUTOR') this.router.navigate(['/']);
    else if (r === 'STUDENT') this.router.navigate(['/']);
    else if (r === 'CANDIDATE') this.router.navigate(['/candidate']);
    else this.router.navigate(['/']);
  }
}
