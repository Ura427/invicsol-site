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
  /**
   * Commercial data. `pricing` is null when no equipment price is set, so the
   * UI has one thing to check rather than three loose nullable numbers. The
   * install range is deliberately separate from the kit price — see the schema
   * comment for why a single turnkey figure is not published.
   */
  pricing: {
    equipmentUah: number;
    installMinUah: number | null;
    installMaxUah: number | null;
  } | null;
  inStock: boolean | null;
  /**
   * True while any commercial value above is a demo figure, not a real one.
   * The rating is not here on purpose: it is computed from approved reviews
   * (entities/review/queries.ts) and so can never be a demo value.
   */
  commercialIsPlaceholder: boolean;
}

/** One line of the bill of materials, with the photo the carousel shows for it. */
export interface KitItem {
  label: string;
  /** Path under public/, or null when there is no photo for this item. */
  image: string | null;
}

export interface ParsedStationTranslation {
  title: string;
  intro: string;
  suitableFor: readonly string[];
  outcomes: readonly string[];
  kitMain: readonly KitItem[];
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

/**
 * The main kit was a plain string array; it is now objects carrying a photo so
 * the equipment carousel can be built from it. Both shapes are accepted, with a
 * bare string mapped to `image: null`, so a row seeded before the change and a
 * row seeded after it both parse — the migration window must not 500 a page.
 */
function parseKitItems(value: unknown, field: string): readonly KitItem[] {
  if (!Array.isArray(value)) {
    throw new Error(`Station translation field "${field}" is not a JSON array`);
  }
  return value.map((item, index) => {
    if (typeof item === 'string') return { label: item, image: null };
    if (
      typeof item === 'object' &&
      item !== null &&
      typeof (item as { label?: unknown }).label === 'string' &&
      ((item as { image?: unknown }).image === null ||
        typeof (item as { image?: unknown }).image === 'string')
    ) {
      const { label, image } = item as { label: string; image: string | null };
      return { label, image };
    }
    throw new Error(`Station translation field "${field}"[${index}] is not a kit item`);
  });
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
  // A price of 0 is meaningless for a solar station and almost certainly a data
  // entry slip, so it is treated as "no price" rather than rendered as free.
  const equipmentUah = row.priceEquipmentUah;
  const pricing =
    equipmentUah !== null && equipmentUah > 0
      ? {
          equipmentUah,
          installMinUah: row.priceInstallMinUah,
          installMaxUah: row.priceInstallMaxUah,
        }
      : null;

  return {
    id: row.id,
    slug: row.slug,
    powerKw: row.powerKw,
    systemType: row.systemType,
    accent: row.accent,
    sortOrder: row.sortOrder,
    imagePath: row.imagePath,
    isPlaceholder: row.isPlaceholder,
    pricing,
    inStock: row.inStock,
    commercialIsPlaceholder: row.commercialIsPlaceholder,
  };
}

export function parseStationTranslation(row: StationTranslationModel): ParsedStationTranslation {
  return {
    title: row.title,
    intro: row.intro,
    suitableFor: parseStringArray(row.suitableFor, 'suitableFor'),
    outcomes: parseStringArray(row.outcomes, 'outcomes'),
    kitMain: parseKitItems(row.kitMain, 'kitMain'),
    kitExtra: parseStringArray(row.kitExtra, 'kitExtra'),
    benefits: parseStringArray(row.benefits, 'benefits'),
    specPurpose: row.specPurpose,
    specScalability: row.specScalability,
  };
}
