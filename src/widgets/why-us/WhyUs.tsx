import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { getContent } from '@/shared/lib/content';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { ICONS } from '@/shared/ui/icons';

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
    <section className="mx-auto max-w-7xl px-4 py-14 sm:py-20 lg:py-24 sm:px-6 lg:px-8">
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
        <div>
          <SectionHeading eyebrow={t('eyebrow')} title={t('heading')} align="left" />
          {/* The hero directly above already carries a photograph; on a phone a
              second one is 300px between the heading and the points. */}
          <div className="relative mt-6 hidden aspect-[4/3] overflow-hidden rounded-[var(--radius-image)] sm:mt-10 sm:block">
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
          {why.map((card) => {
            const Icon = ICONS[card.icon];
            return (
              <div key={card.id} className="flex gap-4 py-5 sm:gap-6 sm:py-8">
                <Icon className="text-gold-700 mt-1 h-5 w-5 shrink-0" aria-hidden />
                <div>
                  <h3 className="text-navy-800 text-xl">{card.title}</h3>
                  <p className="text-muted mt-3 max-w-[52ch] leading-relaxed">
                    {card.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
