import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
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
        @if (showWelcome()) {
          <div class="welcome-banner" role="banner">
            <div class="welcome-content">
              <h2 class="welcome-title">welcome to the lab</h2>
              <p class="welcome-text">
                A digital workshop for tech experiments, project notes, learning references, and personal thoughts on tech & anime.
                <br>
                Lo-fi cyberpunk vibes, playful minimal design.
              </p>
              <div class="welcome-actions">
                <a class="welcome-link" routerLink="/about">
                  More about this space
                </a>
              </div>
            </div>
            <button 
              class="welcome-dismiss" 
              type="button" 
              (click)="dismissWelcome()"
              aria-label="Dismiss welcome message"
            >
              ✕
            </button>
          </div>
        }

        @if (loadingState() === 'loading') {
          <div role="status" aria-live="polite" class="loading-state">
            <p class="loading-text">Loading posts...</p>
          </div>
        }

        @if (loadingState() === 'error') {
          <div role="alert" aria-live="assertive" class="error-state">
            <h2 class="error-title">Failed to load posts</h2>
            <p class="error-message">{{ error() }}</p>
            <button class="retry-button" (click)="retry()" type="button">
              Try Again
            </button>
          </div>
        }

        @if (loadingState() === 'success') {
          @if (posts().length === 0) {
            <div class="empty-state">
              <div class="empty-icon" aria-hidden="true">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="9" y1="9" x2="15" y2="9" />
                  <line x1="9" y1="13" x2="15" y2="13" />
                  <line x1="9" y1="17" x2="12" y2="17" />
                </svg>
              </div>
              <h2 class="empty-title">content incoming</h2>
              <p class="empty-message">
                Blog posts, project write-ups, tech experiments, and anime thoughts will appear here.
              </p>
              <div class="empty-actions">
                <a class="empty-link" routerLink="/about">
                  Learn what this is about
                </a>
                <span class="empty-separator" aria-hidden="true">|</span>
                <a class="empty-link" routerLink="/contact">
                  Get in touch
                </a>
              </div>
            </div>
          } @else {
            <section class="whats-new" aria-label="whats-new">
              <h1 class="info-title">what's new</h1>
              <ul class="info-list" aria-label="Top posts">
                @for (post of topPosts(); track post.slug) {
                  <li class="info-item">
                    <a class="info-link" [routerLink]="['/post', post.slug]">
                      <span class="info-date">{{ post.dateKey }}</span>
                      <span class="info-separator"> | </span>
                      <span class="info-post-title">{{ post.title }}</span>
                    </a>
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

            <aside class="discover-more" aria-label="Explore more content">
              <p class="discover-text">Explore more:</p>
              <nav class="discover-nav">
                <a class="discover-link" routerLink="/project">
                  <span class="discover-label">projects</span>
                  <span class="discover-desc">pet projects & experiments</span>
                </a>
                <a class="discover-link" routerLink="/about">
                  <span class="discover-label">about</span>
                  <span class="discover-desc">what this space is about</span>
                </a>
                <a class="discover-link" routerLink="/contact">
                  <span class="discover-label">contact</span>
                  <span class="discover-desc">reach out & connect</span>
                </a>
              </nav>
            </aside>
          }
        }
      </div>
    </app-page-shell>
  `,
  styles: [`
    .home-content {
      color: var(--text-white);
      padding: 0;
    }

    .welcome-banner {
      position: relative;
      max-width: var(--content-max);
      margin: 0 0 var(--space-10);
      padding: var(--space-7) var(--space-6);
      border: 1px solid var(--neon-magenta);
      background: linear-gradient(
        135deg,
        var(--bg-magenta-subtle),
        var(--bg-cyan-subtle)
      );
      box-shadow: 0 0 20px var(--glow-purple-ambient);
    }

    .welcome-content {
      padding-right: var(--space-8);
    }

    .welcome-title {
      font-size: 18px;
      font-weight: 950;
      color: var(--neon-magenta);
      margin: 0 0 var(--space-3);
      letter-spacing: 0.8px;
      text-transform: lowercase;
    }

    .welcome-text {
      font-size: 14px;
      line-height: 1.7;
      color: var(--text-magenta-medium);
      margin: 0 0 var(--space-5);
    }

    .welcome-actions {
      display: flex;
      gap: var(--space-4);
    }

    .welcome-link {
      color: var(--accent-cyan);
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.4px;
      text-decoration: underline;
      text-underline-offset: 3px;
      transition: color var(--dur-ambient) var(--ease-atmospheric),
                  background-color var(--dur-ambient) var(--ease-atmospheric),
                  box-shadow var(--dur-ambient) var(--ease-atmospheric);
    }

    .welcome-link:hover,
    .welcome-link:focus-visible {
      background: var(--accent-cyan);
      color: var(--bg-black);
      text-decoration: none;
      box-shadow: 0 0 12px var(--glow-cyan);
    }

    .welcome-dismiss {
      position: absolute;
      top: var(--space-4);
      right: var(--space-4);
      width: 44px;
      height: 44px;
      border: 1px solid var(--purple-muted);
      background: transparent;
      color: var(--purple-muted);
      font-size: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color var(--dur-ambient) var(--ease-atmospheric),
                  background-color var(--dur-ambient) var(--ease-atmospheric),
                  border-color var(--dur-ambient) var(--ease-atmospheric),
                  transform var(--dur-ambient) var(--ease-atmospheric);
    }

    .welcome-dismiss:hover,
    .welcome-dismiss:focus-visible {
      background: var(--neon-magenta);
      color: var(--bg-black);
      border-color: var(--neon-magenta);
      transform: scale(1.1);
    }

    .whats-new {
      border: 1px solid var(--border-purple-soft);
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
      color: var(--text-magenta-bright);
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
      color: var(--text-magenta-soft);
      letter-spacing: 0.6px;
    }

    .event-title {
      margin: 0 0 14px;
      font-size: clamp(1.75rem, 4vw + 1rem, 2.125rem); /* Fluid 28px-34px */
      font-weight: 950;
      color: var(--neon-magenta);
      line-height: 1.1;
      letter-spacing: 0.8px;
    }

    .event-poster {
      margin: 0 0 14px;
      border: 1px solid var(--border-divider-soft);
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
      border: 1px solid var(--border-divider-strong);
      background: transparent;
      color: var(--purple-muted);
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 1px;
      padding: 8px 12px;
      cursor: pointer;
      text-transform: uppercase;
      text-decoration: none;
      min-height: 44px;
      transition: color var(--dur-ambient) var(--ease-atmospheric),
                  background-color var(--dur-ambient) var(--ease-atmospheric),
                  border-color var(--dur-ambient) var(--ease-atmospheric),
                  box-shadow var(--dur-ambient) var(--ease-atmospheric);
    }

    .more:hover,
    .more:focus-visible {
      background: var(--neon-magenta);
      color: var(--bg-black);
      border-color: var(--neon-magenta);
      box-shadow: 0 0 12px var(--glow-magenta);
    }

    .post-blur {
      max-width: var(--content-max);
      height: 1px;
      margin: 12px 0 24px;
      background: linear-gradient(
        90deg,
        transparent,
        var(--text-magenta-soft),
        transparent
      );
      filter: blur(0.7px);
      opacity: 0.9;
    }

    .event-line {
      margin: 0 0 4px;
      font-size: 12px;
      letter-spacing: 0.4px;
      color: var(--text-magenta-bright);
    }

    .event-divider {
      height: 1px;
      margin: 10px 0 12px;
      background: var(--divider-muted);
    }

    .event-paragraph {
      margin-bottom: 12px;
    }

    .section-text {
      font-size: 14px;
      line-height: 1.9;
      color: var(--text-magenta-medium);
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

    /* State styles */
    .loading-state,
    .error-state,
    .empty-state {
      max-width: var(--content-max);
      padding: var(--space-11) var(--space-6);
      text-align: center;
    }

    .loading-text {
      color: var(--text-magenta-medium);
      font-size: 14px;
      animation: pulse 1.5s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    @media (prefers-reduced-motion: reduce) {
      .loading-text {
        animation: none;
      }
    }

    .error-title,
    .empty-title {
      font-size: clamp(1.5rem, 3vw + 1rem, 1.875rem);
      font-weight: 950;
      color: var(--neon-magenta);
      margin: 0 0 12px;
      letter-spacing: 0.6px;
      text-transform: lowercase;
    }

    .error-message,
    .empty-message {
      color: var(--text-magenta-medium);
      font-size: 14px;
      line-height: 1.7;
      margin: 0 0 18px;
    }

    .empty-state {
      border: 1px solid var(--border-purple-soft);
      background: linear-gradient(
        135deg,
        var(--bg-purple-subtle),
        transparent
      );
      padding: var(--space-12);
    }

    .empty-icon {
      color: var(--purple-muted);
      margin: 0 0 var(--space-7);
      opacity: 0.6;
    }

    .empty-actions {
      display: flex;
      gap: var(--space-4);
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
    }

    .empty-link {
      color: var(--accent-cyan);
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.4px;
      text-decoration: underline;
      text-underline-offset: 3px;
      transition: color var(--dur-ambient) var(--ease-atmospheric),
                  background-color var(--dur-ambient) var(--ease-atmospheric),
                  box-shadow var(--dur-ambient) var(--ease-atmospheric);
    }

    .empty-link:hover,
    .empty-link:focus-visible {
      background: var(--neon-magenta);
      color: var(--bg-black);
      text-decoration: none;
      box-shadow: 0 0 12px var(--glow-magenta);
    }

    .empty-separator {
      color: var(--purple-muted);
      font-size: 12px;
    }

    .retry-button {
      display: inline-block;
      border: 1px solid var(--purple-muted);
      background: transparent;
      color: var(--purple-muted);
      font-size: 12px;
      font-weight: 900;
      letter-spacing: 1px;
      padding: 10px 16px;
      cursor: pointer;
      text-transform: uppercase;
      min-height: 44px;
      transition: color var(--dur-ambient) var(--ease-atmospheric),
                  background-color var(--dur-ambient) var(--ease-atmospheric),
                  border-color var(--dur-ambient) var(--ease-atmospheric),
                  box-shadow var(--dur-ambient) var(--ease-atmospheric);
    }

    .retry-button:hover,
    .retry-button:focus-visible {
      background: var(--neon-magenta);
      color: var(--bg-black);
      border-color: var(--neon-magenta);
      box-shadow: 0 0 12px var(--glow-magenta);
    }

    .retry-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Text overflow handling */
    .info-post-title,
    .event-title {
      overflow-wrap: break-word;
      word-wrap: break-word;
      hyphens: auto;
    }

    .info-separator {
      user-select: none;
    }

    /* Discover more section */
    .discover-more {
      max-width: var(--content-max);
      margin: var(--space-12) 0 0;
      padding: var(--space-7);
      border: 1px solid var(--border-purple-soft);
      background: linear-gradient(
        135deg,
        var(--bg-cyan-subtle),
        transparent
      );
    }

    .discover-text {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.6px;
      text-transform: uppercase;
      color: var(--purple-muted);
      margin: 0 0 var(--space-5);
    }

    .discover-nav {
      display: grid;
      gap: var(--space-3);
    }

    .discover-link {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: var(--space-3) var(--space-4);
      border-left: 2px solid var(--purple-muted);
      transition: border-color var(--dur-ambient) var(--ease-atmospheric),
                  background-color var(--dur-ambient) var(--ease-atmospheric),
                  transform var(--dur-ambient) var(--ease-atmospheric);
    }

    .discover-link:hover,
    .discover-link:focus-visible {
      border-left-color: var(--neon-magenta);
      background: var(--bg-magenta-subtle);
      transform: translateX(4px);
    }

    .discover-label {
      font-size: 14px;
      font-weight: 800;
      color: var(--accent-cyan);
      letter-spacing: 0.4px;
    }

    .discover-desc {
      font-size: 12px;
      color: var(--text-magenta-medium);
      letter-spacing: 0.2px;
    }
  `]
})
export class HomeComponent {
  private readonly blogService = inject(BlogService);
  private readonly WELCOME_DISMISSED_KEY = 'welcome-banner-dismissed';

  readonly posts = this.blogService.posts;
  readonly loadingState = this.blogService.loadingState;
  readonly error = this.blogService.error;
  readonly showWelcome = signal(this.shouldShowWelcome());

  readonly topPosts = computed(() => 
    [...this.posts()]
      .sort((a, b) => b.dateKey.localeCompare(a.dateKey))
      .slice(0, 3)
  );

  private shouldShowWelcome(): boolean {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return false;
    }
    return !localStorage.getItem(this.WELCOME_DISMISSED_KEY);
  }

  dismissWelcome(): void {
    this.showWelcome.set(false);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.WELCOME_DISMISSED_KEY, 'true');
    }
  }

  formatDate(dateKey: string): string {
    if (dateKey.length !== 8) return dateKey;
    const year = dateKey.slice(0, 4);
    const month = dateKey.slice(4, 6);
    const day = dateKey.slice(6, 8);
    return `${year}.${month}.${day}`;
  }

  retry(): void {
    this.blogService.retryLoadPosts();
  }
}
