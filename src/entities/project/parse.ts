import type { ProjectModel, ProjectTranslationModel, ProjectImageModel } from '@/generated/prisma/models';

/**
 * Kept IDENTICAL to the calculator wizard's own state unions (see
 * `src/widgets/calculator/model/types.ts`), so a calculator answer can later
 * deep-link into a filtered projects list of similar installations.
 */
export type ObjectType = 'house' | 'business';
export type UsageType = 'self' | 'green-tariff' | 'hybrid-backup';
export type MountType = 'roof' | 'ground';

function isObjectType(value: string): value is ObjectType {
  return value === 'house' || value === 'business';
}

function isUsageType(value: string): value is UsageType {
  return value === 'self' || value === 'green-tariff' || value === 'hybrid-backup';
}

function isMountType(value: string): value is MountType {
  return value === 'roof' || value === 'ground';
}

export interface ParsedProject {
  id: string;
  slug: string;
  capacityKw: number;
  objectType: ObjectType;
  usage: UsageType;
  mountType: MountType;
  locationKey: string;
  completedAt: Date;
  coverImage: string;
  isPlaceholder: boolean;
}

export interface ParsedProjectTranslation {
  title: string;
  /**
   * Empty for rows written before the column existed. Readers must fall back —
   * see ProjectDetailContent — rather than rendering a blank where the place
   * name should be.
   */
  locationName: string;
  summary: string;
  challenge: string;
  solution: string;
  result: string;
}

export function parseProject(row: ProjectModel): ParsedProject {
  if (!isObjectType(row.objectType)) {
    throw new Error(`Unknown project objectType: "${row.objectType}"`);
  }
  if (!isUsageType(row.usage)) {
    throw new Error(`Unknown project usage: "${row.usage}"`);
  }
  if (!isMountType(row.mountType)) {
    throw new Error(`Unknown project mountType: "${row.mountType}"`);
  }
  return {
    id: row.id,
    slug: row.slug,
    capacityKw: row.capacityKw,
    objectType: row.objectType,
    usage: row.usage,
    mountType: row.mountType,
    locationKey: row.locationKey,
    completedAt: row.completedAt,
    coverImage: row.coverImage,
    isPlaceholder: row.isPlaceholder,
  };
}

export function parseProjectTranslation(row: ProjectTranslationModel): ParsedProjectTranslation {
  return {
    title: row.title,
    locationName: row.locationName,
    summary: row.summary,
    challenge: row.challenge,
    solution: row.solution,
    result: row.result,
  };
}

export function parseProjectImage(row: ProjectImageModel): { path: string; sortOrder: number } {
  return { path: row.path, sortOrder: row.sortOrder };
}
