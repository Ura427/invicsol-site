import { getTranslations, getLocale } from 'next-intl/server';
import { getFilteredProjects } from '@/entities/project/queries';
import { ProjectCard } from '@/entities/project/ui/ProjectCard';
import type { ProjectFilters } from '@/entities/project/filters';

export async function ProjectsGrid({ filters }: { filters: ProjectFilters }) {
  const locale = await getLocale();
  const t = await getTranslations('Projects');
  const results = await getFilteredProjects(filters, locale);

  if (results.length === 0) {
    return <p className="text-muted mt-12 text-center">{t('empty')}</p>;
  }

  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {results.map(({ project, translation }) => (
        <ProjectCard key={project.id} project={project} translation={translation} />
      ))}
    </div>
  );
}
