import { validateProjectForm, deriveLocationKey, type ProjectFormValues } from '../form';

const copy = {
  title: 'Приватний будинок, Львів — 12 кВт',
  locationName: 'Львів',
  summary: 's',
  challenge: 'c',
  solution: 'so',
  result: 'r',
};

const valid: ProjectFormValues = {
  slug: 'pryvatnyy-budynok-lviv-12-kvt',
  capacityKw: 12,
  objectType: 'house',
  usage: 'self',
  mountType: 'roof',
  completedAt: '2025-01-30',
  coverImage: '/projects/sokilnyky-house-12kw.jpg',
  isPlaceholder: true,
  uk: copy,
  en: { ...copy, title: 'Private home, Lviv', locationName: 'Lviv' },
};

describe('validateProjectForm', () => {
  it('accepts a fully filled form', () => {
    expect(validateProjectForm(valid)).toBeNull();
  });

  // The reason this exists: a server action is a public POST endpoint, and an
  // out-of-vocabulary value written here would throw in parse.ts on the public
  // site — a bad admin write breaking a customer-facing page.
  it.each(['objectType', 'usage', 'mountType'] as const)('rejects an unknown %s', (field) => {
    expect(validateProjectForm({ ...valid, [field]: 'nonsense' as never })).toEqual({
      field,
      reason: 'unknown',
    });
  });

  it('requires the Ukrainian title, because the slug is derived from it', () => {
    expect(validateProjectForm({ ...valid, uk: { ...copy, title: '   ' } })).toEqual({
      field: 'title',
      reason: 'missing',
    });
  });

  it.each([
    ['', 'missing'],
    ['Львів', 'malformed'],
    ['-leading', 'malformed'],
    ['has spaces', 'malformed'],
  ])('rejects the slug %p', (slug, reason) => {
    expect(validateProjectForm({ ...valid, slug })).toEqual({ field: 'slug', reason });
  });

  it.each([0, -5, Number.NaN])('rejects capacity %p', (capacityKw) => {
    expect(validateProjectForm({ ...valid, capacityKw })).toEqual({
      field: 'capacityKw',
      reason: 'invalid',
    });
  });

  it('rejects an unparseable date', () => {
    expect(validateProjectForm({ ...valid, completedAt: 'someday' })).toEqual({
      field: 'completedAt',
      reason: 'invalid',
    });
  });

  it('requires a cover image', () => {
    expect(validateProjectForm({ ...valid, coverImage: '' })).toEqual({
      field: 'coverImage',
      reason: 'missing',
    });
  });
});

describe('deriveLocationKey', () => {
  it('produces the key that is already stored for that place', () => {
    expect(deriveLocationKey(valid)).toBe('lviv');
  });

  it('falls back to English when the Ukrainian name is blank', () => {
    expect(
      deriveLocationKey({ uk: { ...copy, locationName: '' }, en: { ...copy, locationName: 'Lviv' } }),
    ).toBe('lviv');
  });

  it('returns an empty key rather than throwing when neither is filled', () => {
    expect(
      deriveLocationKey({ uk: { ...copy, locationName: '' }, en: { ...copy, locationName: '' } }),
    ).toBe('');
  });
});
