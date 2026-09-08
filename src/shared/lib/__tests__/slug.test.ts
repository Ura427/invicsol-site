import { toSlug, isValidSlug } from '../slug';

describe('toSlug', () => {
  // The regression that matters most: these four keys are already in the
  // database and already in public URLs. If the transliteration table drifts,
  // every existing project page quietly starts resolving somewhere else.
  it.each([
    ['Львів', 'lviv'],
    ['Брюховичі', 'bryukhovychi'],
    ['Городок', 'horodok'],
    ['Сокільники', 'sokilnyky'],
  ])('keeps the existing location key for %s', (input, expected) => {
    expect(toSlug(input)).toBe(expected);
  });

  it('turns a full project name into a URL segment', () => {
    expect(toSlug('Приватний будинок, Львів — 12 кВт')).toBe('pryvatnyy-budynok-lviv-12-kvt');
  });

  it('collapses punctuation and whitespace into single hyphens', () => {
    expect(toSlug('  Дах   /  земля  ')).toBe('dakh-zemlya');
  });

  it('leaves Latin input alone apart from casing', () => {
    expect(toSlug('Lviv Hotel 25kW')).toBe('lviv-hotel-25kw');
  });

  it('strips accents rather than dropping the letter', () => {
    expect(toSlug('Café Zürich')).toBe('cafe-zurich');
  });

  // Runs on every keystroke in the title field, so it has to return something
  // rather than throw.
  it('returns an empty string for input with nothing transliterable', () => {
    expect(toSlug('🌞')).toBe('');
    expect(toSlug('')).toBe('');
  });

  it('never emits a leading, trailing or doubled hyphen', () => {
    const slug = toSlug('—  Львів,,,  ');
    expect(slug).toBe('lviv');
    expect(isValidSlug(slug)).toBe(true);
  });
});

describe('isValidSlug', () => {
  it('accepts what toSlug produces', () => {
    expect(isValidSlug('pryvatnyy-budynok-lviv-12-kvt')).toBe(true);
  });

  it('rejects anything the unique column or the route would choke on', () => {
    expect(isValidSlug('')).toBe(false);
    expect(isValidSlug('-lviv')).toBe(false);
    expect(isValidSlug('lviv-')).toBe(false);
    expect(isValidSlug('lviv--hotel')).toBe(false);
    expect(isValidSlug('Львів')).toBe(false);
    expect(isValidSlug('lviv hotel')).toBe(false);
  });
});
