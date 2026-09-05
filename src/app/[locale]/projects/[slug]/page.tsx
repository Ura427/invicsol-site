import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getProjectBySlug, getAllProjectSlugs } from '@/entities/project/queries';

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
  const t = await getTranslations('Projects');

  const data = await getProjectBySlug(slug, locale);
  if (!data) notFound();
  const { project, translation, images } = data;

  // locationKey is a locale-neutral database value ("bryukhovychi"), resolved to a
  // display name here. Falls back to the raw key rather than throwing, so a location
  // added later through the admin panel degrades to something readable instead of a
  // 500 on a page a customer may already have bookmarked.
  const locationTranslationKey = `locations.${project.locationKey}`;
  const locationLabel = t.has(locationTranslationKey)
    ? t(locationTranslationKey)
    : project.locationKey;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="relative">
        {project.isPlaceholder ? (
          <span className="border-gold-500 text-gold-700 mb-4 inline-block rounded-full border bg-white px-3 py-1 text-xs font-semibold">
            {t('placeholderBadge')}
          </span>
        ) : null}
        <h1 className="text-navy-800 text-3xl font-extrabold sm:text-4xl">{translation.title}</h1>
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
          <h2 className="text-navy-800 text-lg font-bold">{t('challenge')}</h2>
          <p className="text-muted mt-2">{translation.challenge}</p>
        </div>
        <div>
          <h2 className="text-navy-800 text-lg font-bold">{t('solution')}</h2>
          <p className="text-muted mt-2">{translation.solution}</p>
        </div>
        <div>
          <h2 className="text-navy-800 text-lg font-bold">{t('result')}</h2>
          <p className="text-muted mt-2">{translation.result}</p>
        </div>
      </div>
    </div>
  );
}
