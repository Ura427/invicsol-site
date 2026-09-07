'use client';

import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { routing, type AppLocale } from '@/i18n/routing';

const LABELS: Record<AppLocale, string> = { uk: 'UA', en: 'EN' };

/**
 * Manual locale switcher.
 *
 * Until now the locale was chosen once by next-intl's Accept-Language
 * negotiation and there was no way to override it — an English-speaking visitor
 * landing on the Ukrainian site, or a Ukrainian visitor whose browser reports
 * en-US, had no route back.
 *
 * It links to the *same* page in the other locale rather than to the home page,
 * because dumping someone on the front page is a good way to lose them halfway
 * through reading a station spec.
 *
 * `usePathname` from the locale-aware navigation returns the resolved path with
 * the locale prefix stripped — `/stations/10kw`, not `/uk/stations/10kw` and
 * not a `[slug]` template — so it can be handed straight to `<Link locale>`,
 * which rebuilds the prefix for the target locale. (Routing here has no
 * `pathnames` map, so there are no typed route templates to resolve.)
 */
export function LocaleSwitcher() {
  const activeLocale = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Language">
      {routing.locales.map((locale, index) => {
        const isActive = locale === activeLocale;
        return (
          <span key={locale} className="flex items-center gap-1">
            {index > 0 ? (
              <span className="text-border" aria-hidden>
                /
              </span>
            ) : null}
            <Link
              href={pathname}
              locale={locale}
              hrefLang={locale}
              aria-current={isActive ? 'true' : undefined}
              className={`rounded-[var(--radius-sm)] px-1.5 py-1 text-sm transition-colors ${
                isActive ? 'text-navy-800 font-medium' : 'text-muted hover:text-navy-800'
              }`}
            >
              {LABELS[locale]}
            </Link>
          </span>
        );
      })}
    </div>
  );
}
