import { useTranslations, useLocale } from 'next-intl';
import { Quote as QuoteIcon } from 'lucide-react';
import { getContent } from '@/shared/lib/content';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { Card } from '@/shared/ui/Card';
import { PlaceholderBadge } from '@/shared/ui/PlaceholderBadge';

export function Testimonials() {
  const t = useTranslations('Testimonials');
  const locale = useLocale();
  const { testimonials } = getContent(locale);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading title={t('heading')} />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="relative overflow-hidden">
            {testimonial.isPlaceholder ? <PlaceholderBadge label={t('placeholderBadge')} /> : null}
            <QuoteIcon
              className="text-gold-500/15 absolute -top-2 -left-1 h-16 w-16"
              aria-hidden
              strokeWidth={1.5}
            />
            <p className="text-navy-800 relative text-sm leading-relaxed italic">
              &ldquo;{testimonial.text}&rdquo;
            </p>
            <p className="text-navy-800 mt-4 text-sm font-semibold">{testimonial.author}</p>
            <p className="text-muted text-xs">{testimonial.role}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
