import { useTranslations, useLocale } from 'next-intl';
import { getContent } from '@/shared/lib/content';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { Button } from '@/shared/ui/Button';
import { ICONS } from '@/shared/ui/icons';

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
    <section className="bg-surface py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={t('eyebrow')} title={t('heading')} description={t('teaser')} />

        <div className="bg-border border-border mt-14 grid gap-px border-y sm:grid-cols-2 lg:grid-cols-3">
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

        <div className="mt-12">
          <Button href="/services" variant="outline">
            {t('viewAll')}
          </Button>
        </div>
      </div>
    </section>
  );
}
