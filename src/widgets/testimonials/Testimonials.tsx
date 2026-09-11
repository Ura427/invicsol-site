import { useTranslations, useLocale } from 'next-intl';
import { Quote as QuoteIcon } from 'lucide-react';
import { getContent } from '@/shared/lib/content';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { Card } from '@/shared/ui/Card';

/**
 * Initials rather than a stock headshot: these cards are explicitly
 * placeholder ("Sample review"), and pairing a fabricated quote with a real,
 * identifiable stranger's photo would misrepresent that person as a client —
 * a step past the generic object photography used for stations/projects.
 */
function initialFrom(role: string): string {
  return role.trim().charAt(0).toUpperCase();
}

export function Testimonials() {
  const t = useTranslations('Testimonials');
  const locale = useLocale();
  const { testimonials } = getContent(locale);
  const realTestimonials = testimonials.filter((item) => !item.isPlaceholder);
  if (realTestimonials.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:py-20 lg:py-24 sm:px-6 lg:px-8">
      <SectionHeading title={t('heading')} />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {realTestimonials.map((testimonial) => (
          <Card key={testimonial.id} className="relative overflow-hidden">
            <QuoteIcon
              className="text-gold-500/15 absolute -top-2 -left-1 h-16 w-16"
              aria-hidden
              strokeWidth={1.5}
            />
            <p className="text-navy-800 relative text-sm leading-relaxed italic">
              &ldquo;{testimonial.text}&rdquo;
            </p>
            <div className="relative mt-4 flex items-center gap-3">
              <div
                className="bg-gold-500/10 text-gold-700 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                aria-hidden
              >
                {initialFrom(testimonial.role)}
              </div>
              <div>
                <p className="text-navy-800 text-sm font-semibold">
                  {testimonial.author}
                </p>
                <p className="text-muted text-xs">{testimonial.role}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
