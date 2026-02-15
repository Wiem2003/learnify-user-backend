import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class Signup implements OnInit {

  firstName = '';
  lastName = '';
  email = '';
  password = '';

  role: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.role = params['role'];

      if (!this.role) {
        alert("Role not specified");
        this.router.navigate(['/']);
      }
    });
  }

  onSubmit(role: string) {

    const data = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password
    };

    if (role === 'student') {
      this.authService.registerStudent(data).subscribe(() => {
        alert('Student registered successfully');
        this.router.navigate(['/auth/login'], { queryParams: { role: 'student' } });
      });
    }

    else if (role === 'candidate') {
      this.authService.registerCandidate(data).subscribe(() => {
        alert('Candidate registered successfully');
        this.router.navigate(['/auth/login'], { queryParams: { role: 'candidate' } });
      });
    }

    else {
      alert("Invalid role");
    }
  }
}
