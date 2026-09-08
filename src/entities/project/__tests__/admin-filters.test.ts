import {
  parseAdminProjectFilters,
  toPrismaWhere,
  toPrismaOrderBy,
  hasActiveProjectFilters,
  DEFAULT_PROJECT_SORT,
} from '../admin-filters';

describe('parseAdminProjectFilters', () => {
  it('inherits the public gallery filters unchanged', () => {
    const filters = parseAdminProjectFilters({ type: 'house', usage: 'green-tariff', kw: '10-20' });
    expect(filters.type).toBe('house');
    expect(filters.usage).toBe('green-tariff');
    expect(filters.capacity).toBe('10-20');
  });

  it('adds the admin-only search, status and sort', () => {
    const filters = parseAdminProjectFilters({ q: '  Львів ', status: 'real', sort: 'capacity-desc' });
    expect(filters.q).toBe('Львів');
    expect(filters.status).toBe('real');
    expect(filters.sort).toBe('capacity-desc');
  });

  it('falls back to the default sort for an unknown one', () => {
    expect(parseAdminProjectFilters({ sort: 'sideways' }).sort).toBe(DEFAULT_PROJECT_SORT);
  });
});

describe('toPrismaWhere', () => {
  const base = parseAdminProjectFilters({});

  it('keeps the public capacity banding', () => {
    expect(toPrismaWhere({ ...base, capacity: '10-20' }).capacityKw).toEqual({ gte: 10, lt: 20 });
  });

  // "real" and "demo" read the flag the opposite way round from how it is
  // stored, which is exactly the kind of thing that inverts silently.
  it('maps real and demo onto isPlaceholder', () => {
    expect(toPrismaWhere({ ...base, status: 'real' }).isPlaceholder).toBe(false);
    expect(toPrismaWhere({ ...base, status: 'demo' }).isPlaceholder).toBe(true);
  });

  it('searches the slug and every translated title', () => {
    expect(toPrismaWhere({ ...base, q: 'hotel' }).OR).toEqual([
      { slug: { contains: 'hotel', mode: 'insensitive' } },
      { translations: { some: { title: { contains: 'hotel', mode: 'insensitive' } } } },
    ]);
  });
});

describe('toPrismaOrderBy', () => {
  it.each([
    ['newest', { completedAt: 'desc' }],
    ['oldest', { completedAt: 'asc' }],
    ['capacity-desc', { capacityKw: 'desc' }],
    ['capacity-asc', { capacityKw: 'asc' }],
    ['title', { slug: 'asc' }],
  ] as const)('orders by %s', (sort, expected) => {
    expect(toPrismaOrderBy(sort)).toEqual(expected);
  });
});

describe('hasActiveProjectFilters', () => {
  it('is false for the default view', () => {
    expect(hasActiveProjectFilters(parseAdminProjectFilters({}))).toBe(false);
  });

  it('is true once anything narrows or reorders the list', () => {
    expect(hasActiveProjectFilters(parseAdminProjectFilters({ status: 'demo' }))).toBe(true);
    expect(hasActiveProjectFilters(parseAdminProjectFilters({ sort: 'title' }))).toBe(true);
  });
});
