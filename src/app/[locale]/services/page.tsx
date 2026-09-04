import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getContent } from '@/shared/lib/content';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { Card } from '@/shared/ui/Card';
import { ICONS } from '@/shared/ui/icons';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Services' });
  return { title: t('pageTitle'), description: t('pageDescription') };
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Services');
  const { services } = getContent(locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading title={t('pageTitle')} description={t('pageDescription')} />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const Icon = ICONS[service.icon];
          return (
            <Card key={service.id}>
              <Icon className="text-gold-600 h-7 w-7" aria-hidden />
              <h3 className="text-navy-800 mt-4 text-lg font-semibold">{service.title}</h3>
              <p className="text-muted mt-2 text-sm">{service.text}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
