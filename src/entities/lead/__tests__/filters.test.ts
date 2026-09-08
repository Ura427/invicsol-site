import {
  parseLeadFilters,
  toPrismaWhere,
  toPrismaOrderBy,
  hasActiveLeadFilters,
  DEFAULT_LEAD_SORT,
} from '../filters';

describe('parseLeadFilters', () => {
  it('reads a full query string', () => {
    expect(
      parseLeadFilters({ source: 'calculator', via: 'viber', status: 'open', notified: 'failed', q: ' 067 ', sort: 'name' }),
    ).toEqual({
      source: 'calculator',
      contactMethod: 'viber',
      status: 'open',
      notified: 'failed',
      q: '067',
      sort: 'name',
    });
  });

  it('defaults to newest-first with nothing filtered', () => {
    expect(parseLeadFilters({})).toEqual({
      source: null,
      contactMethod: null,
      status: null,
      notified: null,
      q: '',
      sort: DEFAULT_LEAD_SORT,
    });
  });

  // The property that matters: a stale bookmark or a hand-edited URL must
  // degrade to "no filter", never throw. This page is reachable by URL.
  it('ignores values outside the vocabulary rather than throwing', () => {
    const filters = parseLeadFilters({ source: 'nonsense', via: '../etc', status: '1', sort: 'random' });
    expect(filters.source).toBeNull();
    expect(filters.contactMethod).toBeNull();
    expect(filters.status).toBeNull();
    expect(filters.sort).toBe(DEFAULT_LEAD_SORT);
  });

  it('takes the first value when a param is repeated', () => {
    expect(parseLeadFilters({ source: ['contact', 'callback'] }).source).toBe('contact');
  });

  it('caps the search term so a giant URL cannot reach the database', () => {
    expect(parseLeadFilters({ q: 'x'.repeat(500) }).q).toHaveLength(100);
  });
});

describe('toPrismaWhere', () => {
  const base = parseLeadFilters({});

  it('is empty when nothing is filtered', () => {
    expect(toPrismaWhere(base)).toEqual({});
  });

  // handledAt/notifiedAt are nullable timestamps, not booleans — getting this
  // backwards would silently show the wrong half of the inbox.
  it('maps handled and open onto the nullable timestamp', () => {
    expect(toPrismaWhere({ ...base, status: 'handled' }).handledAt).toEqual({ not: null });
    expect(toPrismaWhere({ ...base, status: 'open' }).handledAt).toBeNull();
  });

  it('maps a failed Telegram notification onto a null timestamp', () => {
    expect(toPrismaWhere({ ...base, notified: 'failed' }).notifiedAt).toBeNull();
    expect(toPrismaWhere({ ...base, notified: 'sent' }).notifiedAt).toEqual({ not: null });
  });

  it('searches name and phone together', () => {
    expect(toPrismaWhere({ ...base, q: 'Ola' }).OR).toEqual([
      { name: { contains: 'Ola', mode: 'insensitive' } },
      { phone: { contains: 'Ola', mode: 'insensitive' } },
    ]);
  });

  it('omits the search clause entirely for an empty term', () => {
    expect(toPrismaWhere({ ...base, q: '' }).OR).toBeUndefined();
  });
});

describe('toPrismaOrderBy', () => {
  it.each([
    ['newest', { createdAt: 'desc' }],
    ['oldest', { createdAt: 'asc' }],
    ['name', { name: 'asc' }],
  ] as const)('orders by %s', (sort, expected) => {
    expect(toPrismaOrderBy(sort)).toEqual(expected);
  });
});

describe('hasActiveLeadFilters', () => {
  it('is false for the default view', () => {
    expect(hasActiveLeadFilters(parseLeadFilters({}))).toBe(false);
  });

  it('counts a non-default sort as active, so Clear is offered', () => {
    expect(hasActiveLeadFilters(parseLeadFilters({ sort: 'oldest' }))).toBe(true);
  });

  it('is true for any single filter', () => {
    expect(hasActiveLeadFilters(parseLeadFilters({ q: 'x' }))).toBe(true);
    expect(hasActiveLeadFilters(parseLeadFilters({ status: 'open' }))).toBe(true);
  });
});
