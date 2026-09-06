import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { getArticleBySlug, getAllArticleSlugs } from '@/entities/article/queries';
import { ArticleBody } from '@/entities/article/ui/ArticleBody';

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  const params: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    for (const slug of slugs) {
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
  const data = await getArticleBySlug(slug, locale);
  if (!data) return {};
  return { title: data.translation.title, description: data.translation.excerpt };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Articles');

  const data = await getArticleBySlug(slug, locale);
  if (!data) notFound();
  const { article, translation } = data;

  return (
    <article className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-muted text-sm">
        {t('publishedLabel')}{' '}
        {new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(article.publishedAt)}
      </p>
      <h1 className="text-navy-800 mt-2 text-3xl font-extrabold sm:text-4xl">
        {translation.title}
      </h1>

      <div className="mt-8">
        <ArticleBody blocks={translation.body} />
      </div>

      <div className="mt-12">
        <Link href="/articles" className="text-gold-700 text-sm font-semibold">
          ← {t('backToArticles')}
        </Link>
      </div>
    </article>
  );
}
