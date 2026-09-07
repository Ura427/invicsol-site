import { useTranslations, useLocale } from 'next-intl';
import { getContent } from '@/shared/lib/content';
import { SectionHeading } from '@/shared/ui/SectionHeading';

/**
 * A ruled band rather than four centred figures floating in a row: heading on
 * the left, the numbers as left-aligned ruled columns on the right. Left
 * alignment against a rule is what makes a figure read as a specification
 * rather than a marketing claim — centred numbers under a centred heading is
 * the arrangement every landing page uses.
 */
export function Stats() {
  const t = useTranslations('Stats');
  const locale = useLocale();
  const { stats } = getContent(locale);

  return (
    <section className="bg-navy-800 py-24 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2fr)] lg:items-end lg:gap-20">
          <SectionHeading eyebrow={t('eyebrow')} title={t('heading')} align="left" tone="light" />

          <div className="grid gap-px bg-white/15 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              // Padded on every side: the 1px gaps render as rules against the
              // parent, and without a bottom/left inset the figures sit flush
              // against those rules.
              <div key={stat.id} className="bg-navy-800 px-6 py-7">
                <p className="text-gold-400 text-5xl font-light tracking-[-0.03em]">{stat.value}</p>
                <p className="mt-3 text-sm leading-snug text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
