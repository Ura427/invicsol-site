import { useTranslations, useLocale } from 'next-intl';
import { getContent } from '@/shared/lib/content';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { Card } from '@/shared/ui/Card';
import { ICONS } from '@/shared/ui/icons';
import { RevealCard } from './RevealCard';

export function WhyUs() {
  const t = useTranslations('WhyUs');
  const locale = useLocale();
  const { why } = getContent(locale);

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <SectionHeading title={t('heading')} />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {why.map((card, index) => {
          const Icon = ICONS[card.icon];
          return (
            <RevealCard key={card.id} delayMs={index * 80}>
              {/* No hover lift or hover shadow: this design has no elevation
                  layer to lift into. The icon square is the only accent. */}
              <Card className="h-full">
                <div className="bg-gold-500/10 flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)]">
                  <Icon className="text-gold-700 h-5 w-5" aria-hidden />
                </div>
                <h3 className="text-navy-800 mt-6 text-lg">{card.title}</h3>
                <p className="text-muted mt-2.5 text-sm leading-relaxed">{card.text}</p>
              </Card>
            </RevealCard>
          );
        })}
      </div>
    </section>
  );
}
