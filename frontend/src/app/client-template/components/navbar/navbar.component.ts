import { Component, signal, HostListener, inject, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// ✅ session : chemin relatif correct
import { SessionService, SessionUser } from '../../../services/session';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  standalone: false,
})
export class NavbarComponent implements OnInit {

  @Output() openModal = new EventEmitter<void>();
  activeSection = signal<string>('hero');
  private router = inject(Router);

  // ================= SESSION =================
  user: SessionUser | null = null;
  private readonly API_BASE = 'http://localhost:8080';
  cacheBuster = Date.now();

  constructor(private session: SessionService) {}

  ngOnInit(): void {
    this.session.user$.subscribe((u: SessionUser | null) => {
      this.user = u;
      this.cacheBuster = Date.now();
    });
  }

  getAvatar(): string {
    if (!this.user?.avatarUrl) return 'assets/img/avatar.png';

    const url = this.user.avatarUrl;

    if (url.startsWith('http')) return `${url}?t=${this.cacheBuster}`;
    if (url.startsWith('/')) return `${this.API_BASE}${url}?t=${this.cacheBuster}`;
    if (url.startsWith('uploads/')) return `${this.API_BASE}/${url}?t=${this.cacheBuster}`;

    return `${this.API_BASE}/uploads/${url}?t=${this.cacheBuster}`;
  }
  // ===========================================

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const sections = ['hero', 'courses', 'mentor', 'group', 'testimonials', 'pricing'];
    const scrollPosition = window.pageYOffset + 100;

    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const offsetTop = element.offsetTop;
        const offsetHeight = element.offsetHeight;

        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          this.activeSection.set(section);
          break;
        }
      }
    }
  }

  scrollTo(sectionId: string) {
    if (this.router.url !== '/' && this.router.url !== '') {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => this.scrollToSection(sectionId), 100);
      });
    } else {
      this.scrollToSection(sectionId);
    }
  }

  private scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 80;
      const elementPosition = element.offsetTop - navbarHeight;

      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });

      this.activeSection.set(sectionId);
    }
  }

  navigateToPage(route: string) {
    this.router.navigate([route]);
  }

  isHomePage(): boolean {
    return this.router.url === '/' || this.router.url === '';
  }

  isActiveRoute(path: string): boolean {
    const url = this.router.url.split('?')[0];
    if (path === '/') return url === '/' || url === '';
    return url.startsWith(path);
  }

  onGetStarted() {
    this.openModal.emit();
  }
}
