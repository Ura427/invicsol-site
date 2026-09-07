import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Check, Star } from 'lucide-react';
import { routing } from '@/i18n/routing';
import { STATION_SLUGS } from '@/entities/station/parse';
import { getStationBySlug } from '@/entities/station/queries';
import { getContent } from '@/shared/lib/content';
import { StationPrice } from '@/entities/station/ui/StationPrice';
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
  const tHero = await getTranslations('Hero');

  const data = await getStationBySlug(slug, locale);
  if (!data) notFound();
  const { station, translation } = data;
  // The bespoke configuration is a different kind of page: no fixed power, no
  // fixed kit, no price. It shares the shell but not the middle.
  const isCustom = station.systemType === 'custom';
  const { process } = getContent(locale);

  // The demo badge belongs next to a fabricated figure, not on a page that
  // shows none. The bespoke station has no price, rating or stock to fake, so
  // badging it only added noise and made a truthful page look provisional.
  const hasCommercialFigures =
    station.pricing !== null || station.rating !== null || station.inStock !== null;

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

      {/* Product header: contained photograph beside price, specs and CTA, so
          the four things a visitor decides on are all visible without
          scrolling. This is why the photo is no longer full-bleed — a
          cinematic hero pushed the price and specs below the fold, and on this
          page deciding beats impressing. */}
      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-image)] lg:aspect-[5/4]">
            <Image
              src={station.imagePath}
              alt=""
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 576px"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-gold-500 text-navy-900 inline-block rounded-full px-3.5 py-1.5 text-xs font-medium">
                {translation.badge}
              </span>
              {station.inStock !== null ? (
                <span className="text-muted text-xs tracking-[0.08em] uppercase">
                  {station.inStock ? t('inStock') : t('outOfStock')}
                </span>
              ) : null}
              {station.rating ? (
                <span className="text-muted flex items-center gap-1.5 text-xs">
                  <Star className="text-gold-600 h-3.5 w-3.5 fill-current" aria-hidden />
                  {station.rating.value.toFixed(1)}
                  {/* Full muted, not muted/70 — at 12px the faded variant
                      measured 3.03:1, under the 4.5 AA floor. */}
                  <span className="text-muted">
                    ({station.rating.count} {t('reviews')})
                  </span>
                </span>
              ) : null}
            </div>

            <h1 className="text-navy-800 mt-5 text-4xl sm:text-5xl">{translation.title}</h1>
            <p className="text-muted mt-4 max-w-[52ch] leading-relaxed">{translation.intro}</p>

            <div className="border-border mt-8 border-t pt-8">
              {/* Every commercial figure on this page is demo data until the
                  flag is cleared per station. The badge is not decoration —
                  it is what stops an invented price reading as a real one. */}
              {station.commercialIsPlaceholder && hasCommercialFigures ? (
                <p className="border-gold-500 text-gold-700 mb-5 inline-block rounded-full border px-3 py-1 text-xs font-medium">
                  {t('demoBadge')}
                </p>
              ) : null}
              <StationPrice station={station} locale={locale} />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/contact" variant="gold">
                {t('cta')}
              </Button>
              <Button href="/calculator" variant="outline">
                {tHero('ctaPrimary')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* The bespoke configuration is not a product with a specification, so
            it does not get a specification band. Forcing it through the same
            template printed "—" for power and one-line equipment lists, which
            made the page read as broken rather than as deliberately open. */}
        {isCustom ? null : (
          <div className="bg-border border-border mt-16 grid gap-px border-y sm:grid-cols-2 lg:grid-cols-4">
            {specs.map((spec) => (
              <div key={spec.label} className="bg-paper px-6 py-8 first:pl-0">
                <p className="text-muted text-xs tracking-[0.08em] uppercase">{spec.label}</p>
                <p className="text-navy-800 mt-3 text-xl leading-snug">{spec.value}</p>
              </div>
            ))}
          </div>
        )}

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

      {isCustom ? (
        /* The bespoke page answers a different question. A standard station
           page tells you what you get; this one has no fixed kit to list, so
           the useful content is what actually happens after you enquire — and
           that process is already written and true, rather than invented for
           this page. Numbered rows, matching the Expertise treatment. */
        <section className="bg-surface py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Label>{t('processEyebrow')}</Label>
            <h2 className="text-navy-800 mt-6 max-w-2xl text-[2rem] sm:text-[2.5rem]">
              {t('processHeading')}
            </h2>

            <div className="mt-14 grid gap-x-16 gap-y-10 sm:grid-cols-2">
              {process.map((step, index) => (
                <div key={step.id} className="border-border flex gap-5 border-t pt-6">
                  <span className="font-display text-gold-600/40 text-3xl font-light tracking-[-0.03em]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-navy-800 text-lg">{step.title}</h3>
                    <p className="text-muted mt-2.5 max-w-[46ch] text-sm leading-relaxed">
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-muted border-border mt-14 max-w-[62ch] border-t pt-8 text-sm leading-relaxed">
              {t('customNote')}
            </p>
          </div>
        </section>
      ) : (
        /* Equipment — the densest, most technical block on the page, so it gets
           the surface tint and ruled rows to read as a parts list. */
        <section className="bg-surface py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Label>{t('kit')}</Label>

          {/* Deliberately a section-level image, not one photo per line item.
              The kit list names specific models (Longi 500W, Deye 10kW,
              Pylontech 10kWh) and this is generic stock photography — placing
              it beside a named model would imply it IS that product. As a
              decorative header for the block it claims nothing. Empty alt for
              the same reason: there is no information here to announce. */}
          <div className="relative mt-8 aspect-[21/9] overflow-hidden rounded-[var(--radius-image)]">
            <Image
              src="/equipment/panel-detail.jpg"
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 1152px"
              className="object-cover"
            />
          </div>

          <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-20">
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
      )}

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
