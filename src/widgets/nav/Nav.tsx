'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import { Button } from '@/shared/ui/Button';
import { Logo } from '@/shared/ui/Logo';
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
    // A hairline rule on scroll rather than a drop shadow. The navy-tinted
    // shadow read as a colored glow where the nav overlapped the dark hero
    // photograph, and this design separates layers by tone and edge, not
    // elevation.
    <header
      className={`bg-paper sticky top-0 z-40 border-b transition-colors ${
        hasShadow ? 'border-border' : 'border-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={30} />
          {/* Solid, not a bg-clip-text gradient. Gradient type is decorative
              rather than meaningful and is a common generated-UI tell; it also
              fights the restraint the rest of this design commits to. */}
          <span className="text-navy-800 text-xl font-medium tracking-[-0.03em]">INVICSOL</span>
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform hover:after:scale-x-100 ${
                    isActive ? 'text-gold-700 after:scale-x-100' : 'text-navy-800 hover:text-gold-700'
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
        <div className="border-border bg-paper border-t px-4 pb-6 lg:hidden">
          <ul className="flex flex-col gap-4 pt-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-navy-800 hover:text-gold-700 block text-base font-medium"
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
