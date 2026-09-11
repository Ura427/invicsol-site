'use client';

import { useLocale } from 'next-intl';
import { Suspense, useSyncExternalStore } from 'react';
import { useSearchParams } from 'next/navigation';
import { Link, usePathname } from '@/i18n/navigation';
import { routing, type AppLocale } from '@/i18n/routing';

const LABELS: Record<AppLocale, string> = { uk: 'UA', en: 'EN' };

// The router tracks query changes; the browser tracks fragment navigation.
function subscribeToHash(callback: () => void) {
  window.addEventListener('hashchange', callback);
  window.addEventListener('popstate', callback);
  return () => {
    window.removeEventListener('hashchange', callback);
    window.removeEventListener('popstate', callback);
  };
}

function CurrentLocaleLinks() {
  const search = useSearchParams()?.toString() ?? '';
  const hash = useSyncExternalStore(
    subscribeToHash,
    () => window.location.hash,
    () => '',
  );
  return <LocaleLinks suffix={`${search ? `?${search}` : ''}${hash}`} />;
}

export function LocaleSwitcher() {
  return (
    <Suspense fallback={<LocaleLinks suffix="" />}>
      <CurrentLocaleLinks />
    </Suspense>
  );
}

function LocaleLinks({ suffix }: { suffix: string }) {
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
              href={`${pathname}${suffix}`}
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
