export interface PostMetadata {
  title: string;
  dateKey: string;
}

export interface PostPreview extends PostMetadata {
  slug: string;
  preview: string;
}

export interface BlogPost extends PostMetadata {
  slug: string;
  body: string;
}

export function parseFrontmatter(markdown: string): { metadata: PostMetadata; content: string } {
  if (!markdown || typeof markdown !== 'string') {
    return { metadata: { title: 'Untitled Post', dateKey: '' }, content: '' };
  }

  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);

  if (!match) {
    // Graceful degradation: treat entire content as body with no metadata
    return { metadata: { title: 'Untitled Post', dateKey: '' }, content: markdown.trim() };
  }

  const [, frontmatterRaw, content] = match;
  const metadata: Record<string, string> = {};

  frontmatterRaw.split('\n').forEach((line) => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
      if (key && value) {
        metadata[key] = value;
      }
    }
  });

  return {
    metadata: {
      title: (metadata['title'] || 'Untitled Post').slice(0, 500),
      dateKey: metadata['dateKey'] || '',
    },
    content: content.trim(),
  };
}
