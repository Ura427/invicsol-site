import type { ArticleModel, ArticleTranslationModel } from '@/generated/prisma/models';

export interface ParsedArticle {
  id: string;
  slug: string;
  publishedAt: Date;
  coverImage: string;
}

export type ArticleBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string };

export interface ParsedArticleTranslation {
  title: string;
  excerpt: string;
  body: readonly ArticleBlock[];
}

/**
 * "## " at the start of a block marks it as a subheading — the same
 * lightweight in-string convention this project already uses elsewhere
 * (next-intl's t.rich for <em> highlights) rather than a full rich-text
 * schema for a handful of articles.
 */
function parseBody(value: unknown): readonly ArticleBlock[] {
  if (!Array.isArray(value) || !value.every((item) => typeof item === 'string')) {
    throw new Error(`Article body is not a JSON string array: ${JSON.stringify(value)}`);
  }
  return value.map((block) =>
    block.startsWith('## ')
      ? { type: 'heading', text: block.slice(3) }
      : { type: 'paragraph', text: block },
  );
}

export function parseArticle(row: ArticleModel): ParsedArticle {
  return {
    id: row.id,
    slug: row.slug,
    publishedAt: row.publishedAt,
    coverImage: row.coverImage,
  };
}

export function parseArticleTranslation(row: ArticleTranslationModel): ParsedArticleTranslation {
  return {
    title: row.title,
    excerpt: row.excerpt,
    body: parseBody(row.body),
  };
}
