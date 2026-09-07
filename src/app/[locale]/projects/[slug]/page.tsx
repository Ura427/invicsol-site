import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getProjectBySlug, getAllProjectSlugs } from '@/entities/project/queries';
import { ProjectDetailContent } from '@/entities/project/ui/ProjectDetailContent';

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  const params: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const data = await getProjectBySlug(slug, locale);
  if (!data) return {};
  return { title: data.translation.title, description: data.translation.summary };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const data = await getProjectBySlug(slug, locale);
  if (!data) notFound();
  const { project, translation, images } = data;

  return (
    <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
      <ProjectDetailContent
        locale={locale}
        project={project}
        translation={translation}
        images={images}
      />
    </div>
  );
}
