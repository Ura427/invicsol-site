import { buildStationJsonLd } from '../jsonld';

const base = { title: 'Гібридна станція 15 кВт', intro: 'Для великого будинку.', brandName: 'INVICSOL', powerKw: 15 };

describe('buildStationJsonLd', () => {
  it('emits no aggregateRating when there are no reviews', () => {
    const ld = buildStationJsonLd({ ...base, summary: null });
    expect(ld).not.toHaveProperty('aggregateRating');
    expect(ld['@type']).toBe('Product');
  });

  it('emits a truthful aggregateRating from approved reviews', () => {
    const ld = buildStationJsonLd({
      ...base,
      summary: { average: 4.5, count: 2, distribution: { 1: 0, 2: 0, 3: 0, 4: 1, 5: 1 } },
    });
    expect(ld.aggregateRating).toEqual({
      '@type': 'AggregateRating',
      ratingValue: 4.5,
      reviewCount: 2,
      bestRating: 5,
      worstRating: 1,
    });
  });

  it('omits powerKw for the bespoke station', () => {
    expect(buildStationJsonLd({ ...base, powerKw: null, summary: null })).not.toHaveProperty(
      'additionalProperty',
    );
  });
});
