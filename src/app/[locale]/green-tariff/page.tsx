import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getContent } from '@/shared/lib/content';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'GreenTariff' });
  return { title: t('pageTitle'), description: t('pageDescription') };
}

export default async function GreenTariffPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('GreenTariff');
  const { faq } = getContent(locale);
  const relevantFaq = faq.filter((item) => item.id === 'green-tariff' || item.id === 'payback');

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading title={t('heading')} description={t('intro')} align="left" />

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {relevantFaq.map((item) => (
          <Card key={item.id}>
            <h2 className="text-navy-800 font-semibold">{item.question}</h2>
            <p className="text-muted mt-2 text-sm">{item.answer}</p>
          </Card>
        ))}
      </div>

      <div className="mt-10">
        <Button href="/calculator" variant="gold">
          {t('cta')}
        </Button>
      </div>
    </div>
  );
}
