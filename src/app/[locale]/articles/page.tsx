import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import { getAllArticles } from '@/entities/article/queries';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Articles' });
  return { title: t('pageTitle'), description: t('pageDescription') };
}

export default async function ArticlesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Articles');
  const articles = await getAllArticles(locale);

  return (
    <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
      <SectionHeading as="h1"
        title={t('heading')}
        description={t('pageDescription')}
        align="left"
      />

      {articles.length === 0 ? (
        <p className="text-muted mt-8 text-center">{t('empty')}</p>
      ) : (
        <div className="mt-12 space-y-6">
          {articles.map(({ article, translation }) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="bg-elevated block rounded-[var(--radius-lg)] p-7 transition-transform duration-300 hover:-translate-y-0.5"
            >
              <p className="text-muted text-xs">
                {new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(
                  article.publishedAt,
                )}
              </p>
              <h2 className="text-navy-800 mt-2 text-xl">{translation.title}</h2>
              {/* 58ch, not the ~75ch the reading-measure rule implies: the ch unit is the
                  width of "0", and Cyrillic lowercase is far narrower than that, so
                  max-w-[70ch] was rendering ~88 characters per line. */}
              <p className="text-muted mt-2 max-w-[58ch] text-sm leading-relaxed">
                {translation.excerpt}
              </p>
              <span className="text-gold-700 mt-4 inline-block text-sm font-semibold">
                {t('readMore')} →
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
