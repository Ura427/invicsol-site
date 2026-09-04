import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { CalculatorWizard } from '@/widgets/calculator';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Calculator' });
  return { title: t('pageTitle'), description: t('pageDescription') };
}

export default async function CalculatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Calculator');

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading title={t('pageTitle')} description={t('pageDescription')} />
      <div className="mt-12">
        <CalculatorWizard />
      </div>
    </div>
  );
}
