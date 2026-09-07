import { useTranslations, useLocale } from 'next-intl';
import { getContent } from '@/shared/lib/content';
import { SectionHeading } from '@/shared/ui/SectionHeading';

export function Expertise() {
  const t = useTranslations('Expertise');
  const locale = useLocale();
  const { expertise } = getContent(locale);

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <SectionHeading title={t('heading')} />
      {/* A numbered, editorial layout rather than another row of identical
          cards — every other section already uses the card pattern, so this
          one earns a different rhythm instead of repeating it a fourth time. */}
      <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
        {expertise.map((item, index) => (
          <div key={item.id} className="border-border flex gap-5 border-t pt-6">
            <span className="font-display text-gold-600/35 text-4xl font-light tracking-[-0.03em]">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div>
              <h3 className="text-navy-800 text-lg">{item.title}</h3>
              <p className="text-muted mt-2 text-sm">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
