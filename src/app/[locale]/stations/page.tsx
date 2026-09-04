import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { StationGrid } from '@/widgets/station-grid';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Stations' });
  return { title: t('pageTitle'), description: t('pageDescription') };
}

export default async function StationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Stations');

  return (
    <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
      <SectionHeading title={t('pageTitle')} description={t('pageDescription')} />
      <StationGrid showHeading={false} />
    </div>
  );
}
