import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { SITE } from '@/shared/lib/site';
import { STATION_SLUGS } from '@/entities/station/parse';
import { db } from '@/shared/lib/db';

const STATIC_PATHS = [
  '',
  '/services',
  '/stations',
  '/projects',
  '/about',
  '/contact',
  '/calculator',
  '/backup-power',
  '/green-tariff',
  '/articles',
  '/legal/privacy',
  '/warranty',
  '/financing',
];

function withAlternates(path: string) {
  return {
    url: `${SITE.url}/${routing.defaultLocale}${path}`,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [locale, `${SITE.url}/${locale}${path}`]),
      ),
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => withAlternates(path));

  for (const slug of STATION_SLUGS) {
    entries.push(withAlternates(`/stations/${slug}`));
  }

  const projects = await db.project.findMany({ select: { slug: true } });
  for (const project of projects) {
    entries.push(withAlternates(`/projects/${project.slug}`));
  }

  const articles = await db.article.findMany({ select: { slug: true } });
  for (const article of articles) {
    entries.push(withAlternates(`/articles/${article.slug}`));
  }

  return entries;
}
