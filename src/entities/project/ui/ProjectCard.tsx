import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { ParsedProject, ParsedProjectTranslation } from '@/entities/project/parse';
import { PlaceholderBadge } from '@/shared/ui/PlaceholderBadge';

interface ProjectCardProps {
  project: ParsedProject;
  translation: ParsedProjectTranslation;
}

export function ProjectCard({ project, translation }: ProjectCardProps) {
  const t = useTranslations('Projects');

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group border-border shadow-card relative block overflow-hidden rounded-2xl border bg-white transition-transform hover:-translate-y-1"
    >
      {project.isPlaceholder ? <PlaceholderBadge label={t('placeholderBadge')} /> : null}

      {/* eslint-disable-next-line @next/next/no-img-element -- build-time static gallery, next/image adds no benefit here */}
      <img src={project.coverImage} alt="" className="aspect-[4/3] w-full object-cover" />

      <div className="p-5">
        <h3 className="text-navy-800 text-lg font-semibold">{translation.title}</h3>
        <p className="text-muted mt-1 text-sm">{translation.summary}</p>
        <p className="text-gold-600 mt-3 text-sm font-semibold">{project.capacityKw} kW</p>
      </div>
    </Link>
  );
}
