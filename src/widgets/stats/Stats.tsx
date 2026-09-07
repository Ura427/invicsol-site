import { useTranslations, useLocale } from 'next-intl';
import { getContent } from '@/shared/lib/content';
import { SectionHeading } from '@/shared/ui/SectionHeading';

export function Stats() {
  const t = useTranslations('Stats');
  const locale = useLocale();
  const { stats } = getContent(locale);

  return (
    <section className="bg-navy-800 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t('heading')} tone="light" />
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.id} className="text-center">
              <p className="text-gold-400 text-5xl font-light tracking-[-0.03em] sm:text-6xl">{stat.value}</p>
              <p className="mt-2 text-sm text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
