import { Component, AfterViewInit } from '@angular/core';

declare const GLightbox: any;

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  standalone: false,
})
export class HeroComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    if (typeof GLightbox !== 'undefined') {
      GLightbox({ selector: '.glightbox' });
    }
  }

  scrollToCourses(e: Event): void {
    e.preventDefault();
    document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
