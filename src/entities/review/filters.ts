import { isReviewStatus, type ReviewStatus, type Rating } from './parse';

export type ReviewSort = 'newest' | 'oldest' | 'highest' | 'lowest';

export interface ReviewFilters {
  /** Defaults to `pending`: the queue is what an operator opens this page for. */
  status: ReviewStatus | 'all';
  stationSlug: string | null;
  rating: Rating | null;
  sort: ReviewSort;
  /** Free text, matched against author and body. */
  q: string | null;
}

const SORTS: readonly ReviewSort[] = ['newest', 'oldest', 'highest', 'lowest'];

function one(params: Record<string, string | string[] | undefined>, key: string): string | undefined {
  const raw = params[key];
  return Array.isArray(raw) ? raw[0] : raw;
}

/**
 * Same contract as the lead and project filters: an unrecognised value is
 * "no filter", never an exception, so a stale bookmark cannot 500 the page.
 */
export function parseReviewFilters(
  params: Record<string, string | string[] | undefined>,
): ReviewFilters {
  const statusRaw = one(params, 'status');
  const status = statusRaw === 'all' ? 'all' : statusRaw && isReviewStatus(statusRaw) ? statusRaw : 'pending';

  const ratingRaw = Number(one(params, 'rating'));
  const rating = [1, 2, 3, 4, 5].includes(ratingRaw) ? (ratingRaw as Rating) : null;

  const sortRaw = one(params, 'sort');
  const sort = sortRaw && (SORTS as readonly string[]).includes(sortRaw) ? (sortRaw as ReviewSort) : 'newest';

  return {
    status,
    stationSlug: one(params, 'station') || null,
    rating,
    sort,
    q: one(params, 'q')?.trim() || null,
  };
}

export function hasActiveReviewFilters(filters: ReviewFilters): boolean {
  return (
    filters.status !== 'pending' ||
    filters.stationSlug !== null ||
    filters.rating !== null ||
    filters.sort !== 'newest' ||
    filters.q !== null
  );
}

export function toPrismaWhere(filters: ReviewFilters) {
  return {
    ...(filters.status !== 'all' ? { status: filters.status } : {}),
    ...(filters.rating !== null ? { rating: filters.rating } : {}),
    ...(filters.stationSlug ? { station: { slug: filters.stationSlug } } : {}),
    ...(filters.q
      ? {
          OR: [
            { authorName: { contains: filters.q, mode: 'insensitive' as const } },
            { text: { contains: filters.q, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  };
}

export function toPrismaOrderBy(sort: ReviewSort) {
  switch (sort) {
    case 'oldest':
      return [{ createdAt: 'asc' as const }];
    case 'highest':
      return [{ rating: 'desc' as const }, { createdAt: 'desc' as const }];
    case 'lowest':
      return [{ rating: 'asc' as const }, { createdAt: 'desc' as const }];
    case 'newest':
      return [{ createdAt: 'desc' as const }];
  }
}
