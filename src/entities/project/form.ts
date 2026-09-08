import { toSlug, isValidSlug } from '@/shared/lib/slug';
import type { ObjectType, UsageType, MountType } from './parse';

export interface ProjectCopy {
  title: string;
  locationName: string;
  summary: string;
  challenge: string;
  solution: string;
  result: string;
}

export interface ProjectFormValues {
  slug: string;
  capacityKw: number;
  objectType: ObjectType;
  usage: UsageType;
  mountType: MountType;
  completedAt: string;
  coverImage: string;
  isPlaceholder: boolean;
  uk: ProjectCopy;
  en: ProjectCopy;
}

export type ProjectFormError =
  | { field: 'slug'; reason: 'missing' | 'malformed' }
  | { field: 'title'; reason: 'missing' }
  | { field: 'capacityKw'; reason: 'invalid' }
  | { field: 'completedAt'; reason: 'invalid' }
  | { field: 'coverImage'; reason: 'missing' }
  | { field: 'objectType' | 'usage' | 'mountType'; reason: 'unknown' };

const OBJECT_TYPES: readonly ObjectType[] = ['house', 'business'];
const USAGE_TYPES: readonly UsageType[] = ['self', 'green-tariff', 'hybrid-backup'];
const MOUNT_TYPES: readonly MountType[] = ['roof', 'ground'];

/**
 * Validates what the browser sends before any of it reaches the database.
 *
 * The form is a client component, so its values arrive as an ordinary server
 * action argument — which is to say, as whatever the caller chose to send. Until
 * now they were written straight through, so a hand-made request could put any
 * string at all into objectType, and the *public* site would then throw when
 * parse.ts refused to recognise it: a bad write taking down a page that has
 * nothing to do with the admin.
 *
 * Pure and synchronous so it can be unit-tested without a database, and so the
 * same rules can run in the form for instant feedback.
 */
export function validateProjectForm(values: ProjectFormValues): ProjectFormError | null {
  if (values.uk.title.trim() === '') return { field: 'title', reason: 'missing' };

  if (values.slug.trim() === '') return { field: 'slug', reason: 'missing' };
  if (!isValidSlug(values.slug)) return { field: 'slug', reason: 'malformed' };

  if (!Number.isFinite(values.capacityKw) || values.capacityKw <= 0) {
    return { field: 'capacityKw', reason: 'invalid' };
  }

  if (Number.isNaN(new Date(values.completedAt).getTime())) {
    return { field: 'completedAt', reason: 'invalid' };
  }

  if (values.coverImage.trim() === '') return { field: 'coverImage', reason: 'missing' };

  if (!OBJECT_TYPES.includes(values.objectType)) return { field: 'objectType', reason: 'unknown' };
  if (!USAGE_TYPES.includes(values.usage)) return { field: 'usage', reason: 'unknown' };
  if (!MOUNT_TYPES.includes(values.mountType)) return { field: 'mountType', reason: 'unknown' };

  return null;
}

/**
 * The locale-neutral key still stored on Project, now derived rather than typed.
 *
 * It is built from the Ukrainian name because that is the one always filled in;
 * English falls back for a project entered English-first. An empty result is
 * allowed through — locationKey has no uniqueness constraint and an unnamed
 * place is a blank label, not a broken page.
 */
export function deriveLocationKey(values: Pick<ProjectFormValues, 'uk' | 'en'>): string {
  return toSlug(values.uk.locationName || values.en.locationName);
}
