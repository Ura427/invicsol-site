import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/ui/Button';

/**
 * Staggered fade-in-on-load via pure CSS `animation-delay` rather than a
 * mount-triggered `useState`/`useEffect` pair — no client JS needed, no
 * hydration flash, and each element's delay comes from its position in this
 * array instead of a duplicated animation class per element.
 */
const STAGGER_DELAYS_MS = [0, 100, 200] as const;

/**
 * Full-bleed photograph with the headline set low and light over it, rather
 * than the previous split layout (navy gradient panel + illustration in a
 * rounded box). The photograph carries the credibility — it is real installed
 * hardware, not an abstract graphic — and the type stays quiet on top of it.
 *
 * The scrim is a bottom-weighted gradient, not a flat darkening layer over the
 * whole image: it puts contrast exactly where the text sits and leaves the top
 * of the photograph untouched.
 */
export function Hero() {
  const t = useTranslations('Hero');

  return (
    <section className="bg-navy-900 relative isolate flex min-h-[34rem] items-end overflow-hidden lg:min-h-[42rem]">
      <Image
        src="/stations/15kw.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        className="from-navy-900/95 via-navy-900/70 absolute inset-0 bg-gradient-to-t to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 pt-24 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <h1
          className="animate-hero-in max-w-4xl text-[2.5rem] text-white opacity-0 sm:text-6xl lg:text-7xl"
          style={{ animationDelay: `${STAGGER_DELAYS_MS[0]}ms` }}
        >
          {t('titlePrefix')}
          <em className="text-gold-400 not-italic">{t('titleHighlight')}</em>
          {t('titleSuffix')}
        </h1>

        <p
          className="animate-hero-in mt-7 max-w-xl text-lg leading-relaxed text-white/75 opacity-0"
          style={{ animationDelay: `${STAGGER_DELAYS_MS[1]}ms` }}
        >
          {t('description')}
        </p>

        <div
          className="animate-hero-in mt-10 flex flex-wrap gap-3 opacity-0"
          style={{ animationDelay: `${STAGGER_DELAYS_MS[2]}ms` }}
        >
          <Button href="/calculator" variant="gold">
            {t('ctaPrimary')}
          </Button>
          <Button href="/stations" variant="outline-invert">
            {t('ctaSecondary')}
          </Button>
        </div>
      </div>
    </section>
  );
}
