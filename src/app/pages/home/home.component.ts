import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageShellComponent } from '../../shared/page-shell/page-shell.component';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';
import { BlogService } from '../../shared/services/blog.service';

@Component({
  selector: 'app-home',
  imports: [PageShellComponent, RouterLink, RevealOnScrollDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-shell>
      <div class="home-content">
        @if (showWelcome()) {
          <div class="welcome-banner motion-scan" role="banner" appRevealOnScroll [revealDistance]="'24px'">
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
            <div class="empty-state" appRevealOnScroll [revealDelay]="120">
              <div class="empty-icon motion-float" aria-hidden="true">
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
            <section class="whats-new" aria-label="What's new" appRevealOnScroll [revealDelay]="80">
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
                <article class="event" [id]="post.slug" [attr.aria-label]="'Post: ' + post.title" appRevealOnScroll [revealDelay]="140 + ($index * 70)">
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

            <aside class="discover-more" aria-label="Explore more content" appRevealOnScroll [revealDelay]="220">
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
      font-size: var(--text-lg);
      font-weight: 950;
      color: var(--neon-magenta);
      margin: 0 0 var(--space-3);
      letter-spacing: 0.8px;
      text-transform: lowercase;
    }

    .welcome-text {
      font-size: var(--text-sm);
      line-height: 1.7;
      color: var(--text-magenta-medium);
      margin: 0 0 var(--space-5);
      overflow-wrap: break-word;
    }

    .welcome-actions {
      display: flex;
      gap: var(--space-4);
      align-items: center;
    }

    .welcome-link {
      color: var(--accent-cyan);
      font-size: var(--text-xs);
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
      font-size: var(--text-md);
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
      padding: var(--space-3) var(--space-6);
      max-width: var(--content-max);
      margin: 0 0 var(--space-10);
    }

    .info-title {
      font-size: var(--text-sm);
      letter-spacing: 0.88px;
      text-transform: lowercase;
      font-weight: 900;
      color: var(--neon-magenta);
      margin: 0 0 var(--space-1);
    }

    .info-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: var(--space-1);
    }

    .info-link {
      color: var(--text-magenta-bright);
      font-size: var(--text-xs);
      letter-spacing: 0.3px;
      cursor: pointer;
      display: block;
      padding: var(--space-1) var(--space-2);
    }

    .info-link:hover,
    .info-link:focus-visible {
      background: var(--neon-magenta);
      color: var(--bg-black);
    }

    .info-item {
      transition: transform var(--dur-fast) var(--ease-atmospheric);
    }

    .info-item:hover {
      transform: translateX(2px);
    }

    @media (pointer: coarse) {
      .info-link {
        min-height: 44px;
        display: flex;
        align-items: center;
        padding: var(--space-2) var(--space-2);
      }
    }

    .article-title {
      font-size: var(--text-md);
      font-weight: 900;
      letter-spacing: 0.9px;
      text-transform: lowercase;
      color: var(--neon-magenta);
      margin: 0 0 var(--space-5);
    }

    .event {
      transform-origin: top left;
    }

    .more {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-top: var(--space-3);
      border: 1px solid var(--border-divider-strong);
      background: transparent;
      color: var(--purple-muted);
      font-size: var(--text-xs);
      font-weight: 900;
      letter-spacing: 1px;
      padding: var(--space-2) var(--space-4);
      cursor: pointer;
      text-transform: uppercase;
      text-decoration: none;
      min-height: 44px;
      transition: color var(--dur-ambient) var(--ease-atmospheric),
                  background-color var(--dur-ambient) var(--ease-atmospheric),
                  border-color var(--dur-ambient) var(--ease-atmospheric),
                  box-shadow var(--dur-ambient) var(--ease-atmospheric),
                  transform var(--dur-ambient) var(--ease-atmospheric);
    }

    .more:hover,
    .more:focus-visible {
      background: var(--neon-magenta);
      color: var(--bg-black);
      border-color: var(--neon-magenta);
      box-shadow: 0 0 12px var(--glow-magenta);
      transform: translateY(-1px);
    }

    .more:active {
      transform: translateY(0);
    }

    .post-blur {
      max-width: var(--content-max);
      height: 1px;
      margin: var(--space-4) 0 var(--space-9);
      background: linear-gradient(
        90deg,
        transparent,
        var(--text-magenta-soft),
        transparent
      );
      filter: blur(0.7px);
      opacity: 0.9;
    }

    .info-post-title {
      overflow-wrap: break-word;
      hyphens: auto;
    }

    .info-separator {
      user-select: none;
    }

    @media (max-width: 768px) {
      .whats-new {
        padding: var(--space-3) var(--space-4);
      }
    }

    @media (max-width: 360px) {
      .welcome-banner {
        padding: var(--space-5) var(--space-4);
      }

      .welcome-content {
        padding-right: var(--space-11);
      }

      .discover-more {
        padding: var(--space-5);
      }
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
      font-size: var(--text-xs);
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
      font-size: var(--text-xs);
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
      font-size: var(--text-xs);
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
      min-height: 44px;
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

    .discover-link:active {
      transform: translateX(2px);
    }

    .discover-label {
      font-size: var(--text-sm);
      font-weight: 800;
      color: var(--accent-cyan);
      letter-spacing: 0.4px;
    }

    .discover-desc {
      font-size: var(--text-xs);
      color: var(--text-magenta-medium);
      letter-spacing: 0.2px;
      overflow-wrap: break-word;
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
    if (!dateKey || dateKey.length !== 8) return dateKey || '';
    const year = dateKey.slice(0, 4);
    const month = dateKey.slice(4, 6);
    const day = dateKey.slice(6, 8);
    return `${year}.${month}.${day}`;
  }

  retry(): void {
    this.blogService.retryLoadPosts();
  }
}
