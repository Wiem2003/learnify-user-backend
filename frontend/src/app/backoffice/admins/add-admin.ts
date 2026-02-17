import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin';

@Component({
  selector: 'app-add-admin',
  standalone: false,
  templateUrl: './add-admin.html',
  styleUrls: ['./add-admin.css'],
})
export class AddAdminComponent {
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
    this.adminService.createAdmin({
      firstName: this.form.value.firstName!,
      lastName: this.form.value.lastName!,
      email: this.email,
      password: this.form.value.password!,
    }).subscribe({
      next: () => {
        this.loading = false;
        this.msg = 'Admin created successfully ✅';
        this.form.reset();
      },
      error: (e: any) => {
        this.loading = false;
        this.err = e?.error?.message || 'Erreur création admin ❌';
      }
    });
  }
}
