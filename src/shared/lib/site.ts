/**
 * Locale-neutral facts about the business. Kept out of the per-locale content
 * files so a phone number can never diverge between `uk` and `en`.
 */
export const SITE = {
  name: 'INVICSOL',
  legalName: 'INVICSOL',
  /**
   * LAUNCH BLOCKER — placeholder contact details.
   * Replace with the real business number, email and messenger handles.
   */
  isPlaceholderContact: true,
  phone: '+380671234567',
  phoneDisplay: '+38 (067) 123-45-67',
  email: 'info@invicsol.com.ua',
  telegram: 'https://t.me/invicsol',
  viber: 'viber://chat?number=%2B380671234567',
  geo: { latitude: 49.8397, longitude: 24.0297 },
  addressLocality: 'Lviv',
  postalCode: '79000',
  streetAddress: 'vul. Zelena 147',
  country: 'UA',
  foundingYear: 2016,
  url: process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://invicsol.com.ua',
} as const;

export const OG_IMAGE = '/og/invicsol-og.svg';
