import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin';

@Component({
  selector: 'app-add-tutor',
  standalone: false,
  templateUrl: './add-tutor.html',
  styleUrls: ['./add-tutor.css'],
})
export class AddTutorComponent {
  readonly domain = '@learnify.com';
  loading = false;
  msg = '';
  err = '';

  form;

  constructor(private fb: FormBuilder, private adminService: AdminService) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._-]+$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get email(): string {
    const u = (this.form.value.username || '').trim();
    return u ? `${u}${this.domain}` : '';
  }

  submit() {
    this.msg = '';
    this.err = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.adminService.createTutor({
      firstName: this.form.value.firstName!,
      lastName: this.form.value.lastName!,
      email: this.email,
      password: this.form.value.password!,
    }).subscribe({
      next: () => {
        this.loading = false;
        this.msg = 'Tutor created successfully ✅';
        this.form.reset();
      },
      error: (e: any) => {
        this.loading = false;
        this.err = e?.error?.message || 'Failed to create tutor ❌';
      }
    });
  }
}
