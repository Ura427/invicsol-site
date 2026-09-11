import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { ParsedProject, ParsedProjectTranslation } from '@/entities/project/parse';
import { PlaceholderBadge } from '@/shared/ui/PlaceholderBadge';

interface ProjectCardProps {
  project: ParsedProject;
  translation: ParsedProjectTranslation;
  /** For the first row of a grid, which is the page's largest paint. */
  priority?: boolean;
}

export function ProjectCard({
  project,
  translation,
  priority = false,
}: ProjectCardProps) {
  const t = useTranslations('Projects');

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group bg-elevated relative block overflow-hidden rounded-[var(--radius-lg)] transition-transform duration-300 hover:-translate-y-0.5"
    >
      {project.isPlaceholder ? <PlaceholderBadge label={t('placeholderBadge')} /> : null}

      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
        <Image
          src={project.coverImage}
          // The photo IS the content here, not decoration — a screen reader user
          // scanning the gallery needs to know which installation this card shows.
          alt={translation.title}
          fill
          priority={priority}
          // Card is full width on mobile, half at sm, a third at lg — telling the
          // browser this stops it downloading a 3 MB original for a 400px slot.
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </div>

      <div className="p-5">
        <h2 className="text-navy-800 text-lg">{translation.title}</h2>
        <p className="text-muted mt-1 text-sm">{translation.summary}</p>
        <p className="text-gold-700 mt-3 text-sm font-semibold">
          {project.capacityKw} {t('kwUnit')}
        </p>
      </div>
    </Link>
  );
}
