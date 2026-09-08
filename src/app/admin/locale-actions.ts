'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { ADMIN_LOCALE_COOKIE } from '@/shared/lib/admin-locale';

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/**
 * No auth check here on purpose: this only records a UI language preference in
 * the caller's own cookie jar. Requiring a session would be theatre — there is
 * nothing to read and nothing to damage, and the admin pages behind it are
 * gated independently.
 *
 * An unrecognised locale is ignored rather than written, so a hand-crafted call
 * cannot put a junk value in the cookie for `getAdminLocale` to defend against.
 */
export async function setAdminLocale(locale: string): Promise<void> {
  if (!hasLocale(routing.locales, locale)) return;

  const store = await cookies();
  store.set(ADMIN_LOCALE_COOKIE, locale, {
    maxAge: ONE_YEAR_SECONDS,
    sameSite: 'lax',
    path: '/admin',
  });

  // 'layout' rather than 'page': the locale is read in admin/layout.tsx, so the
  // layout itself has to re-render for the switch to take effect anywhere.
  revalidatePath('/admin', 'layout');
}
