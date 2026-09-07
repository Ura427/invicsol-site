import { useTranslations } from 'next-intl';
import type { ParsedStation } from '@/entities/station/parse';

/**
 * Formats hryvnia without decimals — a solar station quoted to the kopiyka
 * reads as false precision, and the figures are round numbers anyway.
 */
function formatUah(locale: string, value: number): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0,
  }).format(value);
}

interface StationPriceProps {
  station: ParsedStation;
  locale: string;
  /** 'full' shows the install range and its caveat; 'compact' is for cards. */
  variant?: 'full' | 'compact';
}

/**
 * The equipment price and the installation range, always together.
 *
 * They are never merged into a single turnkey figure, and the kit price is
 * never shown alone. On its own, an equipment price is the "beautiful but
 * untrue number" the FAQ argues against: the visitor anchors on it, then meets
 * mounting and labour later. Publishing the range alongside keeps the site
 * visit as the thing that produces the final figure while still giving people
 * something concrete to budget against.
 */
export function StationPrice({ station, locale, variant = 'full' }: StationPriceProps) {
  const t = useTranslations('Stations');
  const { pricing } = station;

  if (!pricing) {
    return <p className="text-navy-800 text-xl">{t('priceOnRequest')}</p>;
  }

  const hasRange = pricing.installMinUah !== null && pricing.installMaxUah !== null;

  if (variant === 'compact') {
    return (
      <p className="text-navy-800 text-2xl leading-none">
        {formatUah(locale, pricing.equipmentUah)}
      </p>
    );
  }

  return (
    <div>
      <p className="text-muted text-xs tracking-[0.08em] uppercase">{t('priceEquipment')}</p>
      <p className="text-navy-800 mt-2 text-4xl leading-none sm:text-5xl">
        {formatUah(locale, pricing.equipmentUah)}
      </p>

      {hasRange ? (
        <div className="border-border mt-5 border-t pt-5">
          <p className="text-muted text-xs tracking-[0.08em] uppercase">{t('priceInstall')}</p>
          <p className="text-navy-800 mt-2 text-xl">
            {t('from')} {formatUah(locale, pricing.installMinUah as number)} –{' '}
            {formatUah(locale, pricing.installMaxUah as number)}
          </p>
          <p className="text-muted mt-2 max-w-[42ch] text-sm leading-relaxed">
            {t('priceInstallNote')}
          </p>
        </div>
      ) : null}
    </div>
  );
}
