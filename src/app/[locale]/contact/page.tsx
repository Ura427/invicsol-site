import Image from 'next/image';
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

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
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

          {/* A static image, not the OSM embed: the embed's own attribution
              bar wrapped over the map at phone widths and pulled a third-party
              page into ours. Tiles stitched once from OpenStreetMap; the link
              opens the live map. Regenerate public/map-lviv.jpg if the address
              changes. */}
          <a
            href={contact.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative mt-4 block aspect-[2/1] overflow-hidden rounded-[var(--radius-lg)]"
          >
            <Image
              src="/map-lviv.jpg"
              alt={t('mapAlt')}
              fill
              sizes="(max-width: 1024px) 100vw, 560px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <span className="bg-elevated/90 text-navy-800 absolute right-3 bottom-3 rounded-[var(--radius-pill)] px-3 py-1.5 text-xs font-medium">
              {t('mapOpen')} ↗
            </span>
          </a>
          <p className="text-muted mt-2 text-xs">
            ©{' '}
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              OpenStreetMap
            </a>{' '}
            contributors
          </p>
        </div>

        <div className="bg-elevated rounded-[var(--radius-lg)]">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
