import { Component, signal, HostListener, inject, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  standalone: true,
})
export class NavbarComponent {
  @Output() openModal = new EventEmitter<void>();
  activeSection = signal<string>('hero');
  private router = inject(Router);
  auth = inject(AuthService);

  /** Afficher le lien « Noter les profs » pour les étudiants connectés. */
  get showRatingLink(): boolean {
    return this.auth.isAuthenticated() && this.auth.hasRole('USER');
  }

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
        setTimeout(() => {
          this.scrollToSection(sectionId);
        }, 100);
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

  // Navigation vers une page
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