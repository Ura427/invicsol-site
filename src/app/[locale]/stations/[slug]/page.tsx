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

/** Small uppercase label with the square marker, matching SectionHeading's eyebrow. */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-gold-700 flex items-center gap-2.5">
      <span className="bg-gold-700 inline-block h-1 w-1 shrink-0" aria-hidden />
      <span className="text-xs font-medium tracking-[0.14em] uppercase">{children}</span>
    </p>
  );
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

  // The four headline facts, rendered as one ruled band — a station page is a
  // specification sheet, and a spec sheet lists values against rules rather
  // than floating each one inside its own bordered box.
  const specs = [
    {
      label: t('specPower'),
      value: station.powerKw !== null ? `${station.powerKw} ${t('kwUnit')}` : '—',
    },
    { label: t('specSystemType'), value: t(`systemTypes.${station.systemType}`) },
    { label: t('specPurpose'), value: translation.specPurpose },
    { label: t('specScalability'), value: translation.specScalability },
  ];

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Same hero treatment as the homepage: the photograph carries the page
          at full strength with a bottom-weighted scrim, rather than sitting at
          30% opacity behind a gradient panel. */}
      <section className="bg-navy-900 relative isolate flex min-h-[26rem] items-end overflow-hidden lg:min-h-[32rem]">
        <Image src={station.imagePath} alt="" fill priority sizes="100vw" className="object-cover" />
        <div
          className="from-navy-900/95 via-navy-900/70 absolute inset-0 bg-gradient-to-t to-transparent"
          aria-hidden
        />
        <div className="relative mx-auto w-full max-w-6xl px-4 pt-24 pb-14 sm:px-6 lg:px-8 lg:pb-20">
          <span className="bg-gold-500 text-navy-900 inline-block rounded-full px-3.5 py-1.5 text-xs font-medium">
            {translation.badge}
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl text-white sm:text-5xl lg:text-6xl">
            {translation.title}
          </h1>
          <p className="mt-5 max-w-xl leading-relaxed text-white/75">{translation.intro}</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Spec band */}
        <div className="bg-border border-border grid gap-px border-b sm:grid-cols-2 lg:grid-cols-4">
          {specs.map((spec) => (
            <div key={spec.label} className="bg-paper px-6 py-8 first:pl-0">
              <p className="text-muted text-xs tracking-[0.08em] uppercase">{spec.label}</p>
              <p className="text-navy-800 mt-3 text-xl leading-snug">{spec.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-14 py-20 lg:grid-cols-2 lg:gap-20">
          <div>
            <Label>{t('suitableFor')}</Label>
            <ul className="mt-6 space-y-4">
              {translation.suitableFor.map((item) => (
                <li key={item} className="text-navy-800 flex gap-3">
                  <Check className="text-gold-700 mt-1.5 h-4 w-4 shrink-0" aria-hidden />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Label>{t('outcomes')}</Label>
            <ul className="mt-6 space-y-4">
              {translation.outcomes.map((item) => (
                <li key={item} className="text-navy-800 flex gap-3">
                  <Check className="text-gold-700 mt-1.5 h-4 w-4 shrink-0" aria-hidden />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Equipment — the densest, most technical block on the page, so it gets
          the surface tint and ruled rows to read as a parts list. */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Label>{t('kit')}</Label>
          <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2 className="text-navy-800 text-2xl">{t('kitMain')}</h2>
              <ul className="border-border divide-border mt-6 divide-y border-t">
                {translation.kitMain.map((item) => (
                  <li key={item} className="text-navy-800 py-4 leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-navy-800 text-2xl">{t('kitExtra')}</h2>
              <ul className="border-border divide-border mt-6 divide-y border-t">
                {translation.kitExtra.map((item) => (
                  <li key={item} className="text-muted py-4 leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <Label>{t('whatYouGet')}</Label>
        {/* Flex rather than a grid: stations carry two or three benefits, so a
            fixed column count always left a stub rule hanging under an empty
            cell. Items size to their content and the rules land between them
            whatever the count. */}
        <div className="border-border mt-8 flex flex-wrap gap-y-6 border-t pt-8">
          {translation.benefits.map((benefit, index) => (
            <p
              key={benefit}
              className={`text-navy-800 leading-relaxed sm:px-8 sm:first:pl-0 ${
                index > 0 ? 'border-border sm:border-l' : ''
              }`}
            >
              {benefit}
            </p>
          ))}
        </div>
      </div>

      <section className="bg-navy-800 py-20 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          {/* Not the station title again — repeating the h1 verbatim at the
              foot of the page tells the reader nothing they have not read. */}
          <h2 className="max-w-xl text-3xl sm:text-4xl">{t('ctaHeading')}</h2>
          <Button href="/contact" variant="gold">
            {t('cta')}
          </Button>
        </div>
      </section>
    </div>
  );
}
