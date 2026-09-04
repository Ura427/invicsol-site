import { SITE } from './site';

export function buildLocalBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE.legalName,
    image: `${SITE.url}${'/og/invicsol-og.svg'}`,
    telephone: SITE.phone,
    email: SITE.email,
    url: SITE.url,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.streetAddress,
      addressLocality: SITE.addressLocality,
      postalCode: SITE.postalCode,
      addressCountry: SITE.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE.geo.latitude,
      longitude: SITE.geo.longitude,
    },
    foundingDate: String(SITE.foundingYear),
  };
}

export function buildFaqPageJsonLd(faq: readonly { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}
