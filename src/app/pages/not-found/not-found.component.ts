import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageShellComponent } from '../../shared/page-shell/page-shell.component';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-not-found',
  imports: [PageShellComponent, RouterLink, RevealOnScrollDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-shell>
      <article class="not-found">
        <h1 class="title" appRevealOnScroll>404</h1>
        <p class="subtitle" appRevealOnScroll [revealDelay]="80">Page not found</p>
        <p class="text" appRevealOnScroll [revealDelay]="140">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <nav class="nav-links" aria-label="Navigation options" appRevealOnScroll [revealDelay]="200">
          <a class="link" routerLink="/">back to home</a>
          <a class="link" routerLink="/about">about</a>
          <a class="link" routerLink="/project">projects</a>
          <a class="link" routerLink="/contact">contact</a>
        </nav>
      </article>
    </app-page-shell>
  `,
  styles: `
    .not-found {
      max-width: var(--content-max);
      padding: var(--space-11) 0;
      text-align: center;
    }

    .title {
      font-size: clamp(4rem, 10vw + 2rem, 8rem);
      font-weight: 950;
      color: var(--neon-magenta);
      margin: 0 0 var(--space-6);
      letter-spacing: 2px;
      line-height: 1;
      opacity: 0.8;
    }

    .subtitle {
      font-size: clamp(1.5rem, 3vw + 1rem, 2rem);
      font-weight: 900;
      color: var(--purple-muted);
      margin: 0 0 var(--space-7);
      letter-spacing: 0.8px;
      text-transform: lowercase;
    }

    .text {
      font-size: var(--text-sm);
      line-height: 1.7;
      color: var(--text-magenta-medium);
      margin: 0 0 var(--space-11);
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
      overflow-wrap: break-word;
    }

    .nav-links {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-4);
      justify-content: center;
      align-items: center;
    }

    .link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--purple-muted);
      background: transparent;
      color: var(--purple-muted);
      font-size: var(--text-xs);
      font-weight: 900;
      letter-spacing: 0.8px;
      padding: var(--space-3) var(--space-6);
      min-height: 44px;
      text-decoration: none;
      text-transform: lowercase;
      transition: color var(--dur-ambient) var(--ease-atmospheric),
                  background-color var(--dur-ambient) var(--ease-atmospheric),
                  border-color var(--dur-ambient) var(--ease-atmospheric),
                  box-shadow var(--dur-ambient) var(--ease-atmospheric),
                  transform var(--dur-ambient) var(--ease-atmospheric);
    }

    .link:hover,
    .link:focus-visible {
      background: var(--neon-magenta);
      color: var(--bg-black);
      border-color: var(--neon-magenta);
      box-shadow: 0 0 12px var(--glow-magenta);
      transform: translateY(-1px);
    }

    .link:active {
      transform: translateY(0);
    }

    @media (max-width: 480px) {
      .nav-links {
        flex-direction: column;
        width: 100%;
      }

      .link {
        width: 100%;
        max-width: 280px;
      }
    }
  `
})
export class NotFoundComponent {}
