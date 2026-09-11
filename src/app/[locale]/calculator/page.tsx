import { getAllStations } from '@/entities/station/queries';
import { toCostReferences } from '@/widgets/calculator/model/payback';
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

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Calculator');
  const references = toCostReferences(await getAllStations());

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <SectionHeading as="h1" title={t('pageTitle')} description={t('pageDescription')} />
      {/* Same beige card as on the bespoke station page: the option cards
          are white, and white needs the tint under it to read as a card. */}
      <div className="bg-surface mt-12 rounded-[var(--radius-lg)] px-6 py-10 sm:px-10 md:py-14">
        <CalculatorWizard references={references} />
      </div>
    </div>
  );
}
