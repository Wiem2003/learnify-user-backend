import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, User } from '../../../services/user';

// ✅ SESSION: import du service de session
import { SessionService } from '../../../services/session';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {

  user: User = {} as User;
  loading = false;

  cacheBuster = Date.now();

  private originalEmail = '';

  // password
  currentPassword = '';
  newPassword = '';
  confirmNewPassword = '';

  // avatar upload
  selectedFile: File | null = null;
  avatarPreview: string | null = null;

  private readonly API_BASE = 'http://localhost:8080';

  constructor(
    private userService: UserService,
    private router: Router,

    // ✅ SESSION: injection du service pour pouvoir mettre à jour la navbar
    private session: SessionService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  getAvatarSrc(): string {
    if (this.avatarPreview) return this.avatarPreview;

    const url = this.user?.avatarUrl;
    if (url) {
      if (url.startsWith('http')) return `${url}?t=${this.cacheBuster}`;
      if (url.startsWith('/')) return `${this.API_BASE}${url}?t=${this.cacheBuster}`;
      if (url.startsWith('uploads/')) return `${this.API_BASE}/${url}?t=${this.cacheBuster}`;
      return `${this.API_BASE}/uploads/${url}?t=${this.cacheBuster}`;
    }

    return 'assets/img/avatar.png';
  }

  load(): void {
    this.loading = true;
    this.userService.getMe().subscribe({
      next: (u: User) => {
        this.user = u;
        this.originalEmail = u.email;
        this.loading = false;

        this.avatarPreview = null;
        this.selectedFile = null;
        this.cacheBuster = Date.now();

        // ✅ SESSION: mettre à jour la session quand on charge le profil
        // => la navbar affiche toujours le bon prénom/nom/photo
        this.session.setUser({
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          avatarUrl: u.avatarUrl,
          role: localStorage.getItem('role') || undefined
        });
      },
      error: (err: any) => {
        this.loading = false;
        alert(err?.error?.message || 'Erreur profil');
      }
    });
  }

  save(): void {
    this.loading = true;
    this.userService.updateMe({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email
    }).subscribe({
      next: (updated: User) => {
        this.loading = false;
        alert('Profil mis à jour ✅');

        if (this.originalEmail !== updated.email) {
          alert('Email changé → reconnecte-toi');
          localStorage.clear();
          this.router.navigate(['/signin'], { queryParams: { role: 'STUDENT' } });
          return;
        }

        this.user = { ...this.user, ...updated };

        // ✅ SESSION: mise à jour session après modification infos
        this.session.setUser({
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          email: this.user.email,
          avatarUrl: this.user.avatarUrl,
          role: localStorage.getItem('role') || undefined
        });
      },
      error: (err: any) => {
        this.loading = false;
        alert(err?.error?.message || 'Erreur update');
      }
    });
  }

  changePassword(): void {
    if (this.newPassword !== this.confirmNewPassword) {
      alert('Confirmation mot de passe incorrecte');
      return;
    }

    this.loading = true;
    this.userService.changePassword({
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
      confirmNewPassword: this.confirmNewPassword
    }).subscribe({
      next: () => {
        this.loading = false;
        alert('Mot de passe modifié ✅');
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmNewPassword = '';
      },
      error: (err: any) => {
        this.loading = false;
        alert(err?.error?.message || 'Erreur changement mot de passe');
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    if (file.size > 2 * 1024 * 1024) {
      alert('Image trop grande (max 2MB)');
      input.value = '';
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Choisis une image (PNG/JPG)');
      input.value = '';
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.avatarPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  uploadAvatar(): void {
    if (!this.selectedFile) return;

    this.loading = true;
    this.userService.uploadAvatar(this.selectedFile).subscribe({
      next: (res: any) => {
        this.loading = false;

        // update url serveur
        this.user.avatarUrl = res.avatarUrl;
        this.cacheBuster = Date.now();

        this.selectedFile = null;

        // ✅ SESSION: mise à jour DIRECTE après upload avatar
        // => la navbar recharge l'image immédiatement
        this.session.setUser({
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          email: this.user.email,
          avatarUrl: this.user.avatarUrl,
          role: localStorage.getItem('role') || undefined
        });

        // optionnel: enlever preview après un petit délai
        setTimeout(() => {
          this.avatarPreview = null;
        }, 300);

        alert('Photo mise à jour ✅');
      },
      error: (err: any) => {
        this.loading = false;
        alert(err?.error?.message || 'Erreur upload photo');
      }
    });
  }

}
