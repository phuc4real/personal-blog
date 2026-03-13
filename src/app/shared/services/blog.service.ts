import { Injectable, signal } from '@angular/core';
import { parseFrontmatter, type BlogPost, type PostPreview } from '../utils/markdown';

type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/** Only allow safe slug characters to prevent path traversal in fetch URLs. */
const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/i;
const SLUG_MAX_LENGTH = 200;

function isValidSlug(slug: string): boolean {
  return typeof slug === 'string' && slug.length <= SLUG_MAX_LENGTH && SLUG_PATTERN.test(slug);
}

function friendlyNetworkError(status: number): string {
  if (status === 0 || status >= 500) return 'Could not reach the server. Please try again later.';
  if (status === 404) return 'Post not found';
  if (status === 403) return 'You do not have permission to view this content.';
  return 'Something went wrong. Please try again.';
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private readonly postCache = new Map<string, BlogPost>();
  private readonly postsSignal = signal<readonly PostPreview[]>([]);
  private readonly loadingStateSignal = signal<LoadingState>('loading');
  private readonly errorSignal = signal<string | null>(null);
  private indexAbortController: AbortController | null = null;

  constructor() {
    this.loadPostsIndex();
  }

  get posts() {
    return this.postsSignal.asReadonly();
  }

  get loadingState() {
    return this.loadingStateSignal.asReadonly();
  }

  get error() {
    return this.errorSignal.asReadonly();
  }

  async retryLoadPosts(): Promise<void> {
    return this.loadPostsIndex();
  }

  private async loadPostsIndex(): Promise<void> {
    // Abort any in-flight index request before starting a new one.
    this.indexAbortController?.abort();
    this.indexAbortController = new AbortController();
    const { signal } = this.indexAbortController;

    this.loadingStateSignal.set('loading');
    this.errorSignal.set(null);

    try {
      const response = await fetch('/posts/index.json', { signal });
      if (!response.ok) {
        this.errorSignal.set(friendlyNetworkError(response.status));
        this.loadingStateSignal.set('error');
        return;
      }
      const data: unknown = await response.json();
      const posts: readonly PostPreview[] = Array.isArray(data) ? (data as PostPreview[]) : [];
      this.postsSignal.set(posts);
      this.loadingStateSignal.set('success');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return; // Intentionally cancelled — don't update state.
      }
      const message = error instanceof TypeError
        ? 'No internet connection. Please check your network.'
        : 'Could not load posts. Please try again.';
      this.errorSignal.set(message);
      this.loadingStateSignal.set('error');
    }
  }

  async getPostBySlug(slug: string): Promise<{ post: BlogPost | null; error: string | null }> {
    if (!isValidSlug(slug)) {
      return { post: null, error: 'Post not found' };
    }
    if (this.postCache.has(slug)) {
      return { post: this.postCache.get(slug)!, error: null };
    }
    return this.fetchPost(slug);
  }

  private async fetchPost(slug: string): Promise<{ post: BlogPost | null; error: string | null }> {
    try {
      const response = await fetch(`/posts/${slug}.md`);
      if (!response.ok) {
        return { post: null, error: friendlyNetworkError(response.status) };
      }

      const markdown = await response.text();
      const { metadata, content } = parseFrontmatter(markdown);

      const post: BlogPost = {
        slug,
        ...metadata,
        body: content,
      };

      this.postCache.set(slug, post);
      return { post, error: null };
    } catch (error) {
      const message = error instanceof TypeError
        ? 'No internet connection. Please check your network.'
        : 'Could not load this post. Please try again.';
      return { post: null, error: message };
    }
  }
}