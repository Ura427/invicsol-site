import type { ObjectType, UsageType, MountType } from './parse';

export type CapacityBand = '0-10' | '10-20' | '20+';

export interface ProjectFilters {
  type: ObjectType | null;
  usage: UsageType | null;
  capacity: CapacityBand | null;
}

const OBJECT_TYPES: readonly ObjectType[] = ['house', 'business'];
const USAGE_TYPES: readonly UsageType[] = ['self', 'green-tariff', 'hybrid-backup'];
const CAPACITY_BANDS: readonly CapacityBand[] = ['0-10', '10-20', '20+'];

function readOne<T extends string>(
  searchParams: Record<string, string | string[] | undefined>,
  key: string,
  allowed: readonly T[],
): T | null {
  const raw = searchParams[key];
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value !== undefined && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : null;
}

/**
 * Reads `?type=house&usage=green-tariff&kw=10-20` into typed, validated filters.
 * An unrecognized or malformed value is treated as "no filter" rather than thrown —
 * a stray query param must never 500 a page that a visitor bookmarked or shared.
 */
export function parseProjectFilters(
  searchParams: Record<string, string | string[] | undefined>,
): ProjectFilters {
  return {
    type: readOne(searchParams, 'type', OBJECT_TYPES),
    usage: readOne(searchParams, 'usage', USAGE_TYPES),
    capacity: readOne(searchParams, 'kw', CAPACITY_BANDS),
  };
}

interface PrismaProjectWhere {
  objectType?: ObjectType;
  usage?: UsageType;
  capacityKw?: { gte?: number; lt?: number };
}

/** Translates validated filters into a Prisma `where` clause. Pure, no DB access. */
export function toPrismaWhere(filters: ProjectFilters): PrismaProjectWhere {
  const where: PrismaProjectWhere = {};
  if (filters.type) where.objectType = filters.type;
  if (filters.usage) where.usage = filters.usage;
  if (filters.capacity === '0-10') where.capacityKw = { lt: 10 };
  if (filters.capacity === '10-20') where.capacityKw = { gte: 10, lt: 20 };
  if (filters.capacity === '20+') where.capacityKw = { gte: 20 };
  return where;
}
