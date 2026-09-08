'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/shared/lib/db';
import { requireAdmin } from '@/shared/lib/admin-session';
import {
  validateProjectForm,
  deriveLocationKey,
  type ProjectFormValues,
  type ProjectCopy,
} from '@/entities/project/form';

export type { ProjectFormValues, ProjectCopy };

/**
 * Prisma's unique-constraint code. A duplicate web address is the one failure a
 * content editor will actually hit — two projects in the same town written in
 * the same week — and it used to surface as the same generic "could not save"
 * as everything else, with nothing to act on.
 */
const UNIQUE_VIOLATION = 'P2002';

/**
 * Expected failures are returned, not thrown.
 *
 * Next strips a thrown error's message in production and hands the client an
 * opaque digest instead — deliberately, so a stack trace cannot leak — which
 * means "this web address is taken" would reach the user as the same blank
 * failure as a dropped database connection. Genuine faults still throw and are
 * still caught by error.tsx. This mirrors LeadSubmissionResult on the public
 * side.
 */
export type ProjectSaveResult =
  | { ok: true }
  | { ok: false; error: 'duplicate_slug' | 'invalid'; field?: string };

function isUniqueViolation(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === UNIQUE_VIOLATION;
}

/** Every write goes through here, so no path can skip validation. */
function toProjectData(values: ProjectFormValues) {
  return {
    slug: values.slug,
    capacityKw: values.capacityKw,
    objectType: values.objectType,
    usage: values.usage,
    mountType: values.mountType,
    locationKey: deriveLocationKey(values),
    completedAt: new Date(values.completedAt),
    coverImage: values.coverImage,
    isPlaceholder: values.isPlaceholder,
  };
}

import type { ObjectType, UsageType, MountType } from '@/entities/project/parse';

export interface ProjectListItem {
  id: string;
  slug: string;
  capacityKw: number;
  objectType: string;
  usage: string;
  completedAt: string;
  isPlaceholder: boolean;
  title: string;
}

/**
 * `locale` picks which translation supplies the list title. It used to be pinned
 * to 'uk', which left the English admin listing rows by their Ukrainian names —
 * the one thing on the page that ignored the language switch.
 *
 * Both translations are fetched rather than one, so a project that has yet to be
 * translated into the requested language falls back to the other one instead of
 * showing its slug. The slug remains the last resort.
 */
export async function listProjects(locale: string = 'uk'): Promise<ProjectListItem[]> {
  await requireAdmin();

  const projects = await db.project.findMany({
    orderBy: { completedAt: 'desc' },
    include: { translations: true },
  });

  return projects.map((project) => {
    const preferred = project.translations.find((row) => row.locale === locale);
    const fallback = project.translations[0];

    return {
      id: project.id,
      slug: project.slug,
      capacityKw: project.capacityKw,
      objectType: project.objectType,
      usage: project.usage,
      completedAt: project.completedAt.toISOString(),
      isPlaceholder: project.isPlaceholder,
      title: preferred?.title || fallback?.title || project.slug,
    };
  });
}

export async function getProjectForEdit(id: string): Promise<ProjectFormValues | null> {
  await requireAdmin();

  const project = await db.project.findUnique({
    where: { id },
    include: { translations: true },
  });
  if (!project) return null;

  const empty: ProjectCopy = {
    title: '',
    locationName: '',
    summary: '',
    challenge: '',
    solution: '',
    result: '',
  };
  const copyFor = (locale: string): ProjectCopy => {
    const row = project.translations.find((t) => t.locale === locale);
    if (!row) return empty;
    return {
      title: row.title,
      locationName: row.locationName,
      summary: row.summary,
      challenge: row.challenge,
      solution: row.solution,
      result: row.result,
    };
  };

  return {
    slug: project.slug,
    capacityKw: project.capacityKw,
    objectType: project.objectType as ObjectType,
    usage: project.usage as UsageType,
    mountType: project.mountType as MountType,
    // yyyy-MM-dd for an <input type="date">.
    completedAt: project.completedAt.toISOString().slice(0, 10),
    coverImage: project.coverImage,
    isPlaceholder: project.isPlaceholder,
    uk: copyFor('uk'),
    en: copyFor('en'),
  };
}

async function upsertTranslations(
  projectId: string,
  values: Pick<ProjectFormValues, 'uk' | 'en'>,
): Promise<void> {
  for (const locale of ['uk', 'en'] as const) {
    const t = values[locale];
    await db.projectTranslation.upsert({
      where: { projectId_locale: { projectId, locale } },
      update: t,
      create: { projectId, locale, ...t },
    });
  }
}

export async function createProject(values: ProjectFormValues): Promise<ProjectSaveResult> {
  await requireAdmin();

  const problem = validateProjectForm(values);
  if (problem) return { ok: false, error: 'invalid', field: problem.field };

  let project;
  try {
    project = await db.project.create({ data: toProjectData(values) });
  } catch (error) {
    if (isUniqueViolation(error)) return { ok: false, error: 'duplicate_slug' };
    throw error;
  }

  await upsertTranslations(project.id, values);

  revalidatePath('/admin/projects');
  revalidatePath('/[locale]/projects', 'page');
  return { ok: true };
}

export async function updateProject(
  id: string,
  values: ProjectFormValues,
): Promise<ProjectSaveResult> {
  await requireAdmin();

  const problem = validateProjectForm(values);
  if (problem) return { ok: false, error: 'invalid', field: problem.field };

  try {
    await db.project.update({ where: { id }, data: toProjectData(values) });
  } catch (error) {
    if (isUniqueViolation(error)) return { ok: false, error: 'duplicate_slug' };
    throw error;
  }

  await upsertTranslations(id, values);

  revalidatePath('/admin/projects');
  revalidatePath('/[locale]/projects', 'page');
  revalidatePath('/[locale]/projects/[slug]', 'page');
  return { ok: true };
}

export async function deleteProject(id: string): Promise<void> {
  await requireAdmin();

  // ProjectTranslation and ProjectImage both cascade-delete via the schema's
  // onDelete: Cascade — deleting the base row is enough.
  await db.project.delete({ where: { id } });

  revalidatePath('/admin/projects');
  revalidatePath('/[locale]/projects', 'page');
}
