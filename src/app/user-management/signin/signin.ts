import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminManagementService } from '../../services/admin-management.service';
import { SessionService } from '../../services/session.service';
import { WebAuthnService } from '../../services/webauthn.service';
import { getOrCreateDeviceId } from '../../utils/device';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-signin',
  standalone: false,
  templateUrl: './signin.html',
  styleUrls: ['./signin.css']
})
export class Signin implements OnInit {

  email = '';
  password = '';
  role: string = 'student';

  passkeyLoading = false;
  passkeyError = '';
  loginMessage = '';
  apiErrorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: AdminManagementService,
    private session: SessionService,
    private webAuthn: WebAuthnService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const r = (params['role'] || '').toString().toLowerCase();
      const allowed = ['student', 'candidate', 'admin', 'tutor'];
      this.role = allowed.includes(r) ? r : 'student';
      this.loginMessage = (params['message'] || '').toString();
    });
  }

  private setDeviceIdCookie(deviceId: string) {
    document.cookie = `DEVICE_ID=${encodeURIComponent(deviceId)}; Path=/; Max-Age=31536000; SameSite=Lax`;
  }

  onLogin(form?: { valid?: boolean | null }) {
    if (form != null && form.valid !== true) return;

    this.apiErrorMessage = '';

    const data: any = {
      email: this.email,
      password: this.password,
      role: (this.role || '').toUpperCase()
    };

    this.authService.login(data).subscribe({
      next: (response: any) => {
        this.afterAuthSuccess(response);
      },
      error: (error) => {
        const msg = error?.error?.message || '';
        this.apiErrorMessage = (msg === 'User not found' ? 'Email does not exist' : msg) || 'Invalid credentials';
      }
    });
  }

  // ✅ fallback: essayer de lire le role depuis JWT si /me échoue
  private getRoleFromJwt(token: string): string | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return (payload?.role || payload?.roles?.[0] || payload?.authorities?.[0] || null);
    } catch {
      return null;
    }
  }

  async loginWithPasskey() {
    this.passkeyError = '';
    this.passkeyLoading = true;

    try {
      // 1) login webauthn => token
      const token = await this.webAuthn.loginWithPasskey(this.email);

      // 2) stocker token
      localStorage.setItem('token', token);

      // 3) récupérer role via /me (meilleur)
      this.userService.getMe().subscribe({
        next: (u: any) => {
          const role = (u.role || '').toString().toUpperCase();

          localStorage.setItem('role', role);
          localStorage.setItem('email', u.email);

          this.session.setUser({
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email,
            avatarUrl: u.avatarUrl,
            role
          });

          // ✅ diriger selon role
          this.navigateByRole(role);
        },
        error: (err) => {
          console.error('getMe failed after passkey login', err);

          // 4) fallback: role depuis JWT
          const roleFromJwt = (this.getRoleFromJwt(token) || '').toUpperCase();
          if (roleFromJwt) {
            localStorage.setItem('role', roleFromJwt);
            this.navigateByRole(roleFromJwt);
            return;
          }

          this.passkeyError = 'Sign-in successful but could not retrieve your role.';
        }
      });

    } catch (e: any) {
      console.error('passkey login error', e);
      this.passkeyError = e?.message || 'Passkey sign-in failed';
    } finally {
      this.passkeyLoading = false;
    }
  }

  private afterAuthSuccess(response: any) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('role', (response.role || '').toUpperCase());
    localStorage.setItem('email', response.email);

    this.userService.getMe().subscribe({
      next: (u: any) => {
        this.session.setUser({
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          avatarUrl: u.avatarUrl,
          role: (response.role || '').toUpperCase()
        });

        this.navigateByRole(response.role);
      },
      error: () => {
        this.navigateByRole(response.role);
      }
    });
  }

  private navigateByRole(role: string) {
    const r = (role || '').toUpperCase();
    if (r === 'ADMIN') this.router.navigate(['/admin']);
    else if (r === 'TUTOR') this.router.navigate(['/']);
    else if (r === 'STUDENT') this.router.navigate(['/']);
    else if (r === 'CANDIDATE') this.router.navigate(['/']);
    else this.router.navigate(['/']);
  }

  continueWithGoogle() {
    const r = (this.role || '').toLowerCase();
    if (r !== 'student' && r !== 'candidate') return;

    const deviceId = getOrCreateDeviceId();
    this.setDeviceIdCookie(deviceId);

    const backendRole = r.toUpperCase();
    window.location.href = `${environment.apiGatewayUrl}/oauth2/authorize/google/login/${backendRole}`;
  }
}