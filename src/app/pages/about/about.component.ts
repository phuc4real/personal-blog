import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageShellComponent } from '../../shared/page-shell/page-shell.component';

@Component({
  selector: 'app-about',
  imports: [PageShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-shell>
      <article class="page">
        <h1 class="title">about me</h1>
        <p class="text">
          Hi, I’m <strong class="accent">Phuc Le</strong>. This is my personal blog — notes on building,
          learning, and shipping.
        </p>

        <h2 class="subtitle">what you’ll find here</h2>
        <ul class="list">
          <li class="item">Short write-ups on projects</li>
          <li class="item">Frontend experiments (Angular, UI, accessibility)</li>
          <li class="item">Learning notes and references</li>
        </ul>

        <p class="text dim">Last updated: 2026-01-02</p>
      </article>
    </app-page-shell>
  `,
  styles: `
    .page { max-width: 520px; }
    .title {
      font-size: 34px;
      font-weight: 950;
      color: var(--neon-magenta);
      margin: 0 0 18px;
      letter-spacing: 0.8px;
      line-height: 1.2;
    }
    .subtitle {
      font-size: 18px;
      font-weight: 800;
      color: var(--neon-magenta);
      margin: 22px 0 10px;
      letter-spacing: 0.4px;
    }
    .text {
      font-size: 14px;
      line-height: 1.9;
      color: color-mix(in srgb, var(--neon-magenta) 80%, var(--text-white));
      margin: 0 0 14px;
    }
    .text.dim { color: var(--text-dim); }
    .accent { color: var(--purple-muted); }
    .list { padding-left: 18px; margin: 0; }
    .item {
      font-size: 14px;
      line-height: 1.9;
      color: color-mix(in srgb, var(--neon-magenta) 75%, var(--text-white));
      margin: 6px 0;
    }
  `
})
export class AboutComponent {}
