import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { SITE } from '@/shared/lib/site';
import { Logo } from '@/shared/ui/Logo';

const QUICK_LINKS = [
  { href: '/#services', key: 'services' },
  { href: '/#stations', key: 'stations' },
  { href: '/projects', key: 'projects' },
  { href: '/calculator', key: 'calculator' },
  { href: '/articles', key: 'articles' },
] as const;

/** The four information pages. Nothing else on the site linked to them. */
const USEFUL_LINKS = [
  { href: '/financing', key: 'financing' },
  { href: '/warranty', key: 'warranty' },
  { href: '/green-tariff', key: 'greenTariff' },
  { href: '/backup-power', key: 'backupPower' },
] as const;

export function Footer() {
  const tNav = useTranslations('Nav');
  const tFooter = useTranslations('Footer');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-800 text-white/80">
      {/* One row on desktop: mark, the links, the ways to reach us. Three
          stacked columns of three lines each were 300px of footer for nine
          items. */}
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        {/* No separate one-colour version: the mark's dark shapes are painted
            in navy-800, this footer's own background, so here they knock out
            and it already reads as a single gold drawing. */}
        <div className="flex items-center gap-2.5">
          <Logo size={30} />
          <span className="text-lg font-medium tracking-[-0.03em] text-white">
            {SITE.name}
          </span>
        </div>

        <nav aria-label={tFooter('quickLinks')} className="space-y-2">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-gold-400 transition-colors">
                  {tNav(link.key)}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/60">
            {USEFUL_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-gold-400 transition-colors">
                  {tNav(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <li>
            <a
              href={`tel:${SITE.phone}`}
              className="hover:text-gold-400 transition-colors"
            >
              {SITE.phoneDisplay}
            </a>
          </li>
          <li>
            <a
              href={`mailto:${SITE.email}`}
              className="hover:text-gold-400 transition-colors"
            >
              {SITE.email}
            </a>
          </li>
          <li>
            <Link href="/legal/privacy" className="hover:text-gold-400 transition-colors">
              {tFooter('privacyPolicy')}
            </Link>
          </li>
        </ul>
      </div>

      <div className="border-t border-white/10 px-4 py-3 text-center text-xs sm:px-6 lg:px-8">
        {SITE.name} &copy; {year}. {tFooter('rights')} · {SITE.streetAddress},{' '}
        {SITE.addressLocality}
      </div>
    </footer>
  );
}
