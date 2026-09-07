import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SITE } from '@/shared/lib/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Legal' });
  return { title: t('privacyTitle'), description: t('privacyDescription') };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Legal');

  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-navy-800 text-3xl">{t('privacyTitle')}</h1>
      <div className="text-muted mt-6 space-y-4 text-sm leading-relaxed">
        <p>{t('privacyDescription')}</p>
        <p>
          {SITE.name} collects the name and phone number submitted through the calculator, contact
          form, and callback request in order to respond to your inquiry. Data is stored only for
          this purpose and is never sold or shared with third parties outside of the messaging
          services (Telegram, Viber) you choose to contact us through.
        </p>
        <p>
          You may request that your submitted data be deleted by contacting us at{' '}
          <a href={`mailto:${SITE.email}`} className="text-navy-800 underline">
            {SITE.email}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
