import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { getContent } from '@/shared/lib/content';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { ContactForm } from '@/widgets/contact-form';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Contact' });
  return { title: t('pageTitle'), description: t('pageDescription') };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Contact');
  const { contact } = getContent(locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <SectionHeading as="h1" title={t('heading')} align="left" />

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <Phone className="text-gold-600 mt-1 h-5 w-5" aria-hidden />
            <div>
              <p className="text-muted text-sm">{t('phone')}</p>
              <a href={`tel:${contact.phone}`} className="text-navy-800 font-semibold">
                {contact.phoneDisplay}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="text-gold-600 mt-1 h-5 w-5" aria-hidden />
            <div>
              <p className="text-muted text-sm">{t('email')}</p>
              <a href={`mailto:${contact.email}`} className="text-navy-800 font-semibold">
                {contact.email}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="text-gold-600 mt-1 h-5 w-5" aria-hidden />
            <div>
              <p className="text-muted text-sm">{t('address')}</p>
              <p className="text-navy-800 font-semibold">{contact.address}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="text-gold-600 mt-1 h-5 w-5" aria-hidden />
            <div>
              <p className="text-muted text-sm">{t('hours')}</p>
              <p className="text-navy-800 font-semibold">{contact.hours}</p>
            </div>
          </div>

          <iframe
            title="INVICSOL — map"
            src={contact.mapEmbedUrl}
            className="border-border mt-4 h-64 w-full rounded-[var(--radius-lg)] border"
            loading="lazy"
          />
        </div>

        <div className="bg-elevated rounded-[var(--radius-lg)]">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
