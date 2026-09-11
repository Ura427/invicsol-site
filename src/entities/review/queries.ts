import { db } from '@/shared/lib/db';
import { parseReview, type ParsedReview, type Rating } from './parse';

export interface RatingSummary {
  /** Rounded to one decimal, as it is displayed. */
  average: number;
  count: number;
  distribution: Record<Rating, number>;
}

/** Newest first. Only what has been approved ever leaves this function. */
export async function getApprovedReviews(stationId: string): Promise<ParsedReview[]> {
  const rows = await db.review.findMany({
    where: { stationId, status: 'approved' },
    orderBy: { createdAt: 'desc' },
  });
  return rows.map(parseReview);
}

/**
 * Null, not zeros, when there is nothing to summarise. "No reviews yet" is a
 * different state from "rated 0.0", and a nullable return makes the page say
 * so by type rather than by checking for a magic number.
 */
export function summarize(reviews: readonly ParsedReview[]): RatingSummary | null {
  if (reviews.length === 0) return null;

  const distribution: Record<Rating, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let total = 0;
  for (const review of reviews) {
    distribution[review.rating] += 1;
    total += review.rating;
  }

  return {
    average: Math.round((total / reviews.length) * 10) / 10,
    count: reviews.length,
    distribution,
  };
}
