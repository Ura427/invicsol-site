import { notFound } from 'next/navigation';
import { getProjectBySlug } from '@/entities/project/queries';
import { ProjectDetailContent } from '@/entities/project/ui/ProjectDetailContent';
import { ProjectModal } from '@/widgets/project-modal/ProjectModal';

/**
 * Intercepts client-side navigation from the gallery to /projects/[slug] and
 * renders it as a modal over the gallery instead of a full page swap — the
 * customer stays in browsing context while comparing installations. Refreshing
 * this URL (or opening it directly) does NOT hit this file; Next serves the
 * real .../projects/[slug]/page.tsx instead, because route interception only
 * applies to same-app navigation.
 *
 * No generateStaticParams / dynamicParams here — this route only ever renders
 * as a result of client navigation already inside a built page, so it's fine
 * for it to render on demand rather than being statically generated itself.
 */
export default async function InterceptedProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  const data = await getProjectBySlug(slug, locale);
  if (!data) notFound();
  const { project, translation, images } = data;

  return (
    <ProjectModal>
      <ProjectDetailContent
        locale={locale}
        project={project}
        translation={translation}
        images={images}
      />
    </ProjectModal>
  );
}
