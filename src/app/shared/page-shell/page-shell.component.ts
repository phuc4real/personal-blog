import { ChangeDetectionStrategy, Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { DOCUMENT, Location, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-page-shell',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './page-shell.component.html',
  styleUrl: './page-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageShellComponent {
  private location = inject(Location);
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);

  readonly currentTheme = signal<'dark' | 'light'>('dark');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        this.currentTheme.set(savedTheme);
        this.document.documentElement.setAttribute('data-theme', savedTheme);
      }
    }
  }

  toggleTheme(): void {
    if (isPlatformBrowser(this.platformId)) {
      const newTheme = this.currentTheme() === 'light' ? 'dark' : 'light';
      this.currentTheme.set(newTheme);
      this.document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    }
  }

  goBack(): void {
    this.location.back();
  }

  scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ 
        top: 0, 
        behavior: prefersReducedMotion ? 'auto' : 'smooth' 
      });
    }
  }
}
