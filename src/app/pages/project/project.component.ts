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
      </article>
    </app-page-shell>
  `,
  styles: `
    .page { max-width: var(--content-max); }

    .title {
      font-size: 34px;
      font-weight: 950;
      color: var(--neon-magenta);
      margin: 0 0 18px;
      letter-spacing: 0.8px;
      line-height: 1.2;
    }

    .text {
      font-size: 14px;
      line-height: 1.9;
      color: color-mix(in srgb, var(--neon-magenta) 80%, var(--text-white));
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
    }

    .link {
      color: var(--accent-cyan);
      text-decoration: underline;
      text-underline-offset: 3px;
      overflow-wrap: anywhere;
      font-weight: 800;
    }

    .link:hover {
      background: var(--neon-magenta);
      color: var(--bg-black);
    }

    .desc {
      margin: 8px 0 0;
      font-size: 14px;
      line-height: 1.8;
      color: color-mix(in srgb, var(--accent-cyan) 65%, var(--text-white));
    }
  `
})
export class ProjectComponent {
  readonly projects: readonly ProjectLink[] = [
    {
      name: 'pet-project-1',
      url: 'https://github.com/phuc4real/pet-project-1',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    },
    {
      name: 'pet-project-2',
      url: 'https://github.com/phuc4real/pet-project-2',
      description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    }
  ];
}
