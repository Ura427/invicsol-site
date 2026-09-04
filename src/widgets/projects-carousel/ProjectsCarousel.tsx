import { getTranslations, getLocale } from 'next-intl/server';
import { getFilteredProjects } from '@/entities/project/queries';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { Button } from '@/shared/ui/Button';
import { ProjectsCarouselClient } from './ProjectsCarouselClient';

const HOMEPAGE_PROJECT_COUNT = 6;

export async function ProjectsCarousel() {
  const locale = await getLocale();
  const t = await getTranslations('Projects');
  const results = await getFilteredProjects({ type: null, usage: null, capacity: null }, locale);
  const recent = results.slice(0, HOMEPAGE_PROJECT_COUNT);

  if (recent.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading title={t('heading')} description={t('teaser')} />
      <div className="mt-12">
        <ProjectsCarouselClient items={recent} />
      </div>
      <div className="mt-8 text-center">
        <Button href="/projects" variant="outline">
          {t('viewAll')}
        </Button>
      </div>
    </section>
  );
}
