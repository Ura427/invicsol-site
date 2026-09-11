import { getTranslations, getLocale } from 'next-intl/server';
import { getAllStations, getStationTranslations } from '@/entities/station/queries';
import { StationCard } from '@/entities/station/ui/StationCard';
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
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stations.map((station) => {
          const translation = translations.get(station.id);
          if (!translation) return null;
          return (
            <StationCard key={station.id} station={station} translation={translation} />
          );
        })}
      </div>
    </section>
  );
}
