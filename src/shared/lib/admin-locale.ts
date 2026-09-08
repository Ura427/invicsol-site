import { cookies } from 'next/headers';
import { hasLocale } from 'next-intl';
import { routing, type AppLocale } from '@/i18n/routing';

/**
 * Deliberately NOT next-intl's own `NEXT_LOCALE`. That cookie is what the public
 * site's middleware reads, so sharing it would make switching the admin to
 * English also switch the customer-facing site — two unrelated audiences whose
 * language preferences have no reason to travel together.
 */
export const ADMIN_LOCALE_COOKIE = 'admin_locale';

/** Falls back to the default locale for a missing or tampered-with cookie. */
export async function getAdminLocale(): Promise<AppLocale> {
  const store = await cookies();
  const value = store.get(ADMIN_LOCALE_COOKIE)?.value;

  return hasLocale(routing.locales, value) ? value : routing.defaultLocale;
}
