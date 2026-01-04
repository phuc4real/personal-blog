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
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);

  if (!match) {
    throw new Error('Invalid markdown format: Missing frontmatter');
  }

  const [, frontmatterRaw, content] = match;
  const metadata: Record<string, string> = {};

  frontmatterRaw.split('\n').forEach((line) => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
      metadata[key] = value;
    }
  });

  return {
    metadata: {
      title: metadata['title'] || '',
      dateKey: metadata['dateKey'] || '',
    },
    content: content.trim(),
  };
}
