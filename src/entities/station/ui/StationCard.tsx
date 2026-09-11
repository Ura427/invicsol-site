import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { ParsedStation, ParsedStationTranslation } from '@/entities/station/parse';

interface StationCardProps {
  station: ParsedStation;
  translation: ParsedStationTranslation;
}

/**
 * Kept separate from ProjectCard rather than unified behind a `variant` prop —
 * the two are visually similar but semantically different (a fixed catalogue
 * item vs. a filterable case study), and forcing them into one component would
 * couple their markup for no real reuse benefit.
 */
export function StationCard({ station, translation }: StationCardProps) {
  const t = useTranslations('Stations');
  const locale = useLocale();
  const isCustom = station.accent === 'gold';

  return (
    <Link
      href={`/stations/${station.slug}`}
      className={`group flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] transition-transform duration-300 hover:-translate-y-0.5 ${
        isCustom ? 'bg-navy-800 text-white' : 'bg-elevated'
      }`}
    >
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-surface">
        <Image
          src={station.imagePath}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        {/* The system type, not a marketing tier. The tier labels this used to
            show (Стартова, Популярна, Розширена…) were invented and the owner
            had to ask what one meant; grid-tied vs hybrid is the distinction a
            shopper actually decides on. */}
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
            isCustom ? 'bg-gold-500 text-navy-900' : 'bg-gold-500/10 text-gold-700'
          }`}
        >
          {t(`systemTypes.${station.systemType}`)}
        </span>

        <h3 className={`mt-4 text-xl ${isCustom ? 'text-white' : 'text-navy-800'}`}>
          {translation.title}
        </h3>

        {station.powerKw !== null ? (
          <p className={`mt-1 text-3xl font-light tracking-[-0.03em] ${isCustom ? "text-gold-400" : "text-gold-600"}`}>
            {station.powerKw} <span className="text-base font-medium">{t('kwUnit')}</span>
          </p>
        ) : null}

        {/* Grows to fill, so the rule, price and link below sit on the same
            line across the row regardless of how long each intro runs. */}
        <p className={`mt-3 flex-1 text-sm ${isCustom ? 'text-white/70' : 'text-muted'}`}>
          {translation.intro}
        </p>

        {/* Kit price on the card too, so the catalogue can be compared at a
            glance the way a visitor actually shops. The install range stays on
            the detail page — a card is too small to carry the caveat that has
            to travel with it, and the number without the caveat is the
            misleading half. */}
        <p
          className={`mt-5 border-t pt-4 text-xl ${
            isCustom ? 'border-white/15 text-white' : 'border-border text-navy-800'
          }`}
        >
          {station.pricing ? (
            <>
              {t('from')}{' '}
              {new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: 'UAH',
                maximumFractionDigits: 0,
              }).format(station.pricing.equipmentUah)}
            </>
          ) : (
            t('priceOnRequest')
          )}
        </p>

        {/* Two lines reserved: the standard label wraps at five columns and
            the custom one does not, and the rule above would otherwise sit a
            line higher on that one card. */}
        <span
          className={`mt-6 block min-h-10 text-sm font-semibold underline-offset-4 group-hover:underline ${
            isCustom ? 'text-gold-400' : 'text-navy-800'
          }`}
        >
          {isCustom ? t('customCta') : t('cta')}
        </span>
      </div>
    </Link>
  );
}
