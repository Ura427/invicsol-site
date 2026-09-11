import { useTranslations, useLocale } from 'next-intl';
import { getContent } from '@/shared/lib/content';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { ICONS } from '@/shared/ui/icons';
import { ChevronDown } from 'lucide-react';

/**
 * A hairline-ruled grid rather than six filled cards: the rules do the
 * separating, so the six services read as one specification sheet instead of
 * six competing objects. Deliberately a different composition from the
 * photo-and-list split in WhyUs directly above — three card grids stacked in a
 * row was what made this page feel generic in the first place.
 *
 * The rules come from a 1px grid gap over a border-coloured parent, so every
 * cell divider lands correctly at each breakpoint without per-cell nth-child
 * border rules that have to be rewritten every time the column count changes.
 */
export function ServicesTeaser() {
  const t = useTranslations('Services');
  const locale = useLocale();
  const { services } = getContent(locale);

  return (
    <section id="services" className="bg-surface scroll-mt-24 py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t('eyebrow')}
          title={t('heading')}
          description={t('teaser')}
        />

        {/* On a phone the six services are an accordion: title rows, tap to
            read. Native <details>, so it is keyboard-operable and needs no
            script; the first is open so the pattern is obvious. */}
        <div className="border-border divide-border mt-8 divide-y border-y sm:hidden">
          {services.map((service, index) => {
            const Icon = ICONS[service.icon];
            return (
              <details key={service.id} className="group" open={index === 0}>
                <summary className="text-navy-800 flex min-h-14 cursor-pointer list-none items-center gap-4 py-3.5 [&::-webkit-details-marker]:hidden">
                  <Icon className="text-gold-700 h-5 w-5 shrink-0" aria-hidden />
                  <span className="flex-1 text-base">{service.title}</span>
                  <ChevronDown
                    className="text-muted h-4 w-4 shrink-0 transition-transform group-open:rotate-180"
                    aria-hidden
                  />
                </summary>
                <p className="text-muted pb-5 pl-9 text-sm leading-relaxed">
                  {service.text}
                </p>
              </details>
            );
          })}
        </div>

        <div className="bg-border border-border mt-14 hidden gap-px border-y sm:grid sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = ICONS[service.icon];
            return (
              <div key={service.id} className="bg-surface px-7 py-9">
                <Icon className="text-gold-700 h-6 w-6" aria-hidden />
                <h3 className="text-navy-800 mt-5 text-lg">{service.title}</h3>
                <p className="text-muted mt-2.5 max-w-[46ch] text-sm leading-relaxed">
                  {service.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
