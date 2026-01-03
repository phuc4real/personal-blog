import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PageShellComponent } from '../../shared/page-shell/page-shell.component';

type BlogPost = {
  readonly slug: string;
  readonly title: string;
  readonly dateKey: string;
  readonly dateLabel: string;
  readonly imagePath: string;
  readonly imageAlt: string;
  readonly metaLines: readonly string[];
  readonly body: readonly string[];
};

@Component({
  selector: 'app-home',
  imports: [NgOptimizedImage, PageShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-shell>
      <div class="home-content">
        <section class="whats-new" aria-label="whats-new">
          <h1 class="info-title">what's new</h1>
          <ul class="info-list" aria-label="Top posts">
            @for (post of topPosts; track post.slug) {
              <li class="info-item">
                <a class="info-link" [attr.href]="'#' + post.slug">{{ post.dateKey }} | {{ post.title }}</a>
              </li>
            }
          </ul>
        </section>

        <section class="article" aria-label="article events">
          <h2 class="article-title">new post</h2>

          @for (post of posts; track post.slug) {
            <article class="event" [id]="post.slug" aria-label="Event post">
              <p class="event-date">{{ post.dateLabel }}</p>
              <h3 class="event-title">{{ post.title }}</h3>

              <figure class="event-poster">
                <img
                  [ngSrc]="post.imagePath"
                  width="300"
                  height="420"
                  [alt]="post.imageAlt"
                  [priority]="post.slug === 'neon-blast'"
                />
              </figure>

              <div class="event-body" [id]="'post-body-' + post.slug">
                @for (line of post.metaLines; track line) {
                  <p class="event-line">{{ line }}</p>
                }

                <div class="event-divider" aria-hidden="true"></div>

                @for (paragraph of bodyToRender(post); track paragraph) {
                  <p class="section-text event-paragraph">{{ paragraph }}</p>
                }

                @if (showMoreButton(post)) {
                  <button
                    class="more"
                    type="button"
                    (click)="expandPost(post.slug)"
                    [attr.aria-controls]="'post-body-' + post.slug"
                    [attr.aria-expanded]="isExpanded(post.slug)"
                  >
                    MORE
                  </button>
                }
              </div>
            </article>

            <div class="post-blur" aria-hidden="true"></div>
          }
        </section>
      </div>
    </app-page-shell>
  `,
  styles: [`
    .home-content {
      color: var(--text-white);
      padding: 0;
    }

    .whats-new {
      border: 1px solid color-mix(in srgb, var(--purple-muted) 80%, transparent);
      padding: 10px 16px;
      max-width: 520px;
      margin: 0 0 26px;
    }

    .info-title {
      font-size: 14px;
      letter-spacing: 0.88px;
      text-transform: lowercase;
      font-weight: 900;
      color: var(--neon-magenta);
      margin: 0 0 4px;
    }

    .info-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: 6px;
    }

    .info-link {
      color: color-mix(in srgb, var(--neon-magenta) 85%, var(--text-white));
      font-size: 11px;
      letter-spacing: 0.3px;
    }

    .info-link:hover {
      background: var(--neon-magenta);
      color: var(--bg-black);
    }

    .article-title {
      font-size: 16px;
      font-weight: 900;
      letter-spacing: 0.9px;
      text-transform: lowercase;
      color: var(--neon-magenta);
      margin: 0 0 14px;
    }

    .event {
      max-width: 520px;
      margin: 0 0 40px;
    }

    .event:last-child {
      margin-bottom: 0;
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

    .more {
      margin-top: 10px;
      border: 1px solid color-mix(in srgb, var(--divider) 80%, transparent);
      background: transparent;
      color: var(--purple-muted);
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 1px;
      padding: 8px 12px;
      cursor: pointer;
      text-transform: uppercase;
    }

    .more:hover {
      background: var(--neon-magenta);
      color: var(--bg-black);
      border-color: var(--neon-magenta);
    }

    .post-blur {
      max-width: 520px;
      height: 1px;
      margin: 12px 0 24px;
      background: linear-gradient(
        90deg,
        transparent,
        color-mix(in srgb, var(--neon-magenta) 70%, var(--divider)),
        transparent
      );
      filter: blur(0.7px);
      opacity: 0.9;
    }

    .event-line {
      margin: 0 0 4px;
      font-size: 12px;
      letter-spacing: 0.4px;
      color: color-mix(in srgb, var(--neon-magenta) 85%, var(--text-white));
    }

    .event-divider {
      height: 1px;
      margin: 10px 0 12px;
      background: color-mix(in srgb, var(--divider) 70%, transparent);
    }

    .event-paragraph {
      margin-bottom: 12px;
    }

    .section {
      margin-bottom: 50px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .section-title {
      font-size: 34px;
      font-weight: 950;
      color: var(--neon-magenta);
      margin-bottom: 24px;
      line-height: 1.2;
      letter-spacing: 0.8px;
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
export class HomeComponent {
  private readonly previewParagraphCount = 2;
  private readonly expandedSlugs = signal<ReadonlySet<string>>(new Set());

  readonly posts: readonly BlogPost[] = [
    {
      slug: 'neon-blast',
      title: 'Neon Blast',
      dateKey: '20260104',
      dateLabel: '2026.01.04',
      imagePath: 'assets/poster.svg',
      imageAlt: 'Event poster placeholder with neon styling',
      metaLines: [
        'OPEN: 15:00  /  CLOSE: 21:00',
        'DOOR: ¥1300 + 1Drink',
        'DJs: Lorem / Ipsum / Dolor / Sit',
      ],
      body: [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.',
        'Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris.',
        'Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla.',
        'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
      ]
    },
    {
      slug: 'purple-shift',
      title: 'Purple Shift',
      dateKey: '20260102',
      dateLabel: '2026.01.02',
      imagePath: 'assets/poster.svg',
      imageAlt: 'Event poster placeholder with neon styling',
      metaLines: [
        'OPEN: 18:00  /  CLOSE: 23:00',
        'DOOR: ¥1500 + 1Drink',
        'LIVE: Consectetur / Adipiscing',
      ],
      body: [
        'Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
        'Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh.',
      ]
    },
    {
      slug: 'midnight-arcade',
      title: 'Midnight Arcade',
      dateKey: '20251229',
      dateLabel: '2025.12.29',
      imagePath: 'assets/poster.svg',
      imageAlt: 'Event poster placeholder with neon styling',
      metaLines: [
        'OPEN: 20:00  /  CLOSE: 02:00',
        'DOOR: ¥1200 + 1Drink',
        'GUESTS: Amet / Elit / Nisi',
      ],
      body: [
        'Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.',
        'Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa.',
        'Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra.',
        'Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh.',
        'Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem.',
        'Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa.',
      ]
    }
  ];

  readonly topPosts: readonly BlogPost[] = [...this.posts]
    .sort((a, b) => b.dateKey.localeCompare(a.dateKey))
    .slice(0, 3);

  isExpanded(slug: string): boolean {
    return this.expandedSlugs().has(slug);
  }

  showMoreButton(post: BlogPost): boolean {
    return post.body.length > this.previewParagraphCount && !this.isExpanded(post.slug);
  }

  expandPost(slug: string): void {
    this.expandedSlugs.update((previous) => {
      const next = new Set(previous);
      next.add(slug);
      return next;
    });
  }

  bodyToRender(post: BlogPost): readonly string[] {
    return this.isExpanded(post.slug) ? post.body : post.body.slice(0, this.previewParagraphCount);
  }
}
