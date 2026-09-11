import {
  parseReview,
  validateReviewSubmission,
  reviewFieldErrors,
  REVIEW_TEXT_MAX,
  AUTHOR_NAME_MAX,
} from '../parse';
import { summarize } from '../queries';

const row = {
  id: 'r1',
  stationId: 's1',
  authorName: 'Олена',
  rating: 5,
  text: 'Станція працює бездоганно вже пів року.',
  locale: 'uk',
  status: 'approved',
  createdAt: new Date('2026-09-01T10:00:00Z'),
};

describe('parseReview', () => {
  it('narrows a valid row', () => {
    expect(parseReview(row).status).toBe('approved');
    expect(parseReview(row).rating).toBe(5);
  });

  it('throws on an unknown status rather than rendering it', () => {
    expect(() => parseReview({ ...row, status: 'published' })).toThrow(/status/);
  });

  it('throws on a rating outside 1..5', () => {
    expect(() => parseReview({ ...row, rating: 0 })).toThrow(/rating/);
    expect(() => parseReview({ ...row, rating: 6 })).toThrow(/rating/);
  });
});

describe('validateReviewSubmission', () => {
  const good = {
    stationId: 's1',
    authorName: '  Олена ',
    rating: 4,
    text: 'Монтаж за один день, все акуратно.',
    locale: 'uk',
    website: '',
  };

  it('accepts a good submission and trims it', () => {
    expect(validateReviewSubmission(good)).toEqual({
      authorName: 'Олена',
      rating: 4,
      text: 'Монтаж за один день, все акуратно.',
    });
  });

  it.each([
    ['blank name', { ...good, authorName: '   ' }],
    ['name too long', { ...good, authorName: 'x'.repeat(AUTHOR_NAME_MAX + 1) }],
    ['blank text', { ...good, text: '   ' }],
    ['rating 0', { ...good, rating: 0 }],
    ['fractional rating', { ...good, rating: 4.5 }],
  ])('rejects %s', (_label, submission) => {
    expect(validateReviewSubmission(submission)).toBeNull();
  });

  it('names every wrong field at once, so the form can mark each one', () => {
    expect(reviewFieldErrors({ ...good, authorName: '', rating: 0, text: '' })).toEqual({
      authorName: 'name_empty',
      rating: 'rating_missing',
      text: 'text_empty',
    });
    expect(
      reviewFieldErrors({
        ...good,
        authorName: 'x'.repeat(AUTHOR_NAME_MAX + 1),
        text: 'x'.repeat(REVIEW_TEXT_MAX + 1),
      }),
    ).toEqual({ authorName: 'name_long', text: 'text_long' });
    expect(reviewFieldErrors(good)).toEqual({});
  });
});

describe('summarize', () => {
  const make = (rating: 1 | 2 | 3 | 4 | 5) => ({ ...parseReview(row), rating });

  it('is null for no reviews — an absence, not a zero score', () => {
    expect(summarize([])).toBeNull();
  });

  it('averages to one decimal and counts the distribution', () => {
    const summary = summarize([make(5), make(4), make(4), make(2)]);
    expect(summary).toEqual({
      average: 3.8,
      count: 4,
      distribution: { 1: 0, 2: 1, 3: 0, 4: 2, 5: 1 },
    });
  });
});
