import { setRequestLocale } from 'next-intl/server';
import { getContent } from '@/shared/lib/content';
import { buildFaqPageJsonLd } from '@/shared/lib/jsonld';
import { Hero } from '@/widgets/hero';
import { WhyUs } from '@/widgets/why-us';
import { ServicesTeaser } from '@/widgets/services-teaser';
import { StationGrid } from '@/widgets/station-grid';
import { ProjectsCarousel } from '@/widgets/projects-carousel';
import { Stats } from '@/widgets/stats';
import { Expertise } from '@/widgets/expertise';
import { Quote } from '@/widgets/quote';
import { Testimonials } from '@/widgets/testimonials';
import { Faq } from '@/widgets/faq';
import { ContactForm } from '@/widgets/contact-form';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { faq } = getContent(locale);
  const faqJsonLd = buildFaqPageJsonLd(faq);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Hero />
      <WhyUs />
      <ServicesTeaser />
      <StationGrid />
      {/* Backgrounds below are deliberately alternated (white/surface/navy)
          so no two adjacent homepage sections share the same background —
          several of these widgets are transparent by default so they can be
          reused elsewhere (e.g. StationGrid on /stations) without carrying
          a homepage-specific color; the wrapping here is homepage-only. */}
      <div className="bg-surface">
        <ProjectsCarousel />
      </div>
      <Stats />
      <Expertise />
      <Quote />
      <div className="bg-surface">
        <Testimonials />
      </div>
      <Faq />
      <div className="bg-surface">
        <ContactForm />
      </div>
    </>
  );
}
