import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getContent } from '@/shared/lib/content';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { Card } from '@/shared/ui/Card';
import { PlaceholderBadge } from '@/shared/ui/PlaceholderBadge';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Financing' });
  return { title: t('pageTitle'), description: t('pageDescription') };
}

export default async function FinancingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Financing');
  const { financing } = getContent(locale);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading title={t('heading')} description={t('intro')} align="left" />
      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {financing.map((option) => (
          <Card key={option.id} className="relative">
            {option.isPlaceholder ? <PlaceholderBadge label={t('placeholderBadge')} /> : null}
            <h2 className="text-navy-800 font-semibold">{option.provider}</h2>
            <p className="text-gold-600 mt-1 text-sm font-medium">{option.terms}</p>
            <p className="text-muted mt-2 text-sm">{option.note}</p>
          </Card>
        ))}
      </div>
      <p className="text-muted mt-8 text-xs">{t('disclaimer')}</p>
    </div>
  );
}
