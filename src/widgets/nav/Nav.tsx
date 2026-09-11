'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import { Button } from '@/shared/ui/Button';
import { Logo } from '@/shared/ui/Logo';
import { LocaleSwitcher } from './LocaleSwitcher';
import { CallbackModal } from '@/widgets/callback-modal';
import { useScrollShadow } from './useScrollShadow';

const NAV_LINKS = [
  // Jump-links: the services grid and the station catalogue live on the
  // homepage, and the pages that used to duplicate them redirect there.
  { href: '/#services', key: 'services' },
  { href: '/#stations', key: 'stations' },
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
      {/* A three-column grid rather than justify-between.
          With justify-between the link group is positioned by whatever space is
          left over, so translating the labels moved the entire block: switching
          uk -> en slid it 41px right and shrank it 35px, which is the jolt you
          see on language change. Here the outer columns size to their content
          and the links sit centred in a fixed middle column, so a width change
          is absorbed symmetrically inside that column instead of shoving
          everything sideways. */}
      <nav className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-4 sm:px-6 lg:px-8 xl:gap-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={30} />
          {/* Solid, not a bg-clip-text gradient. Gradient type is decorative
              rather than meaningful and is a common generated-UI tell; it also
              fights the restraint the rest of this design commits to. */}
          <span className="text-navy-800 text-xl font-medium tracking-[-0.03em]">
            INVICSOL
          </span>
        </Link>

        {/* gap-5 until xl: 1024px is the tightest desktop width and Ukrainian
            is the longer label set — at gap-8 the nav ran 12px past its own
            container there, pushing the language switcher off the right edge.
            The roomier spacing returns at xl, where there is width to spend. */}
        <ul className="hidden items-center justify-center gap-5 lg:flex xl:gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform hover:after:scale-x-100 ${
                    isActive
                      ? 'text-gold-700 after:scale-x-100'
                      : 'text-navy-800 hover:text-gold-700'
                  }`}
                >
                  {t(link.key)}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Reserved width, right-aligned. The two CTA labels differ in length
            between locales ("Замовити дзвінок" vs "Order a callback"), and
            because this column sizes to its content, that difference was
            squeezing the centre column and dragging the nav links 45px sideways
            on every language switch. Applied from xl only: at lg (1024px) reserving it overflowed the
            viewport. 31rem clears the longer (Ukrainian) pair
            measured at 1440px, so the column width stops depending on locale.

            Fixing the column was not enough on its own. With justify-end
            everything is pinned to the right edge, so the LEFTMOST item absorbs
            every width change to its right — and that item was the language
            switcher itself, which measured a 46px jump between locales. The
            control you click moved out from under the cursor as a direct result
            of clicking it.

            So the switcher is now anchored on the right, past the buttons, and
            the two buttons are the ones that absorb the difference. A control
            that changes the page's language cannot be a control that moves when
            the language changes. */}
        <div className="hidden items-center justify-end gap-3 lg:flex xl:min-w-[31rem]">
          <CallbackModal />
          <Button href="/contact" variant="gold">
            {t('contactCta')}
          </Button>
          <span className="border-border ml-1 border-l pl-3">
            <LocaleSwitcher />
          </span>
        </div>

        <button
          type="button"
          className="text-navy-800 col-start-3 justify-self-end lg:hidden"
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
          {/* Mobile gets the switcher too — the desktop nav collapses entirely
              below lg, and a visitor on a phone is the one most likely to be
              stuck in the wrong language. */}
          <div className="border-border mt-6 border-t pt-5">
            <LocaleSwitcher />
          </div>
          {/* The menu stays open behind the callback dialog on purpose: the
              dialog is mounted inside this panel, so closing the menu would
              unmount it mid-conversation. */}
          <div className="mt-5 flex flex-col gap-3">
            <Button
              href="/contact"
              variant="gold"
              className="w-full"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('contactCta')}
            </Button>
            <CallbackModal triggerClassName="w-full" />
          </div>
        </div>
      ) : null}
    </header>
  );
}
