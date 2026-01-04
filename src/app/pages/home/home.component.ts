import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageShellComponent } from '../../shared/page-shell/page-shell.component';
import { BlogService } from '../../shared/services/blog.service';

@Component({
  selector: 'app-home',
  imports: [PageShellComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-shell>
      <div class="home-content">
        <section class="whats-new" aria-label="whats-new">
          <h1 class="info-title">what's new</h1>
          <ul class="info-list" aria-label="Top posts">
            @for (post of topPosts(); track post.slug) {
              <li class="info-item">
                <a class="info-link" [routerLink]="['/post', post.slug]">{{ post.dateKey }} | {{ post.title }}</a>
              </li>
            }
          </ul>
        </section>

        <section class="article" aria-label="article events">
          <h2 class="article-title">new post</h2>

          @for (post of posts(); track post.slug; let isFirst = $first) {
            <article class="event" [id]="post.slug" aria-label="Event post">
              <p class="event-date">{{ formatDate(post.dateKey) }}</p>
              <h3 class="event-title">{{ post.title }}</h3>

              <div class="event-body">
                <p class="section-text event-paragraph">{{ post.preview }}</p>

                <a
                  class="more"
                  [routerLink]="['/post', post.slug]"
                  [attr.aria-label]="'Read more about ' + post.title"
                >
                  MORE
                </a>
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
      max-width: var(--content-max);
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
      cursor: pointer;
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
      max-width: var(--content-max);
      margin: 0 0 40px;
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
      display: inline-block;
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
      text-decoration: none;
    }

    .more:hover {
      background: var(--neon-magenta);
      color: var(--bg-black);
      border-color: var(--neon-magenta);
    }

    .post-blur {
      max-width: var(--content-max);
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
  private readonly blogService = inject(BlogService);

  readonly posts = this.blogService.posts;

  readonly topPosts = computed(() => 
    [...this.posts()]
      .sort((a, b) => b.dateKey.localeCompare(a.dateKey))
      .slice(0, 3)
  );

  formatDate(dateKey: string): string {
    if (dateKey.length !== 8) return dateKey;
    const year = dateKey.slice(0, 4);
    const month = dateKey.slice(4, 6);
    const day = dateKey.slice(6, 8);
    return `${year}.${month}.${day}`;
  }
}
