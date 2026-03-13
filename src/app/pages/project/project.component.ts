import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageShellComponent } from '../../shared/page-shell/page-shell.component';

type ProjectLink = {
  readonly name: string;
  readonly url: string;
  readonly description: string;
};

@Component({
  selector: 'app-project',
  imports: [PageShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-shell>
      <article class="page">
        <h1 class="title">project</h1>

        <p class="text">
          a few pet projects I’m building. Links go to GitHub.
        </p>

        @if (projects.length > 0) {
          <ul class="list" aria-label="Project links">
            @for (project of projects; track project.url) {
              <li class="item">
                <a class="link" [href]="project.url" target="_blank" rel="noopener">
                  {{ project.name }}
                </a>
                <p class="desc">{{ project.description }}</p>
              </li>
            }
          </ul>
        } @else {
          <div class="empty-state">
            <div class="empty-icon" aria-hidden="true">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <h2 class="empty-title">projects loading</h2>
            <p class="empty-message">
              Currently cooking up some experiments.
              <br>
              Check back soon to see what's brewing in the lab.
            </p>
          </div>
        }
      </article>
    </app-page-shell>
  `,
  styles: `
    .page { max-width: var(--content-max); }

    .title {
      font-size: clamp(1.75rem, 4vw + 1rem, 2.125rem); /* Fluid 28px-34px */
      font-weight: 950;
      color: var(--neon-magenta);
      margin: 0 0 18px;
      letter-spacing: 0.8px;
      line-height: 1.2;
    }

    .text {
      font-size: 14px;
      line-height: 1.9;
      color: var(--text-magenta-medium);
      margin: 0 0 14px;
    }

    .list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: 12px;
    }

    .item {
      border: 1px solid var(--purple-muted);
      padding: 12px;
      transition: border-color var(--dur-ambient) var(--ease-atmospheric);
    }

    .item:hover {
      border-color: var(--neon-magenta);
    }

    .link {
      color: var(--accent-cyan);
      text-decoration: underline;
      text-underline-offset: 3px;
      overflow-wrap: break-word;
      word-wrap: break-word;
      font-weight: 800;
      transition: color var(--dur-ambient) var(--ease-atmospheric),
                  background-color var(--dur-ambient) var(--ease-atmospheric),
                  box-shadow var(--dur-ambient) var(--ease-atmospheric);
    }

    .link:hover,
    .link:focus-visible {
      background: var(--neon-magenta);
      color: var(--bg-black);
      box-shadow: 0 0 12px var(--glow-magenta);
    }

    .desc {
      margin: 8px 0 0;
      font-size: 14px;
      line-height: 1.8;
      color: var(--text-cyan-medium);
      overflow-wrap: break-word;
      word-wrap: break-word;
      hyphens: auto;
    }

    .empty-state {
      text-align: center;
      padding: var(--space-12) var(--space-6);
      border: 1px solid var(--border-purple-soft);
      background: linear-gradient(
        135deg,
        var(--bg-purple-subtle),
        transparent
      );
      margin-top: var(--space-7);
    }

    .empty-icon {
      color: var(--purple-muted);
      margin: 0 0 var(--space-6);
      opacity: 0.6;
    }

    .empty-title {
      font-size: clamp(1.25rem, 2vw + 1rem, 1.5rem);
      font-weight: 950;
      color: var(--neon-magenta);
      margin: 0 0 var(--space-4);
      letter-spacing: 0.6px;
      text-transform: lowercase;
    }

    .empty-message {
      color: var(--text-magenta-medium);
      font-size: 14px;
      line-height: 1.7;
      margin: 0;
    }
  `
})
export class ProjectComponent {
  readonly projects: readonly ProjectLink[] = [
    {
      name: 'personal-blog',
      url: 'https://github.com/phuc4real/personal-blog',
      description: 'A minimal, cyberpunk-themed personal blog built with Angular 19+. Features markdown-based posts, dark/light mode toggle, and optimized performance.'
    }
  ];
}
