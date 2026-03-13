import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
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
            <button class="retry-button" (click)="loadPost()" type="button" [disabled]="loading()">
              Try Again
            </button>
          }
        </div>
      }

      @if (post(); as post) {
        <article class="event" [id]="post.slug" [attr.aria-label]="'Post: ' + post.title">
          <p class="event-date">{{ formatDate(post.dateKey) }}</p>
          <h1 class="event-title">{{ post.title }}</h1>

          <div class="event-body">
            @for (paragraph of parsedBody(); track $index) {
              <p class="section-text event-paragraph">{{ paragraph }}</p>
            }
          </div>
        </article>
      }
    </app-page-shell>
  `,
  styles: [`
    .event {
      color: var(--text-white);
    }
  `]
})
export class PostDetailComponent {
  private readonly blogService = inject(BlogService);
  private readonly router = inject(Router);
  private loadId = 0;

  readonly slug = input.required<string>();
  readonly post = signal<BlogPost | null>(null);
  readonly loading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  /** Derived from post signal — avoids re-running on every change detection cycle. */
  readonly parsedBody = computed(() => {
    const p = this.post();
    return p ? p.body.split('\n\n').filter(para => para.trim()) : [];
  });

  constructor() {
    effect(() => {
      this.slug();
      this.loadPost();
    });
  }

  async loadPost(): Promise<void> {
    // Stale-response guard: if the slug changed while a fetch was in flight,
    // discard the older response when it arrives.
    const id = ++this.loadId;

    this.loading.set(true);
    this.error.set(null);
    this.post.set(null);

    const currentSlug = this.slug();
    const { post, error } = await this.blogService.getPostBySlug(currentSlug);

    if (id !== this.loadId) return; // A newer load was triggered — discard.

    this.post.set(post);
    this.error.set(error);
    this.loading.set(false);
  }

  formatDate(dateKey: string): string {
    if (!dateKey || dateKey.length !== 8) return dateKey || '';
    const year = dateKey.slice(0, 4);
    const month = dateKey.slice(4, 6);
    const day = dateKey.slice(6, 8);
    return `${year}.${month}.${day}`;
  }
}