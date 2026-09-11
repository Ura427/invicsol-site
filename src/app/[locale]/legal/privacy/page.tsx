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

interface PolicySection {
  title: string;
  paragraphs: string[];
  items?: string[];
  after?: string;
}

const LAST_UPDATED = '2026-09-11';

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Legal');
  const sections = t.raw('privacySections') as PolicySection[];
  const email = SITE.email;
  const domain = new URL(SITE.url).host;
  const date = new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(
    new Date(`${LAST_UPDATED}T00:00:00Z`),
  );
  // Plain interpolation, not ICU: the section bodies are raw strings so that
  // the message file can hold arrays, and ICU is not run over `t.raw`.
  const fill = (text: string) =>
    text.replace('{email}', email).replace('{domain}', domain);

  return (
    <article className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
      <p className="text-muted text-sm">{t('privacyUpdated', { date })}</p>
      <h1 className="text-navy-800 mt-3 text-4xl">{t('privacyTitle')}</h1>
      <p className="text-navy-800 mt-6 leading-relaxed">
        {t('privacyIntro', { domain, email })}
      </p>

      {sections.map((section, index) => (
        <section key={section.title} className="border-border mt-12 border-t pt-8">
          <h2 className="text-navy-800 flex gap-4 text-2xl">
            <span className="text-gold-700 font-light tabular-nums" aria-hidden>
              {String(index + 1).padStart(2, '0')}
            </span>
            {section.title}
          </h2>
          <div className="text-navy-800 mt-4 space-y-4 leading-relaxed">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{fill(paragraph)}</p>
            ))}
            {section.items ? (
              <ul className="list-disc space-y-2 pl-6">
                {section.items.map((item) => (
                  <li key={item}>{fill(item)}</li>
                ))}
              </ul>
            ) : null}
            {section.after ? <p>{fill(section.after)}</p> : null}
          </div>
        </section>
      ))}

      <p className="text-muted border-border mt-12 border-t pt-8 text-sm">
        <a
          href={`mailto:${email}`}
          className="text-navy-800 underline underline-offset-4"
        >
          {email}
        </a>
      </p>
    </article>
  );
}
