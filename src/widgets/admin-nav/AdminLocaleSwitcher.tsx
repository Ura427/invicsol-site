'use client';

import { useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { routing, type AppLocale } from '@/i18n/routing';
import { setAdminLocale } from '@/app/admin/locale-actions';

const LABELS: Record<AppLocale, string> = { uk: 'UA', en: 'EN' };

/**
 * The admin twin of the public LocaleSwitcher, and deliberately buttons rather
 * than links.
 *
 * The public switcher navigates to the same page under the other locale prefix,
 * because the locale lives in the URL there. Admin URLs carry no locale — the
 * preference lives in a cookie — so there is nowhere to link *to*; the only
 * thing to do is write the cookie and let the layout re-render. Rendering that
 * as an anchor would be a link that goes nowhere.
 */
export function AdminLocaleSwitcher() {
  const activeLocale = useLocale();
  const t = useTranslations('Admin.nav');
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-1" role="group" aria-label={t('language')}>
      {routing.locales.map((locale, index) => {
        const isActive = locale === activeLocale;
        return (
          <span key={locale} className="flex items-center gap-1">
            {index > 0 ? (
              <span className="text-border" aria-hidden>
                /
              </span>
            ) : null}
            <button
              type="button"
              lang={locale}
              disabled={isPending}
              aria-current={isActive ? 'true' : undefined}
              onClick={() => startTransition(() => void setAdminLocale(locale))}
              className={`rounded-[var(--radius-sm)] px-1.5 py-1 text-sm transition-colors disabled:opacity-60 ${
                isActive ? 'text-navy-800 font-medium' : 'text-muted hover:text-navy-800'
              }`}
            >
              {LABELS[locale]}
            </button>
          </span>
        );
      })}
    </div>
  );
}
