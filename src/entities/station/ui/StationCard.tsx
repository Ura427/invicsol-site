import { useTranslations } from 'next-intl';
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
  const isCustom = station.accent === 'gold';

  return (
    <Link
      href={`/stations/${station.slug}`}
      className={`group border-border shadow-card block h-full rounded-2xl border p-6 transition-transform hover:-translate-y-1 ${
        isCustom ? 'bg-navy-800 border-navy-800 text-white' : 'bg-white'
      }`}
    >
      <span
        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
          isCustom ? 'bg-gold-500 text-navy-900' : 'bg-gold-500/10 text-gold-600'
        }`}
      >
        {translation.badge}
      </span>

      <h3 className={`mt-4 text-xl font-bold ${isCustom ? 'text-white' : 'text-navy-800'}`}>
        {translation.title}
      </h3>

      {station.powerKw !== null ? (
        <p className={`mt-1 text-3xl font-extrabold ${isCustom ? 'text-gold-400' : 'text-gold-600'}`}>
          {station.powerKw} <span className="text-base font-medium">{t('kwUnit')}</span>
        </p>
      ) : null}

      <p className={`mt-3 text-sm ${isCustom ? 'text-white/70' : 'text-muted'}`}>{translation.intro}</p>

      <span
        className={`mt-6 inline-block text-sm font-semibold underline-offset-4 group-hover:underline ${
          isCustom ? 'text-gold-400' : 'text-navy-800'
        }`}
      >
        {isCustom ? t('customCta') : t('cta')}
      </span>
    </Link>
  );
}
