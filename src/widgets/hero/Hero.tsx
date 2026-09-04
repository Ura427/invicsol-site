import { useTranslations } from 'next-intl';
import { Button } from '@/shared/ui/Button';

/**
 * Staggered fade-in-on-load via pure CSS `animation-delay` rather than a
 * mount-triggered `useState`/`useEffect` pair — no client JS needed, no
 * hydration flash, and each element's delay comes from its position in this
 * array instead of a duplicated animation class per element.
 */
const STAGGER_DELAYS_MS = [0, 100, 200, 300] as const;

export function Hero() {
  const t = useTranslations('Hero');

  return (
    <section className="from-navy-800 to-navy-700 relative overflow-hidden bg-gradient-to-br text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-28 lg:px-8">
        <div>
          <h1
            className="animate-hero-in text-4xl leading-tight font-extrabold opacity-0 sm:text-5xl lg:text-6xl"
            style={{ animationDelay: `${STAGGER_DELAYS_MS[0]}ms` }}
          >
            {t('titlePrefix')}
            <em className="text-gold-400 not-italic">{t('titleHighlight')}</em>
            {t('titleSuffix')}
          </h1>

          <p
            className="animate-hero-in mt-6 max-w-lg text-lg text-white/80 opacity-0"
            style={{ animationDelay: `${STAGGER_DELAYS_MS[1]}ms` }}
          >
            {t('description')}
          </p>

          <div
            className="animate-hero-in mt-8 flex flex-wrap gap-4 opacity-0"
            style={{ animationDelay: `${STAGGER_DELAYS_MS[2]}ms` }}
          >
            <Button href="/calculator" variant="gold">
              {t('ctaPrimary')}
            </Button>
            <Button
              href="/stations"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-navy-800"
            >
              {t('ctaSecondary')}
            </Button>
          </div>
        </div>

        <div
          className="animate-hero-scale-in relative aspect-[4/3] overflow-hidden rounded-3xl bg-white/5 opacity-0 shadow-2xl"
          style={{ animationDelay: `${STAGGER_DELAYS_MS[3]}ms` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- static hero art, no next/image benefit for a decorative background this size */}
          <img
            src="/hero/solar-house.svg"
            alt=""
            className="h-full w-full object-cover"
            role="presentation"
          />
        </div>
      </div>
    </section>
  );
}
