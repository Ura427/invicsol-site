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

export default async function ArticlesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Articles');
  const articles = await getAllArticles(locale);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading title={t('heading')} description={t('pageDescription')} />

      {articles.length === 0 ? (
        <p className="text-muted mt-8 text-center">{t('empty')}</p>
      ) : (
        <div className="mt-12 space-y-6">
          {articles.map(({ article, translation }) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="border-border shadow-card block rounded-2xl border bg-white p-6 transition-transform hover:-translate-y-1"
            >
              <p className="text-muted text-xs">
                {new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(article.publishedAt)}
              </p>
              <h2 className="text-navy-800 mt-2 text-xl font-bold">{translation.title}</h2>
              <p className="text-muted mt-2 text-sm">{translation.excerpt}</p>
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
