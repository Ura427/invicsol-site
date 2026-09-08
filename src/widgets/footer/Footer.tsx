import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { SITE } from '@/shared/lib/site';
import { Logo } from '@/shared/ui/Logo';

const QUICK_LINKS = [
  { href: '/services', key: 'services' },
  { href: '/stations', key: 'stations' },
  { href: '/projects', key: 'projects' },
  { href: '/calculator', key: 'calculator' },
  { href: '/articles', key: 'articles' },
] as const;

export function Footer() {
  const tNav = useTranslations('Nav');
  const tFooter = useTranslations('Footer');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-800 text-white/80">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          {/* No separate one-colour version: the mark's dark shapes are painted
              in navy-800, this footer's own background, so here they knock out
              and it already reads as a single gold drawing. */}
          <div className="flex items-center gap-2.5">
            <Logo size={30} />
            <span className="text-lg font-medium tracking-[-0.03em] text-white">{SITE.name}</span>
          </div>
          <p className="mt-3 text-sm">
            {SITE.streetAddress}, {SITE.addressLocality}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">{tFooter('quickLinks')}</p>
          <ul className="mt-3 space-y-2 text-sm">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-gold-400 transition-colors">
                  {tNav(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">{tFooter('legal')}</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/legal/privacy" className="hover:text-gold-400 transition-colors">
                {tFooter('privacyPolicy')}
              </Link>
            </li>
            <li>
              <a href={`tel:${SITE.phone}`} className="hover:text-gold-400 transition-colors">
                {SITE.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="hover:text-gold-400 transition-colors">
                {SITE.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs sm:px-6 lg:px-8">
        {SITE.name} &copy; {year}. {tFooter('rights')}
      </div>
    </footer>
  );
}
