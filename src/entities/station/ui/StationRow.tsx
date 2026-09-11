import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { ParsedStation, ParsedStationTranslation } from '@/entities/station/parse';

interface StationRowProps {
  station: ParsedStation;
  translation: ParsedStationTranslation;
}

/**
 * The phone-width form of StationCard: one row per station, so the whole
 * catalogue fits a screen and can be compared at a glance. Five stacked cards
 * were 3,700px of scrolling for a list of five things. Same link, same data —
 * the intro is the one thing dropped, because at this size a row is a menu,
 * not a brochure.
 */
export function StationRow({ station, translation }: StationRowProps) {
  const t = useTranslations('Stations');
  const locale = useLocale();
  const isCustom = station.accent === 'gold';

  return (
    <Link
      href={`/stations/${station.slug}`}
      className={`flex min-h-[5.5rem] items-center gap-4 rounded-[var(--radius-lg)] p-3 transition-colors ${
        isCustom ? 'bg-navy-800 text-white' : 'bg-elevated active:bg-surface'
      }`}
    >
      <div className="bg-surface relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-[var(--radius-sm)]">
        <Image
          src={station.imagePath}
          alt=""
          fill
          sizes="72px"
          className="object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`text-xs font-medium tracking-[0.08em] uppercase ${
            isCustom ? 'text-gold-400' : 'text-gold-700'
          }`}
        >
          {t(`systemTypes.${station.systemType}`)}
        </p>
        <p
          className={`mt-0.5 text-base leading-snug ${isCustom ? 'text-white' : 'text-navy-800'}`}
        >
          {translation.title}
        </p>
        <p className={`mt-1 text-sm ${isCustom ? 'text-white/70' : 'text-muted'}`}>
          {station.pricing ? (
            <>
              {t('from')}{' '}
              <span className={isCustom ? 'text-white' : 'text-navy-800'}>
                {new Intl.NumberFormat(locale, {
                  style: 'currency',
                  currency: 'UAH',
                  maximumFractionDigits: 0,
                }).format(station.pricing.equipmentUah)}
              </span>
            </>
          ) : (
            t('priceOnRequest')
          )}
        </p>
      </div>

      <ChevronRight
        className={`h-5 w-5 shrink-0 ${isCustom ? 'text-gold-400' : 'text-muted'}`}
        aria-hidden
      />
    </Link>
  );
}
