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
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading title={t('heading')} />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {why.map((card, index) => {
          const Icon = ICONS[card.icon];
          return (
            <RevealCard key={card.id} delayMs={index * 80}>
              <Card className="h-full">
                <Icon className="text-gold-600 h-8 w-8" aria-hidden />
                <h3 className="text-navy-800 mt-4 text-lg font-semibold">{card.title}</h3>
                <p className="text-muted mt-2 text-sm">{card.text}</p>
              </Card>
            </RevealCard>
          );
        })}
      </div>
    </section>
  );
}
