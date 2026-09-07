import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getContent } from '@/shared/lib/content';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { Card } from '@/shared/ui/Card';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Warranty' });
  return { title: t('pageTitle'), description: t('pageDescription') };
}

export default async function WarrantyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Warranty');
  const { warranty } = getContent(locale);

  return (
    <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8">
      <SectionHeading title={t('pageTitle')} description={t('pageDescription')} />
      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {warranty.map((item) => (
          <Card key={item.id}>
            <p className="text-gold-600 text-4xl font-light tracking-[-0.03em]">{item.years}</p>
            <h2 className="text-navy-800 mt-2">{item.title}</h2>
            <p className="text-muted mt-2 text-sm">{item.text}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
