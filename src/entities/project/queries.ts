import { db } from '@/shared/lib/db';
import { parseProject, parseProjectTranslation, parseProjectImage } from './parse';
import { toPrismaWhere, type ProjectFilters } from './filters';

export async function getFilteredProjects(filters: ProjectFilters, locale: string) {
  const rows = await db.project.findMany({
    where: toPrismaWhere(filters),
    orderBy: { completedAt: 'desc' },
    include: { translations: { where: { locale } } },
  });

  return rows
    .map((row) => {
      const translationRow = row.translations[0];
      if (!translationRow) return null;
      return { project: parseProject(row), translation: parseProjectTranslation(translationRow) };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
}

export async function getProjectBySlug(slug: string, locale: string) {
  const row = await db.project.findUnique({
    where: { slug },
    include: {
      translations: { where: { locale } },
      images: { orderBy: { sortOrder: 'asc' } },
    },
  });
  if (!row) return null;

  const translationRow = row.translations[0];
  if (!translationRow) return null;

  return {
    project: parseProject(row),
    translation: parseProjectTranslation(translationRow),
    images: row.images.map(parseProjectImage),
  };
}

export async function getAllProjectSlugs() {
  const rows = await db.project.findMany({ select: { slug: true } });
  return rows.map((row) => row.slug);
}
