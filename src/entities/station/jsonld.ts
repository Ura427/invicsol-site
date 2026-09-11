import type { RatingSummary } from '@/entities/review/queries';

interface StationJsonLdInput {
  title: string;
  intro: string;
  brandName: string;
  powerKw: number | null;
  summary: RatingSummary | null;
}

/**
 * The Product structured data for a station page. Pure, so the one rule that
 * matters here is unit-tested: `aggregateRating` appears only when there are
 * approved reviews to back it. A Product carrying a rating with no reviews
 * behind it is exactly what search engines penalise, and the page used to
 * hold a fabricated 4.7 that could have ended up here.
 */
export function buildStationJsonLd({ title, intro, brandName, powerKw, summary }: StationJsonLdInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    description: intro,
    brand: { '@type': 'Brand', name: brandName },
    ...(powerKw !== null
      ? { additionalProperty: { '@type': 'PropertyValue', name: 'powerKw', value: powerKw } }
      : {}),
    ...(summary
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: summary.average,
            reviewCount: summary.count,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}
