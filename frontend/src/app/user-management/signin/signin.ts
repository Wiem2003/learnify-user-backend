import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { UserService } from '../../services/user';
import { SessionService } from '../../services/session';

@Component({
  selector: 'app-signin',
  standalone: false,
  templateUrl: './signin.html',
  styleUrls: ['./signin.css']
})
export class Signin implements OnInit {

  email = '';
  password = '';
  role: string = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private session: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.role = params['role'];
    });
  }

  onLogin() {
    const data = {
      email: this.email,
      password: this.password,
      role: this.role.toUpperCase()
    };

    this.authService.login(data).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        localStorage.setItem('email', response.email);

        // ✅ Charger le profil + mettre dans session
        this.userService.getMe().subscribe({
          next: (u: any) => {
            this.session.setUser({
              firstName: u.firstName,
              lastName: u.lastName,
              email: u.email,
              avatarUrl: u.avatarUrl,
              role: response.role
            });

            // ✅ navigation
            if (response.role === 'ADMIN') this.router.navigate(['/backoffice']);
            else if (response.role === 'TUTOR') this.router.navigate(['/tutor']);
            else if (response.role === 'STUDENT') this.router.navigate(['/client']);
            else if (response.role === 'CANDIDATE') this.router.navigate(['/candidate']);
          },
          error: () => {
            // si /me échoue on navigue quand même
            if (response.role === 'ADMIN') this.router.navigate(['/backoffice']);
            else if (response.role === 'TUTOR') this.router.navigate(['/tutor']);
            else if (response.role === 'STUDENT') this.router.navigate(['/client']);
            else if (response.role === 'CANDIDATE') this.router.navigate(['/candidate']);
          }
        });
      },
      error: (error) => {
        alert(error.error?.message || 'Invalid credentials');
      }
    });
  }
}
