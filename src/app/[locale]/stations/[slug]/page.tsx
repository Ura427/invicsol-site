import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Check } from 'lucide-react';
import { routing } from '@/i18n/routing';
import { STATION_SLUGS } from '@/entities/station/parse';
import { getStationBySlug } from '@/entities/station/queries';
import { getApprovedReviews, summarize } from '@/entities/review/queries';
import { buildStationJsonLd } from '@/entities/station/jsonld';
import { getContent } from '@/shared/lib/content';
import { StationPrice } from '@/entities/station/ui/StationPrice';
import { PaybackCalculator } from '@/entities/station/ui/PaybackCalculator';
import { EquipmentCarousel } from '@/entities/station/ui/EquipmentCarousel';
import { StationReviews, type ReviewView } from '@/entities/station/ui/StationReviews';
import { Stars } from '@/entities/review/ui/Stars';
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
  // The bespoke configuration is a different kind of page: no fixed power, no
  // fixed kit, no price. It shares the shell but not the middle.
  const isCustom = station.systemType === 'custom';
  const { process } = getContent(locale);

  // Reviews are read at render time and baked into the static page; approving
  // one in the admin re-renders it. The rating on this page is *only* ever
  // computed from these — there is no stored number that could be a demo value.
  const approved = isCustom ? [] : await getApprovedReviews(station.id);
  const summary = summarize(approved);
  const reviewViews: ReviewView[] = approved.map((r) => ({
    id: r.id,
    authorName: r.authorName,
    rating: r.rating,
    text: r.text,
    locale: r.locale,
    createdAt: r.createdAt.toISOString(),
  }));

  // The demo badge belongs next to a fabricated figure, not on a page that
  // shows none. The bespoke station has no price or stock to fake.
  const hasCommercialFigures = station.pricing !== null || station.inStock !== null;

  const jsonLd = buildStationJsonLd({
    title: translation.title,
    intro: translation.intro,
    brandName: SITE.name,
    powerKw: station.powerKw,
    summary,
  });

  const hasCarousel = !isCustom && translation.kitMain.some((item) => item.image !== null);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Product header. Left: the equipment carousel — one slide per line of
          the main kit. Right: four clusters, ruled apart, in the order someone
          decides in — what it is, what it costs, what to do next. The column
          used to run to nine items with no button at the end of it; the only
          call to action on the whole page was three screens down. */}
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 md:pt-10 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-16">
          {hasCarousel ? (
            <EquipmentCarousel
              items={translation.kitMain}
              isIllustrative={station.commercialIsPlaceholder}
            />
          ) : (
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
          )}

          <div className="divide-border divide-y">
            {/* Identity. The title carries the system type now, which is why
                the intro no longer opens with it and the spec band that repeated
                it is gone. */}
            <div className="pb-7">
              <h1 className="text-navy-800 text-4xl sm:text-5xl">{translation.title}</h1>
              <p className="text-muted mt-4 max-w-[52ch] leading-relaxed">{translation.intro}</p>

              {!isCustom ? (
                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                  {summary ? (
                    <a href="#reviews" className="text-navy-800 flex items-center gap-2 hover:underline">
                      <Stars
                        value={summary.average}
                        label={t('reviewsStar', { count: Math.round(summary.average) })}
                      />
                      <span className="font-medium">{summary.average.toFixed(1)}</span>
                      <span className="text-muted">
                        · {t('reviewsCount', { count: summary.count })}
                      </span>
                    </a>
                  ) : (
                    // An absence, not a score. "0.0" reads as the lowest mark.
                    <a href="#reviews" className="text-muted hover:text-navy-800 transition-colors">
                      {t('reviewsEmpty')}
                    </a>
                  )}
                  {station.inStock !== null ? (
                    <span className="text-muted text-xs tracking-[0.08em] uppercase">
                      {station.inStock ? t('inStock') : t('outOfStock')}
                    </span>
                  ) : null}
                </div>
              ) : null}

              {!isCustom ? (
                // The one spec the title does not already say.
                <p className="text-muted mt-4 text-sm">
                  <span className="text-xs tracking-[0.08em] uppercase">{t('expandable')}</span>
                  <span className="text-navy-800 ml-2">{translation.specScalability}</span>
                </p>
              ) : null}
            </div>

            {/* Price. */}
            {station.pricing ? (
              <div className="py-7">
                {station.commercialIsPlaceholder && hasCommercialFigures ? (
                  <p className="border-gold-500 text-gold-700 mb-5 inline-block rounded-full border px-3 py-1 text-xs font-medium">
                    {t('demoBadge')}
                  </p>
                ) : null}
                <StationPrice station={station} locale={locale} />
              </div>
            ) : null}

            {/* Action. */}
            <div className="pt-7">
              <Button href="/contact" variant="gold">
                {isCustom ? t('customCta') : t('cta')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Economics, full width. Beside the photo it was three cramped figures
          under a tariff box; here they get the room the numbers deserve, and
          the photo column no longer has half a screen of nothing under it. */}
      {isCustom || station.powerKw === null ? null : (
        <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 md:pt-16 lg:px-8">
          <div className="border-border border-t pt-10">
            <PaybackCalculator powerKw={station.powerKw} />
          </div>
        </div>
      )}

      {/* Fit — who it suits and what it changes, one band. */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 py-14 md:py-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <Label>{t('suitableFor')}</Label>
            <ul className="mt-6 space-y-4">
              {translation.suitableFor.slice(0, 3).map((item) => (
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
              {translation.outcomes.slice(0, 3).map((item) => (
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
        <section className="bg-surface py-16 md:py-20">
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
        /* The bill of materials, as two ruled lists. The carousel above is the
           same items with photographs; this is the complete list at a glance. */
        <section className="bg-surface py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Label>{t('kit')}</Label>
            <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-20">
              <div>
                <h2 className="text-navy-800 text-2xl">{t('kitMain')}</h2>
                <ul className="border-border divide-border mt-6 divide-y border-t">
                  {translation.kitMain.map((item) => (
                    <li key={item.label} className="text-navy-800 py-4 leading-relaxed">
                      {item.label}
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

      {!isCustom ? (
        <StationReviews stationId={station.id} reviews={reviewViews} summary={summary} />
      ) : null}

      <section className="bg-navy-800 py-16 text-white md:py-20">
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
