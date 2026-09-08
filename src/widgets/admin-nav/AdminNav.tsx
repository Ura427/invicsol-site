'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { signOut } from 'next-auth/react';
import { Logo } from '@/shared/ui/Logo';
import { AdminLocaleSwitcher } from './AdminLocaleSwitcher';

const LINKS = [
  { href: '/admin/leads', key: 'leads' },
  { href: '/admin/projects', key: 'projects' },
] as const;

/**
 * Plain next/link and next/navigation, not the locale-aware exports from
 * @/i18n/navigation: admin paths carry no locale prefix, and the locale-aware
 * Link would add one and get bounced by the auth gate.
 */
export function AdminNav() {
  const pathname = usePathname();
  const t = useTranslations('Admin.nav');
  const tPanel = useTranslations('Admin');

  return (
    <header className="border-border bg-paper sticky top-0 z-40 border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-6 md:gap-8">
          <Link href="/admin/leads" className="flex items-center gap-2">
            <Logo size={26} />
            <span className="text-navy-800 text-lg font-medium tracking-[-0.03em]">INVICSOL</span>
            {/* The wordmark is the site's; this label is what says you are behind
                it. Set as the eyebrow device used across the public site rather
                than as a second, competing piece of branding. */}
            <span className="text-muted hidden text-xs font-medium tracking-[0.14em] uppercase sm:inline">
              {tPanel('panel')}
            </span>
          </Link>

          <nav className="flex gap-5 md:gap-6">
            {LINKS.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative py-1 text-sm font-medium transition-colors after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform hover:after:scale-x-100 ${
                    isActive ? 'text-gold-700 after:scale-x-100' : 'text-navy-800 hover:text-gold-700'
                  }`}
                >
                  {t(link.key)}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <AdminLocaleSwitcher />
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="text-muted hover:text-navy-800 text-sm font-medium transition-colors"
          >
            {t('signOut')}
          </button>
        </div>
      </div>
    </header>
  );
}
