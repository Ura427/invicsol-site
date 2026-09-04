import { useTranslations, useLocale } from 'next-intl';
import { getContent } from '@/shared/lib/content';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { Card } from '@/shared/ui/Card';

export function Expertise() {
  const t = useTranslations('Expertise');
  const locale = useLocale();
  const { expertise } = getContent(locale);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading title={t('heading')} />
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {expertise.map((item) => (
          <Card key={item.id}>
            <h3 className="text-navy-800 text-lg font-semibold">{item.title}</h3>
            <p className="text-muted mt-2 text-sm">{item.text}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
