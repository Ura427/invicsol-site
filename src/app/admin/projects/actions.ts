'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/shared/lib/db';
import { requireAdmin } from '@/shared/lib/admin-session';
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

export interface ProjectFormValues {
  slug: string;
  capacityKw: number;
  objectType: ObjectType;
  usage: UsageType;
  mountType: MountType;
  locationKey: string;
  completedAt: string;
  coverImage: string;
  isPlaceholder: boolean;
  uk: { title: string; summary: string; challenge: string; solution: string; result: string };
  en: { title: string; summary: string; challenge: string; solution: string; result: string };
}

export async function getProjectForEdit(id: string): Promise<ProjectFormValues | null> {
  await requireAdmin();

  const project = await db.project.findUnique({
    where: { id },
    include: { translations: true },
  });
  if (!project) return null;

  const uk = project.translations.find((t) => t.locale === 'uk');
  const en = project.translations.find((t) => t.locale === 'en');
  const empty = { title: '', summary: '', challenge: '', solution: '', result: '' };

  return {
    slug: project.slug,
    capacityKw: project.capacityKw,
    objectType: project.objectType as ObjectType,
    usage: project.usage as UsageType,
    mountType: project.mountType as MountType,
    locationKey: project.locationKey,
    // yyyy-MM-dd for an <input type="date">.
    completedAt: project.completedAt.toISOString().slice(0, 10),
    coverImage: project.coverImage,
    isPlaceholder: project.isPlaceholder,
    uk: uk ?? empty,
    en: en ?? empty,
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

export async function createProject(values: ProjectFormValues): Promise<void> {
  await requireAdmin();

  const project = await db.project.create({
    data: {
      slug: values.slug,
      capacityKw: values.capacityKw,
      objectType: values.objectType,
      usage: values.usage,
      mountType: values.mountType,
      locationKey: values.locationKey,
      completedAt: new Date(values.completedAt),
      coverImage: values.coverImage,
      isPlaceholder: values.isPlaceholder,
    },
  });

  await upsertTranslations(project.id, values);

  revalidatePath('/admin/projects');
  revalidatePath('/[locale]/projects', 'page');
}

export async function updateProject(id: string, values: ProjectFormValues): Promise<void> {
  await requireAdmin();

  await db.project.update({
    where: { id },
    data: {
      slug: values.slug,
      capacityKw: values.capacityKw,
      objectType: values.objectType,
      usage: values.usage,
      mountType: values.mountType,
      locationKey: values.locationKey,
      completedAt: new Date(values.completedAt),
      coverImage: values.coverImage,
      isPlaceholder: values.isPlaceholder,
    },
  });

  await upsertTranslations(id, values);

  revalidatePath('/admin/projects');
  revalidatePath('/[locale]/projects', 'page');
  revalidatePath('/[locale]/projects/[slug]', 'page');
}

export async function deleteProject(id: string): Promise<void> {
  await requireAdmin();

  // ProjectTranslation and ProjectImage both cascade-delete via the schema's
  // onDelete: Cascade — deleting the base row is enough.
  await db.project.delete({ where: { id } });

  revalidatePath('/admin/projects');
  revalidatePath('/[locale]/projects', 'page');
}
