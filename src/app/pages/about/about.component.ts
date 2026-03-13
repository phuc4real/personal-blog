import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageShellComponent } from '../../shared/page-shell/page-shell.component';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-about',
  imports: [PageShellComponent, RevealOnScrollDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-shell>
      <article class="page">
        <h1 class="title" appRevealOnScroll>about me</h1>
        <p class="text" appRevealOnScroll [revealDelay]="70">
          Hi, I’m <strong class="accent">Phuc Le</strong>. This is my personal blog — notes on building,
          learning, and shipping.
        </p>

        <h2 class="subtitle" appRevealOnScroll [revealDelay]="120">what you’ll find here</h2>
        <ul class="list" appRevealOnScroll [revealDelay]="180" [revealDistance]="'20px'">
          <li class="item">Short write-ups on projects</li>
          <li class="item">Learning notes and references</li>
          <li class="item">New tech experiments</li>
          <li class="item">My personal anime thoughts, and reviews</li>
          <li class="item">Random thoughts</li>
          <li class="item">And more...</li>
        </ul>

        <p class="text dim" appRevealOnScroll [revealDelay]="240">Last updated: 2026-01-02</p>
      </article>
    </app-page-shell>
  `,
  styles: `
    .page { max-width: var(--content-max); }
    .title {
      font-size: clamp(1.75rem, 4vw + 1rem, 2.125rem);
      font-weight: 950;
      color: var(--neon-magenta);
      margin: 0 0 var(--space-7);
      letter-spacing: 0.8px;
      line-height: 1.2;
    }
    .subtitle {
      font-size: var(--text-lg);
      font-weight: 800;
      color: var(--neon-magenta);
      margin: var(--space-8) 0 var(--space-3);
      letter-spacing: 0.4px;
    }
    .text {
      font-size: var(--text-sm);
      line-height: 1.9;
      color: var(--text-magenta-medium);
      margin: 0 0 var(--space-5);
      overflow-wrap: break-word;
      word-wrap: break-word;
    }
    .text.dim { color: var(--text-dim); }
    .accent { color: var(--purple-muted); }
    .list { padding-left: var(--space-7); margin: 0; }
    .item {
      font-size: var(--text-sm);
      line-height: 1.9;
      color: var(--text-magenta-list);
      margin: var(--space-1) 0;
      overflow-wrap: break-word;
      word-wrap: break-word;
      transition: transform var(--dur-fast) var(--ease-atmospheric),
                  color var(--dur-fast) var(--ease-atmospheric);
    }

    .item:hover {
      color: var(--neon-magenta);
      transform: translateX(2px);
    }
  `
})
export class AboutComponent {}
