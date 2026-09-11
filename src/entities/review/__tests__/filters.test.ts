import { parseReviewFilters, hasActiveReviewFilters, toPrismaWhere } from '../filters';

describe('parseReviewFilters', () => {
  it('defaults to the pending queue, newest first', () => {
    expect(parseReviewFilters({})).toEqual({
      status: 'pending',
      stationSlug: null,
      rating: null,
      sort: 'newest',
      q: null,
    });
  });

  it('reads every param', () => {
    expect(parseReviewFilters({ status: 'approved', station: '15kw', rating: '4', sort: 'lowest', q: ' Deye ' })).toEqual({
      status: 'approved',
      stationSlug: '15kw',
      rating: 4,
      sort: 'lowest',
      q: 'Deye',
    });
  });

  // A stale bookmark or a hand-edited URL must fall back, never throw.
  it('treats unknown values as defaults', () => {
    const f = parseReviewFilters({ status: 'published', rating: '9', sort: 'random' });
    expect(f.status).toBe('pending');
    expect(f.rating).toBeNull();
    expect(f.sort).toBe('newest');
    expect(hasActiveReviewFilters(f)).toBe(false);
  });

  it('lets "all" widen past the default queue', () => {
    const f = parseReviewFilters({ status: 'all' });
    expect(f.status).toBe('all');
    expect(hasActiveReviewFilters(f)).toBe(true);
    expect(toPrismaWhere(f)).not.toHaveProperty('status');
  });
});

describe('toPrismaWhere', () => {
  it('searches author and text case-insensitively', () => {
    const where = toPrismaWhere(parseReviewFilters({ q: 'deye' }));
    expect(where.OR).toHaveLength(2);
    expect(where.OR?.[0]).toEqual({ authorName: { contains: 'deye', mode: 'insensitive' } });
  });
});
