import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { PageShellComponent } from '../../shared/page-shell/page-shell.component';
import { BlogService } from '../../shared/services/blog.service';
import type { BlogPost } from '../../shared/utils/markdown';

@Component({
  selector: 'app-post-detail',
  imports: [PageShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-shell>
      @if (post(); as post) {
        <article class="event" [id]="post.slug" aria-label="Event post">
          <p class="event-date">{{ formatDate(post.dateKey) }}</p>
          <h1 class="event-title">{{ post.title }}</h1>

          <div class="event-body">
            @for (paragraph of parseBody(post.body); track paragraph) {
              <p class="section-text event-paragraph">{{ paragraph }}</p>
            }
          </div>
        </article>
      } @else {
        <p class="section-text">Loading...</p>
      }
    </app-page-shell>
  `,
  styles: [`
    .event {
      max-width: var(--content-max);
      margin: 0 0 40px;
      color: var(--text-white);
    }

    .event-date {
      margin: 0 0 6px;
      font-size: 12px;
      color: color-mix(in srgb, var(--neon-magenta) 70%, var(--purple-muted));
      letter-spacing: 0.6px;
    }

    .event-title {
      margin: 0 0 14px;
      font-size: 34px;
      font-weight: 950;
      color: var(--neon-magenta);
      line-height: 1.1;
      letter-spacing: 0.8px;
    }

    .event-poster {
      margin: 0 0 14px;
      border: 1px solid color-mix(in srgb, var(--divider) 70%, transparent);
      background: var(--bg-black);
    }

    .event-poster img {
      display: block;
      width: 100%;
      height: auto;
    }

    .event-body {
      font-size: 14px;
    }

    .event-paragraph {
      margin-bottom: 12px;
    }

    .section-text {
      font-size: 14px;
      line-height: 1.9;
      color: color-mix(in srgb, var(--neon-magenta) 80%, var(--text-white));
      margin-bottom: 16px;
    }

    @media (max-width: 768px) {
      .event-title {
        font-size: 26px;
      }
      .whats-new {
        padding: 10px 12px;
      }
      .event-body {
        font-size: 14px;
      }
    }
  `]
})
export class PostDetailComponent {
  private readonly blogService = inject(BlogService);
  
  readonly slug = input.required<string>();
  readonly post = signal<BlogPost | null>(null);

  constructor() {
    effect(() => {
      const currentSlug = this.slug();
      this.blogService.getPostBySlug(currentSlug).then(
        (post) => this.post.set(post)
      );
    });
  }

  formatDate(dateKey: string): string {
    if (dateKey.length !== 8) return dateKey;
    const year = dateKey.slice(0, 4);
    const month = dateKey.slice(4, 6);
    const day = dateKey.slice(6, 8);
    return `${year}.${month}.${day}`;
  }

  parseBody(body: string): readonly string[] {
    return body.split('\n\n').filter(p => p.trim());
  }
}