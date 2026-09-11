import { getTranslations, getLocale } from 'next-intl/server';
import { getAllStations, getStationTranslations } from '@/entities/station/queries';
import { StationCard } from '@/entities/station/ui/StationCard';
import { StationRow } from '@/entities/station/ui/StationRow';
import { SectionHeading } from '@/shared/ui/SectionHeading';

export async function StationGrid() {
  const locale = await getLocale();
  const t = await getTranslations('Stations');
  const stations = await getAllStations();
  const translations = await getStationTranslations(
    stations.map((s) => s.id),
    locale,
  );

  return (
    <section
      id="stations"
      className="mx-auto max-w-7xl scroll-mt-24 px-4 py-14 sm:py-20 lg:py-24 sm:px-6 lg:px-8"
    >
      <SectionHeading title={t('heading')} description={t('teaser')} />
      {/* Two compositions of the same list: rows on a phone, where five cards
          were most of the page, and the card grid from `sm` up. */}
      <ul className="mt-8 space-y-3 sm:hidden">
        {stations.map((station) => {
          const translation = translations.get(station.id);
          if (!translation) return null;
          return (
            <li key={station.id}>
              <StationRow station={station} translation={translation} />
            </li>
          );
        })}
      </ul>
      <div className="mt-12 hidden gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stations.map((station) => {
          const translation = translations.get(station.id);
          if (!translation) return null;
          const isLast = station.accent === 'gold';
          return (
            <div key={station.id} className={isLast ? 'sm:col-span-2 xl:col-span-1' : ''}>
              <StationCard station={station} translation={translation} wide={isLast} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
