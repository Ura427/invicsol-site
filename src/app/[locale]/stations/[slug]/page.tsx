import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Check } from 'lucide-react';
import { routing } from '@/i18n/routing';
import { STATION_SLUGS } from '@/entities/station/parse';
import { getStationBySlug } from '@/entities/station/queries';
import { Button } from '@/shared/ui/Button';
import { SITE } from '@/shared/lib/site';

export const dynamicParams = false;

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    for (const slug of STATION_SLUGS) {
      params.push({ locale, slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const data = await getStationBySlug(slug, locale);
  if (!data) return {};
  return { title: data.translation.title, description: data.translation.intro };
}

export default async function StationDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Stations');

  const data = await getStationBySlug(slug, locale);
  if (!data) notFound();
  const { station, translation } = data;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: translation.title,
    description: translation.intro,
    brand: { '@type': 'Brand', name: SITE.name },
    ...(station.powerKw !== null
      ? { additionalProperty: { '@type': 'PropertyValue', name: 'powerKw', value: station.powerKw } }
      : {}),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="from-navy-800 to-navy-700 relative overflow-hidden bg-gradient-to-br text-white">
        <div className="absolute inset-0">
          <Image src={station.imagePath} alt="" fill priority sizes="100vw" className="object-cover opacity-30" />
          <div className="from-navy-800 via-navy-800/80 absolute inset-0 bg-gradient-to-t to-transparent" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <span className="bg-gold-500 text-navy-900 inline-block rounded-full px-3 py-1 text-xs font-semibold">
            {translation.badge}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">{translation.title}</h1>
          <p className="mt-4 max-w-2xl text-white/80">{translation.intro}</p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="text-navy-800 text-lg font-bold">{t('suitableFor')}</h2>
            <ul className="mt-3 space-y-2">
              {translation.suitableFor.map((item) => (
                <li key={item} className="text-muted flex gap-2 text-sm">
                  <Check className="text-gold-600 mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-navy-800 text-lg font-bold">{t('outcomes')}</h2>
            <ul className="mt-3 space-y-2">
              {translation.outcomes.map((item) => (
                <li key={item} className="text-muted flex gap-2 text-sm">
                  <Check className="text-gold-600 mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="text-navy-800 text-lg font-bold">{t('kitMain')}</h2>
            <ul className="mt-3 space-y-2">
              {translation.kitMain.map((item) => (
                <li key={item} className="text-muted text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-navy-800 text-lg font-bold">{t('kitExtra')}</h2>
            <ul className="mt-3 space-y-2">
              {translation.kitExtra.map((item) => (
                <li key={item} className="text-muted text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-navy-800 text-lg font-bold">{t('specs')}</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="border-border rounded-xl border p-4 text-center">
              <p className="text-muted text-xs">{t('specPower')}</p>
              <p className="text-navy-800 mt-1 font-semibold">
                {station.powerKw !== null ? `${station.powerKw} ${t('kwUnit')}` : '—'}
              </p>
            </div>
            <div className="border-border rounded-xl border p-4 text-center">
              <p className="text-muted text-xs">{t('specSystemType')}</p>
              <p className="text-navy-800 mt-1 font-semibold">
                {t(`systemTypes.${station.systemType}`)}
              </p>
            </div>
            <div className="border-border rounded-xl border p-4 text-center">
              <p className="text-muted text-xs">{t('specPurpose')}</p>
              <p className="text-navy-800 mt-1 font-semibold">{translation.specPurpose}</p>
            </div>
            <div className="border-border rounded-xl border p-4 text-center">
              <p className="text-muted text-xs">{t('specScalability')}</p>
              <p className="text-navy-800 mt-1 font-semibold">{translation.specScalability}</p>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-navy-800 text-lg font-bold">{t('whatYouGet')}</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {translation.benefits.map((benefit) => (
              <div key={benefit} className="border-border rounded-xl border p-4 text-sm">
                {benefit}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button href="/contact" variant="gold">
            {t('cta')}
          </Button>
        </div>
      </div>
    </div>
  );
}
