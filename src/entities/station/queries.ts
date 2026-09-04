import { db } from '@/shared/lib/db';
import { STATION_SLUGS, parseStation, parseStationTranslation, type StationSlug } from './parse';

/** All stations, base rows only, ordered for the catalogue grid. */
export async function getAllStations() {
  const rows = await db.station.findMany({ orderBy: { sortOrder: 'asc' } });
  return rows.map(parseStation);
}

export async function getStationBySlug(slug: string, locale: string) {
  if (!(STATION_SLUGS as readonly string[]).includes(slug)) return null;

  const row = await db.station.findUnique({
    where: { slug: slug as StationSlug },
    include: { translations: { where: { locale } } },
  });
  if (!row) return null;

  const translationRow = row.translations[0];
  if (!translationRow) return null;

  return { station: parseStation(row), translation: parseStationTranslation(translationRow) };
}

export async function getStationTranslations(stationIds: readonly string[], locale: string) {
  const rows = await db.stationTranslation.findMany({
    where: { stationId: { in: [...stationIds] }, locale },
  });
  return new Map(rows.map((row) => [row.stationId, parseStationTranslation(row)]));
}
