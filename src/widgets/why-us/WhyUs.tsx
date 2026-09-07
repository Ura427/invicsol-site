import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { getContent } from '@/shared/lib/content';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { ICONS } from '@/shared/ui/icons';
import { RevealCard } from './RevealCard';

/**
 * A split composition — photograph on one side, the four points as ruled rows
 * on the other — rather than four identical cards in a row. The card grid is
 * the single most generic layout available and this section had it in its most
 * recognizable form; the photograph also does real work here, since "why us"
 * is a claim that installed hardware backs up better than an icon does.
 */
export function WhyUs() {
  const t = useTranslations('WhyUs');
  const locale = useLocale();
  const { why } = getContent(locale);

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28">
          <SectionHeading eyebrow={t('eyebrow')} title={t('heading')} align="left" />
          <div className="relative mt-10 aspect-[4/3] overflow-hidden rounded-[var(--radius-image)]">
            <Image
              src="/projects/sokilnyky-house-12kw.jpg"
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="border-border divide-border divide-y border-t">
          {why.map((card, index) => {
            const Icon = ICONS[card.icon];
            return (
              <RevealCard key={card.id} delayMs={index * 80}>
                <div className="flex gap-6 py-8">
                  <Icon className="text-gold-700 mt-1 h-5 w-5 shrink-0" aria-hidden />
                  <div>
                    <h3 className="text-navy-800 text-xl">{card.title}</h3>
                    <p className="text-muted mt-3 max-w-[52ch] leading-relaxed">{card.text}</p>
                  </div>
                </div>
              </RevealCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
