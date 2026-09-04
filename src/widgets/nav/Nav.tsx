'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, X, Sun } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import { Button } from '@/shared/ui/Button';
import { CallbackModal } from '@/widgets/callback-modal';
import { useScrollShadow } from './useScrollShadow';

const NAV_LINKS = [
  { href: '/services', key: 'services' },
  { href: '/stations', key: 'stations' },
  { href: '/projects', key: 'projects' },
  { href: '/about', key: 'about' },
  { href: '/calculator', key: 'calculator' },
] as const;

export function Nav() {
  const t = useTranslations('Nav');
  const pathname = usePathname();
  const hasShadow = useScrollShadow();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header
      className={`bg-paper sticky top-0 z-40 transition-shadow ${hasShadow ? 'shadow-nav' : ''}`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Sun className="text-gold-500 h-6 w-6" aria-hidden />
          <span className="from-navy-800 to-navy-600 bg-gradient-to-r bg-clip-text text-xl font-extrabold text-transparent">
            INVICSOL
          </span>
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform hover:after:scale-x-100 ${
                    isActive ? 'text-gold-600 after:scale-x-100' : 'text-navy-800 hover:text-gold-600'
                  }`}
                >
                  {t(link.key)}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <CallbackModal />
          <Button href="/contact" variant="gold">
            {t('contactCta')}
          </Button>
        </div>

        <button
          type="button"
          className="text-navy-800 lg:hidden"
          aria-label={isMenuOpen ? t('closeMenu') : t('openMenu')}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {isMenuOpen ? (
        <div className="border-border border-t bg-white px-4 pb-6 lg:hidden">
          <ul className="flex flex-col gap-4 pt-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-navy-800 hover:text-gold-600 block text-base font-medium"
                >
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <Button href="/contact" variant="gold" className="w-full" onClick={() => setIsMenuOpen(false)}>
              {t('contactCta')}
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
