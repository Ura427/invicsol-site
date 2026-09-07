import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import type { ParsedProject, ParsedProjectTranslation } from '@/entities/project/parse';

interface ProjectDetailContentProps {
  locale: string;
  project: ParsedProject;
  translation: ParsedProjectTranslation;
  images: readonly { path: string; sortOrder: number }[];
}

/**
 * The actual project write-up — capacity/location/date, cover photo, and the
 * challenge/solution/result narrative. Shared between the full page at
 * /projects/[slug] and the intercepting-route modal so the two can never drift:
 * a bookmark or a shared link renders identically to what opening it from the
 * gallery showed.
 */
export async function ProjectDetailContent({
  locale,
  project,
  translation,
  images,
}: ProjectDetailContentProps) {
  const t = await getTranslations({ locale, namespace: 'Projects' });

  // locationKey is a locale-neutral database value ("bryukhovychi"), resolved to a
  // display name here. Falls back to the raw key rather than throwing, so a location
  // added later through the admin panel degrades to something readable instead of a
  // 500 on a page a customer may already have bookmarked.
  const locationTranslationKey = `locations.${project.locationKey}`;
  const locationLabel = t.has(locationTranslationKey)
    ? t(locationTranslationKey)
    : project.locationKey;

  return (
    <div>
      <div className="relative">
        {project.isPlaceholder ? (
          <span className="border-gold-500 text-gold-700 mb-4 inline-block rounded-full border bg-white px-3 py-1 text-xs font-semibold">
            {t('placeholderBadge')}
          </span>
        ) : null}
        <h1 className="text-navy-800 text-3xl sm:text-4xl">{translation.title}</h1>
        <p className="text-muted mt-3">{translation.summary}</p>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4 text-center">
        <div className="border-border rounded-xl border p-4">
          <p className="text-muted text-xs">{t('capacityLabel')}</p>
          <p className="text-navy-800 mt-1 font-semibold">
            {project.capacityKw} {t('kwUnit')}
          </p>
        </div>
        <div className="border-border rounded-xl border p-4">
          <p className="text-muted text-xs">{t('locationLabel')}</p>
          <p className="text-navy-800 mt-1 font-semibold">{locationLabel}</p>
        </div>
        <div className="border-border rounded-xl border p-4">
          <p className="text-muted text-xs">{t('completedLabel')}</p>
          <p className="text-navy-800 mt-1 font-semibold">
            {new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long' }).format(
              project.completedAt,
            )}
          </p>
        </div>
      </div>

      {images.length > 0 ? (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-gray-100">
          <Image
            src={project.coverImage}
            alt={translation.title}
            fill
            // Largest image on the page and above the fold — worth preloading.
            priority
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="mt-10 space-y-8">
        <div>
          <h2 className="text-navy-800 text-lg">{t('challenge')}</h2>
          <p className="text-muted mt-2">{translation.challenge}</p>
        </div>
        <div>
          <h2 className="text-navy-800 text-lg">{t('solution')}</h2>
          <p className="text-muted mt-2">{translation.solution}</p>
        </div>
        <div>
          <h2 className="text-navy-800 text-lg">{t('result')}</h2>
          <p className="text-muted mt-2">{translation.result}</p>
        </div>
      </div>
    </div>
  );
}
