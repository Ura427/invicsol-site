'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { FilterBar } from '@/widgets/admin-filters';

export function ReviewFilters({
  hasActive,
  summary,
  stations,
}: {
  hasActive: boolean;
  summary: ReactNode;
  stations: { slug: string; title: string }[];
}) {
  const t = useTranslations('Admin.filters');

  return (
    <FilterBar
      hasActive={hasActive}
      summary={summary}
      searchPlaceholder={t('searchReviews')}
      filters={[
        {
          param: 'status',
          label: t('status'),
          // The bar treats "" as "no filter", but for reviews no filter means
          // the pending queue, so "any status" is an explicit value.
          allLabel: t('reviewStatusPending'),
          options: [
            { value: 'all', label: t('reviewStatusAll') },
            { value: 'approved', label: t('reviewStatusApproved') },
            { value: 'rejected', label: t('reviewStatusRejected') },
          ],
        },
        {
          param: 'station',
          label: t('station'),
          allLabel: t('stationAll'),
          options: stations.map((s) => ({ value: s.slug, label: s.title })),
        },
        {
          param: 'rating',
          label: t('rating'),
          allLabel: t('ratingAll'),
          options: [5, 4, 3, 2, 1].map((n) => ({
            value: String(n),
            label: t('ratingStars', { count: n }),
          })),
        },
      ]}
      sort={{
        param: 'sort',
        label: t('sort'),
        options: [
          { value: 'newest', label: t('sortNewest') },
          { value: 'oldest', label: t('sortOldest') },
          { value: 'highest', label: t('sortHighest') },
          { value: 'lowest', label: t('sortLowest') },
        ],
      }}
    />
  );
}
