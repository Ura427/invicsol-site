import { getTranslations } from 'next-intl/server';
import { getAdminLocale } from '@/shared/lib/admin-locale';
import { AdminNav } from '@/widgets/admin-nav/AdminNav';
import { Badge } from '@/shared/ui/Badge';
import { Stars } from '@/entities/review/ui/Stars';
import { parseReviewFilters, hasActiveReviewFilters } from '@/entities/review/filters';
import { getAllStations, getStationTranslations } from '@/entities/station/queries';
import { listReviews } from './actions';
import { ReviewFilters } from './ReviewFilters';
import { ModerationButtons } from './ModerationButtons';

const STATUS_TONE = {
  pending: 'warning',
  approved: 'positive',
  rejected: 'neutral',
} as const;
const STATUS_KEY = {
  pending: 'statusPending',
  approved: 'statusApproved',
  rejected: 'statusRejected',
} as const;

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = await getAdminLocale();
  const [t, tFilters] = await Promise.all([
    getTranslations({ locale, namespace: 'Admin.reviews' }),
    getTranslations({ locale, namespace: 'Admin.filters' }),
  ]);

  const filters = parseReviewFilters(await searchParams);
  const [{ items, total }, stations] = await Promise.all([
    listReviews(filters, locale),
    getAllStations(),
  ]);
  const stationTitles = await getStationTranslations(
    stations.map((s) => s.id),
    locale,
  );
  const stationOptions = stations
    .filter((s) => s.systemType !== 'custom')
    .map((s) => ({ slug: s.slug, title: stationTitles.get(s.id)?.title ?? s.slug }));

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(
      new Date(iso),
    );

  return (
    <>
      <AdminNav />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="text-navy-800 text-3xl">{t('heading')}</h1>
        <p className="text-muted mt-2 max-w-[58ch] text-sm leading-relaxed">
          {t('subtitle')}
        </p>

        <div className="mt-8">
          <ReviewFilters
            hasActive={hasActiveReviewFilters(filters)}
            summary={tFilters('showingFiltered', { count: items.length, total })}
            stations={stationOptions}
          />
        </div>

        {items.length === 0 ? (
          <p className="text-muted mt-8 text-sm">
            {total === 0 ? t('empty') : tFilters('none')}
          </p>
        ) : (
          <>
            <ul className="border-border divide-border mt-8 divide-y border-y lg:hidden">
              {items.map((review) => (
                <li key={review.id} className="space-y-2.5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-navy-800 font-medium">{review.authorName}</p>
                      <p className="text-muted text-xs">
                        {review.stationTitle} · {formatDate(review.createdAt)} ·{' '}
                        {t('writtenIn', { locale: review.locale.toUpperCase() })}
                      </p>
                    </div>
                    <Badge tone={STATUS_TONE[review.status]}>
                      {t(STATUS_KEY[review.status])}
                    </Badge>
                  </div>
                  <Stars
                    value={review.rating}
                    label={tFilters('ratingStars', { count: review.rating })}
                  />
                  <p className="text-navy-800 text-sm leading-relaxed">{review.text}</p>
                  <ModerationButtons id={review.id} status={review.status} />
                </li>
              ))}
            </ul>

            <div className="border-border mt-8 hidden overflow-x-auto border-y lg:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-border text-muted border-b text-xs tracking-[0.14em] uppercase">
                    <th className="py-3 pr-4 font-medium">{t('colWhen')}</th>
                    <th className="py-3 pr-4 font-medium">{t('colStation')}</th>
                    <th className="py-3 pr-4 font-medium">{t('colAuthor')}</th>
                    <th className="py-3 pr-4 font-medium">{t('colRating')}</th>
                    <th className="py-3 pr-4 font-medium">{t('colText')}</th>
                    <th className="py-3 font-medium" />
                  </tr>
                </thead>
                <tbody className="divide-border divide-y">
                  {items.map((review) => (
                    <tr key={review.id} className="align-top">
                      <td className="text-muted py-3 pr-4 whitespace-nowrap">
                        {formatDate(review.createdAt)}
                        <div className="mt-1">
                          <Badge tone={STATUS_TONE[review.status]}>
                            {t(STATUS_KEY[review.status])}
                          </Badge>
                        </div>
                      </td>
                      <td className="text-navy-800 py-3 pr-4 whitespace-nowrap">
                        {review.stationTitle}
                      </td>
                      <td className="text-navy-800 py-3 pr-4 font-medium whitespace-nowrap">
                        {review.authorName}
                        <div className="text-muted mt-0.5 text-xs font-normal">
                          {t('writtenIn', { locale: review.locale.toUpperCase() })}
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <Stars
                          value={review.rating}
                          label={tFilters('ratingStars', { count: review.rating })}
                        />
                      </td>
                      {/* The full text, not a clamp: the whole job of this screen
                        is to read the review before deciding. */}
                      <td className="text-navy-800 max-w-[36rem] py-3 pr-4 leading-relaxed">
                        {review.text}
                      </td>
                      <td className="py-3">
                        <ModerationButtons id={review.id} status={review.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
}
