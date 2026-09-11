import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getContent } from '@/shared/lib/content';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { Link } from '@/i18n/navigation';
import { PlaceholderBadge } from '@/shared/ui/PlaceholderBadge';

/**
 * Initials rather than a stock headshot: team entries are honest placeholders
 * (name = role title, e.g. "Lead Engineer"), and a real, identifiable
 * stranger's photo next to that would misrepresent them as an actual
 * employee — the same reasoning Testimonials.tsx uses for its avatars.
 */
function initialFrom(name: string): string {
  return name.trim().charAt(0).toUpperCase();
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'About' });
  return { title: t('pageTitle'), description: t('pageDescription') };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('About');
  const tWarranty = await getTranslations('Warranty');
  const { team, brands, warranty } = getContent(locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <SectionHeading
        as="h1"
        title={t('heading')}
        description={t('intro')}
        align="left"
      />

      {/* Three ruled rows, not three cards: the page was three card grids in a
          column, which is the one layout every generated site has. Rows carry
          the same content with the rules doing the separating. */}
      <section className="mt-16">
        <Label>{t('teamHeading')}</Label>
        <div className="border-border divide-border mt-6 divide-y border-t">
          {team.map((member) => (
            <div
              key={member.id}
              className="relative grid gap-4 py-7 sm:grid-cols-[3rem_1fr_2fr] sm:gap-8"
            >
              {member.isPlaceholder ? (
                <PlaceholderBadge label={t('placeholderBadge')} />
              ) : null}
              <div
                className="bg-gold-500/10 text-gold-700 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold"
                aria-hidden
              >
                {initialFrom(member.name)}
              </div>
              <div>
                <h2 className="text-navy-800 text-xl">{member.name}</h2>
                <p className="text-gold-700 mt-1 text-sm">{member.role}</p>
              </div>
              <p className="text-muted max-w-[52ch] leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The full terms live on /warranty; repeating the three cards here was
          the same content twice on two pages. One line and a link. */}
      <section className="border-border mt-16 grid gap-6 border-t pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-20">
        <Label>{t('warrantyHeading')}</Label>
        <div className="flex flex-wrap items-baseline gap-x-8 gap-y-4">
          {warranty.map((item) => (
            <p key={item.id} className="text-navy-800">
              <span className="text-gold-700 text-3xl font-light tracking-[-0.03em]">
                {item.years}
              </span>{' '}
              <span className="text-muted text-sm">
                {tWarranty('years', { count: item.years })}
              </span>
              <span className="text-muted mt-1 block text-sm">{item.title}</span>
            </p>
          ))}
          <p className="text-muted w-full text-sm leading-relaxed">
            {t('warrantyText')}{' '}
            <Link href="/warranty" className="text-navy-800 underline underline-offset-4">
              {t('warrantyLink')}
            </Link>
          </p>
        </div>
      </section>

      {/* Hairline-ruled grid, the ServicesTeaser device, for the six brands. */}
      <section className="mt-16">
        <Label>{t('brandsHeading')}</Label>
        <div className="bg-border border-border mt-6 grid gap-px border-y sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <div key={brand.id} className="bg-paper px-6 py-7">
              <p className="text-navy-800 text-lg">{brand.name}</p>
              <p className="text-gold-700 mt-1 text-xs tracking-[0.08em] uppercase">
                {brand.category}
              </p>
              <p className="text-muted mt-2.5 max-w-[46ch] text-sm leading-relaxed">
                {brand.note}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
