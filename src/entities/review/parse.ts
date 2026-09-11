import type { ReviewModel } from '@/generated/prisma/models';

export type ReviewStatus = 'pending' | 'approved' | 'rejected';
export type Rating = 1 | 2 | 3 | 4 | 5;

export const REVIEW_STATUSES: readonly ReviewStatus[] = ['pending', 'approved', 'rejected'];

/** Length caps applied on the write path. A review is a paragraph, not an essay;
 * how short it may be is the reviewer's call — one word is a review. */
export const AUTHOR_NAME_MAX = 60;
export const REVIEW_TEXT_MAX = 1200;

export interface ParsedReview {
  id: string;
  stationId: string;
  authorName: string;
  rating: Rating;
  text: string;
  locale: string;
  status: ReviewStatus;
  createdAt: Date;
}

export function isReviewStatus(value: string): value is ReviewStatus {
  return (REVIEW_STATUSES as readonly string[]).includes(value);
}

export function isRating(value: unknown): value is Rating {
  return value === 1 || value === 2 || value === 3 || value === 4 || value === 5;
}

/**
 * The seam between a raw row and the typed shape. Same rule as the other
 * entities: string-vocabulary columns are narrowed here and an unknown value
 * throws loudly rather than rendering as garbage.
 */
export function parseReview(row: ReviewModel): ParsedReview {
  if (!isReviewStatus(row.status)) {
    throw new Error(`Unknown review status: "${row.status}"`);
  }
  if (!isRating(row.rating)) {
    throw new Error(`Review rating out of range: ${row.rating}`);
  }
  return {
    id: row.id,
    stationId: row.stationId,
    authorName: row.authorName,
    rating: row.rating,
    text: row.text,
    locale: row.locale,
    status: row.status,
    createdAt: row.createdAt,
  };
}

export interface ReviewSubmission {
  stationId: string;
  authorName: string;
  rating: number;
  text: string;
  locale: string;
  /** Honeypot. Humans never see it; anything in it is a bot. */
  website: string;
}

export type ReviewSubmissionError = 'spam' | 'rate_limited' | 'invalid';

export type ReviewSubmissionResult = { ok: true } | { ok: false; error: ReviewSubmissionError };

export type ReviewFieldError = 'name_empty' | 'name_long' | 'rating_missing' | 'text_empty' | 'text_long';

export interface ReviewFieldErrors {
  authorName?: ReviewFieldError;
  rating?: ReviewFieldError;
  text?: ReviewFieldError;
}

/**
 * Every problem with a submission, keyed by field, so the form can say what is
 * wrong next to the field that is wrong. An empty object means it is valid.
 */
export function reviewFieldErrors(submission: ReviewSubmission): ReviewFieldErrors {
  const errors: ReviewFieldErrors = {};
  const authorName = submission.authorName.trim();
  const text = submission.text.trim();

  if (authorName.length === 0) errors.authorName = 'name_empty';
  else if (authorName.length > AUTHOR_NAME_MAX) errors.authorName = 'name_long';

  if (!isRating(submission.rating)) errors.rating = 'rating_missing';

  if (text.length === 0) errors.text = 'text_empty';
  else if (text.length > REVIEW_TEXT_MAX) errors.text = 'text_long';

  return errors;
}

/**
 * What the public form is allowed to write. Pure so the form can run it for
 * instant feedback and the action can run it as the actual gate.
 */
export function validateReviewSubmission(
  submission: ReviewSubmission,
): { authorName: string; rating: Rating; text: string } | null {
  if (Object.keys(reviewFieldErrors(submission)).length > 0) return null;
  if (!isRating(submission.rating)) return null;
  return {
    authorName: submission.authorName.trim(),
    rating: submission.rating,
    text: submission.text.trim(),
  };
}
