import { Injectable, signal } from '@angular/core';
import { parseFrontmatter, type BlogPost, type PostPreview } from '../utils/markdown';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private readonly postCache = new Map<string, BlogPost>();
  private readonly postsSignal = signal<readonly PostPreview[]>([]);

  constructor() {
    this.loadPostsIndex();
  }

  get posts() {
    return this.postsSignal.asReadonly();
  }

  private async loadPostsIndex(): Promise<void> {
    try {
      const response = await fetch('/posts/index.json');
      if (!response.ok) {
        console.error('Failed to load posts index');
        return;
      }
      const posts: PostPreview[] = await response.json();
      this.postsSignal.set(posts);
    } catch (error) {
      console.error('Failed to load posts index:', error);
    }
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    if (this.postCache.has(slug)) {
      return this.postCache.get(slug)!;
    }
    return this.fetchPost(slug);
  }

  private async fetchPost(slug: string): Promise<BlogPost | null> {
    try {
      const response = await fetch(`/posts/${slug}.md`);
      if (!response.ok) return null;

      const markdown = await response.text();
      const { metadata, content } = parseFrontmatter(markdown);

      const post: BlogPost = {
        slug,
        ...metadata,
        body: content,
      };

      this.postCache.set(slug, post);
      return post;
    } catch (error) {
      console.error(`Failed to load post: ${slug}`, error);
      return null;
    }
  }
}