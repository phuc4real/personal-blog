import { ChangeDetectionStrategy, Component, PLATFORM_ID, inject } from '@angular/core';
import { Location, isPlatformBrowser } from '@angular/common';
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

  goBack(): void {
    this.location.back();
  }

  scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
