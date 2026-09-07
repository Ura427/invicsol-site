import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { ProjectsFilters } from '@/widgets/projects-filters';
import { ProjectsGrid, GridSkeleton } from '@/widgets/projects-grid';
import { parseProjectFilters } from '@/entities/project/filters';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Projects' });
  return { title: t('pageTitle'), description: t('pageDescription') };
}

interface ProjectsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ProjectsPage({ params, searchParams }: ProjectsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Projects');
  const resolvedSearchParams = await searchParams;
  const filters = parseProjectFilters(resolvedSearchParams);

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <SectionHeading title={t('pageTitle')} description={t('pageDescription')} align="left" />

      <div className="mt-8">
        <ProjectsFilters />
      </div>

      <Suspense fallback={<GridSkeleton />} key={JSON.stringify(filters)}>
        <ProjectsGrid filters={filters} />
      </Suspense>
    </div>
  );
}
