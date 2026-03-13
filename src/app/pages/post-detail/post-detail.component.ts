import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { PageShellComponent } from '../../shared/page-shell/page-shell.component';
import { BlogService } from '../../shared/services/blog.service';
import { Router } from '@angular/router';
import type { BlogPost } from '../../shared/utils/markdown';

@Component({
  selector: 'app-post-detail',
  imports: [PageShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-shell>
      @if (loading()) {
        <div role="status" aria-live="polite" class="loading-state">
          <p class="loading-text">Loading post...</p>
        </div>
      }

      @if (error()) {
        <div role="alert" aria-live="assertive" class="error-state">
          <h1 class="error-title">{{ error() === 'Post not found' ? 'Post Not Found' : 'Failed to Load Post' }}</h1>
          <p class="error-message">{{ error() }}</p>
          @if (error() !== 'Post not found') {
            <button class="retry-button" (click)="loadPost()" type="button">
              Try Again
            </button>
          }
        </div>
      }

      @if (post(); as post) {
        <article class="event" [id]="post.slug" aria-label="Blog post">
          <p class="event-date">{{ formatDate(post.dateKey) }}</p>
          <h1 class="event-title">{{ post.title }}</h1>

          <div class="event-body">
            @for (paragraph of parseBody(post.body); track $index) {
              <p class="section-text event-paragraph">{{ paragraph }}</p>
            }
          </div>
        </article>
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
      .whats-new {
        padding: 10px 12px;
      }
      .event-body {
        font-size: 14px;
      }
    }

    /* State styles */
    .loading-state,
    .error-state {
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

    .error-title {
      font-size: clamp(1.5rem, 3vw + 1rem, 1.875rem);
      font-weight: 950;
      color: var(--neon-magenta);
      margin: 0 0 12px;
      letter-spacing: 0.6px;
    }

    .error-message {
      color: var(--text-magenta-medium);
      font-size: 14px;
      line-height: 1.7;
      margin: 0 0 18px;
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
      transition: color var(--dur-ambient) var(--ease-atmospheric),
                  background-color var(--dur-ambient) var(--ease-atmospheric),
                  border-color var(--dur-ambient) var(--ease-atmospheric),
                  box-shadow var(--dur-ambient) var(--ease-atmospheric);
    }

    .retry-button:hover {
      background: var(--neon-magenta);
      color: var(--bg-black);
      border-color: var(--neon-magenta);
      box-shadow: 0 0 12px var(--glow-magenta);
    }
  `]
})
export class PostDetailComponent {
  private readonly blogService = inject(BlogService);
  
  readonly slug = input.required<string>();
  readonly post = signal<BlogPost | null>(null);
  readonly loading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  constructor() {
    effect(() => {
      this.slug();
      this.loadPost();
    });
  }

  async loadPost(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    this.post.set(null);

    const currentSlug = this.slug();
    const { post, error } = await this.blogService.getPostBySlug(currentSlug);
    
    this.post.set(post);
    this.error.set(error);
    this.loading.set(false);
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