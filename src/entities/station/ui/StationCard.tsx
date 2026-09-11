import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { ParsedStation, ParsedStationTranslation } from '@/entities/station/parse';

interface StationCardProps {
  station: ParsedStation;
  translation: ParsedStationTranslation;
  /**
   * Five cards never tile in two or three columns; the last one sits alone.
   * `wide` lets the grid give it the rest of the row, laid out sideways so
   * the photo does not double in height with the width.
   */
  wide?: boolean;
}

/**
 * Kept separate from ProjectCard rather than unified behind a `variant` prop —
 * the two are visually similar but semantically different (a fixed catalogue
 * item vs. a filterable case study), and forcing them into one component would
 * couple their markup for no real reuse benefit.
 */
export function StationCard({ station, translation, wide = false }: StationCardProps) {
  const t = useTranslations('Stations');
  const locale = useLocale();
  const isCustom = station.accent === 'gold';

  return (
    <Link
      href={`/stations/${station.slug}`}
      className={`group flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] transition-transform duration-300 hover:-translate-y-0.5 ${
        isCustom ? 'bg-navy-800 text-white' : 'bg-elevated'
      } ${wide ? 'sm:flex-row xl:flex-col' : ''}`}
    >
      <div
        className={`relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-surface ${
          wide ? 'sm:aspect-auto sm:w-2/5 xl:aspect-[16/10] xl:w-full' : ''
        }`}
      >
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
          <p
            className={`mt-1 text-3xl font-light tracking-[-0.03em] ${isCustom ? 'text-gold-400' : 'text-gold-600'}`}
          >
            {station.powerKw}{' '}
            <span
              className={`text-base font-medium ${isCustom ? 'text-gold-400' : 'text-gold-700'}`}
            >
              {t('kwUnit')}
            </span>
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
        {/* The price is the one number a shopper compares across the row, so
            it gets the weight: a small label on its own line, then the figure
            large, never wrapped. Inter's digits are proportional — «118 000»
            with two narrow 1s fits a line that «468 000» does not. */}
        <div
          className={`mt-5 border-t pt-4 ${
            isCustom ? 'border-white/15' : 'border-border'
          }`}
        >
          {station.pricing ? (
            <>
              <p
                className={`text-xs font-medium tracking-[0.08em] uppercase ${
                  isCustom ? 'text-white/60' : 'text-muted'
                }`}
              >
                {t('priceEquipment')} · {t('from')}
              </p>
              <p
                className={`mt-1 text-2xl font-medium tracking-[-0.02em] whitespace-nowrap ${
                  isCustom ? 'text-white' : 'text-navy-800'
                }`}
              >
                {new Intl.NumberFormat(locale, {
                  style: 'currency',
                  currency: 'UAH',
                  maximumFractionDigits: 0,
                }).format(station.pricing.equipmentUah)}
              </p>
            </>
          ) : (
            <>
              <p className="text-xs font-medium tracking-[0.08em] text-white/60 uppercase">
                {t('priceEquipment')}
              </p>
              <p className="mt-1 text-lg leading-8 font-medium tracking-[-0.01em] whitespace-nowrap text-white">
                {t('priceOnRequest')}
              </p>
            </>
          )}
        </div>

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
