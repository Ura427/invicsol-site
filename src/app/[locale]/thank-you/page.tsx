import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ThankYou' });
  return { title: t('pageTitle'), robots: { index: false, follow: false } };
}

export default async function ThankYouPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('ThankYou');

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <CheckCircle2 className="text-gold-500 h-16 w-16" aria-hidden />
      <h1 className="text-navy-800 text-3xl font-bold">{t('heading')}</h1>
      <p className="text-muted max-w-md">{t('text')}</p>
      <Button href="/" variant="primary">
        {t('backHome')}
      </Button>
    </div>
  );
}
