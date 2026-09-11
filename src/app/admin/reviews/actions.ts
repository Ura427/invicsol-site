'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/shared/lib/db';
import { requireAdmin } from '@/shared/lib/admin-session';
import { parseReview, isReviewStatus, type ParsedReview, type ReviewStatus } from '@/entities/review/parse';
import { toPrismaWhere, toPrismaOrderBy, type ReviewFilters } from '@/entities/review/filters';
import { routing } from '@/i18n/routing';

export interface ReviewListItem extends Omit<ParsedReview, 'createdAt'> {
  createdAt: string;
  stationSlug: string;
  stationTitle: string;
}

export async function listReviews(
  filters: ReviewFilters,
  locale: string,
): Promise<{ items: ReviewListItem[]; total: number }> {
  await requireAdmin();

  const where = toPrismaWhere(filters);
  const [rows, total] = await Promise.all([
    db.review.findMany({
      where,
      orderBy: toPrismaOrderBy(filters.sort),
      include: { station: { include: { translations: true } } },
    }),
    db.review.count(),
  ]);

  return {
    total,
    items: rows.map((row) => {
      const parsed = parseReview(row);
      const title =
        row.station.translations.find((t) => t.locale === locale)?.title ??
        row.station.translations[0]?.title ??
        row.station.slug;
      return {
        ...parsed,
        createdAt: parsed.createdAt.toISOString(),
        stationSlug: row.station.slug,
        stationTitle: title,
      };
    }),
  };
}

/**
 * The moderation switch. Approving is what makes a review public, so it is
 * also what re-renders the station page: those pages are statically generated,
 * and this is the one moment their content changes.
 */
export async function setReviewStatus(id: string, status: ReviewStatus): Promise<void> {
  await requireAdmin();
  if (!isReviewStatus(status)) throw new Error(`Unknown review status: "${status}"`);

  const review = await db.review.update({
    where: { id },
    data: { status },
    include: { station: { select: { slug: true } } },
  });

  revalidatePath('/admin/reviews');
  for (const locale of routing.locales) {
    revalidatePath(`/${locale}/stations/${review.station.slug}`);
  }
}

export async function deleteReview(id: string): Promise<void> {
  await requireAdmin();

  const review = await db.review.delete({
    where: { id },
    include: { station: { select: { slug: true } } },
  });

  revalidatePath('/admin/reviews');
  for (const locale of routing.locales) {
    revalidatePath(`/${locale}/stations/${review.station.slug}`);
  }
}
