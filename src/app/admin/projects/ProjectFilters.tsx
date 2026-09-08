'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { FilterBar } from '@/widgets/admin-filters';

/**
 * The projects page is a server component, so only this thin client wrapper
 * ships — it exists to hold the translated option labels and hand them to the
 * shared FilterBar, which needs client hooks for the URL and the debounce.
 */
export function ProjectFilters({
  hasActive,
  summary,
}: {
  hasActive: boolean;
  summary: ReactNode;
}) {
  const t = useTranslations('Admin.filters');
  const tForm = useTranslations('Admin.form');

  return (
    <FilterBar
      hasActive={hasActive}
      summary={summary}
      searchPlaceholder={t('searchProjects')}
      filters={[
        {
          param: 'status',
          label: t('status'),
          allLabel: t('projectStatusAll'),
          options: [
            { value: 'real', label: t('projectStatusReal') },
            { value: 'demo', label: t('projectStatusDemo') },
          ],
        },
        {
          param: 'type',
          label: t('type'),
          allLabel: t('typeAll'),
          options: [
            { value: 'house', label: tForm('objectTypeHouse') },
            { value: 'business', label: tForm('objectTypeBusiness') },
          ],
        },
        {
          param: 'usage',
          label: t('usage'),
          allLabel: t('usageAll'),
          options: [
            { value: 'self', label: tForm('usageSelf') },
            { value: 'green-tariff', label: tForm('usageGreenTariff') },
            { value: 'hybrid-backup', label: tForm('usageHybridBackup') },
          ],
        },
        {
          param: 'kw',
          label: t('capacity'),
          allLabel: t('capacityAll'),
          options: [
            { value: '0-10', label: t('capacityLow') },
            { value: '10-20', label: t('capacityMid') },
            { value: '20+', label: t('capacityHigh') },
          ],
        },
      ]}
      sort={{
        param: 'sort',
        label: t('sort'),
        options: [
          { value: 'newest', label: t('sortNewest') },
          { value: 'oldest', label: t('sortOldest') },
          { value: 'capacity-desc', label: t('sortCapacityDesc') },
          { value: 'capacity-asc', label: t('sortCapacityAsc') },
          { value: 'title', label: t('sortTitle') },
        ],
      }}
    />
  );
}
