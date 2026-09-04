'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ProjectCard } from '@/entities/project/ui/ProjectCard';
import type { ParsedProject, ParsedProjectTranslation } from '@/entities/project/parse';

interface ProjectsCarouselClientProps {
  items: readonly { project: ParsedProject; translation: ParsedProjectTranslation }[];
}

export function ProjectsCarouselClient({ items }: ProjectsCarouselClientProps) {
  const t = useTranslations('Projects');
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', slidesToScroll: 1 });

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="-ml-6 flex">
          {items.map(({ project, translation }) => (
            <div key={project.id} className="min-w-0 flex-[0_0_85%] pl-6 sm:flex-[0_0_45%] lg:flex-[0_0_31%]">
              <ProjectCard project={project} translation={translation} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          onClick={() => emblaApi?.scrollPrev()}
          aria-label={t('viewAll')}
          className="border-border text-navy-800 hover:bg-navy-800 flex h-10 w-10 items-center justify-center rounded-full border transition-colors hover:text-white"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => emblaApi?.scrollNext()}
          aria-label={t('viewAll')}
          className="border-border text-navy-800 hover:bg-navy-800 flex h-10 w-10 items-center justify-center rounded-full border transition-colors hover:text-white"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
