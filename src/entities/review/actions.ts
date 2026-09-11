'use server';

import { headers } from 'next/headers';
import { db } from '@/shared/lib/db';
import { isRateLimited } from '@/entities/lead/rateLimit';
import { validateReviewSubmission, type ReviewSubmission, type ReviewSubmissionResult } from './parse';

/**
 * The public review form's write path. Same three gates as submitLead — honeypot,
 * validation, per-IP rate limit — and the same result shape, so the form can
 * treat both the same way.
 *
 * Writes `pending` and does not revalidate anything: nothing public has changed
 * until an operator approves the review in the admin, and that is where the
 * station page is re-rendered.
 */
export async function submitReview(submission: ReviewSubmission): Promise<ReviewSubmissionResult> {
  if (submission.website.trim() !== '') {
    return { ok: false, error: 'spam' };
  }

  const valid = validateReviewSubmission(submission);
  if (valid === null) {
    return { ok: false, error: 'invalid' };
  }

  const headerList = await headers();
  const ip =
    headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headerList.get('x-real-ip') ??
    'unknown';

  // Shares the lead limiter's window on purpose: one visitor hammering either
  // form is the same visitor.
  if (isRateLimited(`review:${ip}`)) {
    return { ok: false, error: 'rate_limited' };
  }

  // A review for a station that does not exist is not an error worth telling a
  // bot about; it just goes nowhere.
  const station = await db.station.findUnique({ where: { id: submission.stationId }, select: { id: true } });
  if (!station) {
    return { ok: false, error: 'invalid' };
  }

  await db.review.create({
    data: {
      stationId: station.id,
      authorName: valid.authorName,
      rating: valid.rating,
      text: valid.text,
      locale: submission.locale,
      status: 'pending',
    },
  });

  return { ok: true };
}
