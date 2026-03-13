import { Injectable, signal } from '@angular/core';
import { parseFrontmatter, type BlogPost, type PostPreview } from '../utils/markdown';

type LoadingState = 'idle' | 'loading' | 'success' | 'error';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private readonly postCache = new Map<string, BlogPost>();
  private readonly postsSignal = signal<readonly PostPreview[]>([]);
  private readonly loadingStateSignal = signal<LoadingState>('loading');
  private readonly errorSignal = signal<string | null>(null);

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
    this.loadingStateSignal.set('loading');
    this.errorSignal.set(null);

    try {
      const response = await fetch('/posts/index.json');
      if (!response.ok) {
        throw new Error(`Failed to load posts: ${response.status} ${response.statusText}`);
      }
      const posts: PostPreview[] = await response.json();
      this.postsSignal.set(posts);
      this.loadingStateSignal.set('success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      this.errorSignal.set(errorMessage);
      this.loadingStateSignal.set('error');
    }
  }

  async getPostBySlug(slug: string): Promise<{ post: BlogPost | null; error: string | null }> {
    if (this.postCache.has(slug)) {
      return { post: this.postCache.get(slug)!, error: null };
    }
    return this.fetchPost(slug);
  }

  private async fetchPost(slug: string): Promise<{ post: BlogPost | null; error: string | null }> {
    try {
      const response = await fetch(`/posts/${slug}.md`);
      if (!response.ok) {
        if (response.status === 404) {
          return { post: null, error: 'Post not found' };
        }
        throw new Error(`Failed to load post: ${response.status} ${response.statusText}`);
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
      const errorMessage = error instanceof Error ? error.message : 'Failed to load post';
      return { post: null, error: errorMessage };
    }
  }
}