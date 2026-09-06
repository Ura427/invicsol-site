import type { StationModel, StationTranslationModel } from '@/generated/prisma/models';

/** Documented station-slug vocabulary. Kept in sync with the `stations/[slug]` route params. */
export type StationSlug = '5kw' | '10kw' | '15kw' | '30kw' | 'custom';
export const STATION_SLUGS: readonly StationSlug[] = ['5kw', '10kw', '15kw', '30kw', 'custom'];

export type SystemType = 'grid-tied' | 'hybrid' | 'custom';
export type StationAccent = 'default' | 'gold';

export interface ParsedStation {
  id: string;
  slug: StationSlug;
  powerKw: number | null;
  systemType: SystemType;
  accent: StationAccent;
  sortOrder: number;
  imagePath: string;
  isPlaceholder: boolean;
}

export interface ParsedStationTranslation {
  badge: string;
  title: string;
  intro: string;
  suitableFor: readonly string[];
  outcomes: readonly string[];
  kitMain: readonly string[];
  kitExtra: readonly string[];
  benefits: readonly string[];
  specPurpose: string;
  specScalability: string;
}

function isStationSlug(value: string): value is StationSlug {
  return (STATION_SLUGS as readonly string[]).includes(value);
}

function isSystemType(value: string): value is SystemType {
  return value === 'grid-tied' || value === 'hybrid' || value === 'custom';
}

function isAccent(value: string): value is StationAccent {
  return value === 'default' || value === 'gold';
}

function parseStringArray(value: unknown, field: string): readonly string[] {
  if (!Array.isArray(value) || !value.every((item) => typeof item === 'string')) {
    throw new Error(
      `Station translation field "${field}" is not a JSON string array: ${JSON.stringify(value)}`,
    );
  }
  return value;
}

/**
 * The single seam between raw Prisma rows and the typed shape the rest of the app
 * uses. Bad seed data (an unknown slug, a malformed JSON array column) throws here,
 * loudly, at build time — not silently at render time.
 */
export function parseStation(row: StationModel): ParsedStation {
  if (!isStationSlug(row.slug)) {
    throw new Error(`Unknown station slug in database: "${row.slug}"`);
  }
  if (!isSystemType(row.systemType)) {
    throw new Error(`Unknown station systemType: "${row.systemType}"`);
  }
  if (!isAccent(row.accent)) {
    throw new Error(`Unknown station accent: "${row.accent}"`);
  }
  return {
    id: row.id,
    slug: row.slug,
    powerKw: row.powerKw,
    systemType: row.systemType,
    accent: row.accent,
    sortOrder: row.sortOrder,
    imagePath: row.imagePath,
    isPlaceholder: row.isPlaceholder,
  };
}

export function parseStationTranslation(row: StationTranslationModel): ParsedStationTranslation {
  return {
    badge: row.badge,
    title: row.title,
    intro: row.intro,
    suitableFor: parseStringArray(row.suitableFor, 'suitableFor'),
    outcomes: parseStringArray(row.outcomes, 'outcomes'),
    kitMain: parseStringArray(row.kitMain, 'kitMain'),
    kitExtra: parseStringArray(row.kitExtra, 'kitExtra'),
    benefits: parseStringArray(row.benefits, 'benefits'),
    specPurpose: row.specPurpose,
    specScalability: row.specScalability,
  };
}
