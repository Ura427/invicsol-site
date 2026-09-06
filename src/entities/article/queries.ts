import { db } from '@/shared/lib/db';
import { parseArticle, parseArticleTranslation } from './parse';

export async function getAllArticles(locale: string) {
  const rows = await db.article.findMany({
    orderBy: { publishedAt: 'desc' },
    include: { translations: { where: { locale } } },
  });

  return rows
    .map((row) => {
      const translationRow = row.translations[0];
      if (!translationRow) return null;
      return { article: parseArticle(row), translation: parseArticleTranslation(translationRow) };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
}

export async function getArticleBySlug(slug: string, locale: string) {
  const row = await db.article.findUnique({
    where: { slug },
    include: { translations: { where: { locale } } },
  });
  if (!row) return null;

  const translationRow = row.translations[0];
  if (!translationRow) return null;

  return { article: parseArticle(row), translation: parseArticleTranslation(translationRow) };
}

export async function getAllArticleSlugs() {
  const rows = await db.article.findMany({ select: { slug: true } });
  return rows.map((row) => row.slug);
}
