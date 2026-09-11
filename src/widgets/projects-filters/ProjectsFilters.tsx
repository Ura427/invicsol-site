'use client';

import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import type { ObjectType, UsageType } from '@/entities/project/parse';
import type { CapacityBand } from '@/entities/project/filters';

/**
 * Filter chip *values* sent in the URL are the same locale-neutral enum keys as
 * the database columns (`house`, `green-tariff`, `10-20`, …) — never translated
 * strings. Only the visible labels come from messages/*.json.
 */
export function ProjectsFilters() {
  const t = useTranslations('Projects');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: 'type' | 'usage' | 'kw', value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  const typeValue = searchParams.get('type');
  const usageValue = searchParams.get('usage');
  const capacityValue = searchParams.get('kw');
  const hasAnyFilter = Boolean(typeValue || usageValue || capacityValue);

  return (
    <div className="grid grid-cols-3 items-end gap-2 sm:flex sm:flex-wrap sm:gap-4">
      <label className="flex min-w-0 flex-col gap-1 text-sm">
        <span className="text-muted font-medium">{t('filterType')}</span>
        <select
          className="border-border bg-elevated w-full rounded-lg border px-3 py-2.5 text-base sm:text-sm"
          value={typeValue ?? ''}
          onChange={(e) =>
            updateParam('type', (e.target.value || null) as ObjectType | null)
          }
        >
          <option value="">{t('typeAll')}</option>
          <option value="house">{t('typeHouse')}</option>
          <option value="business">{t('typeBusiness')}</option>
        </select>
      </label>

      <label className="flex min-w-0 flex-col gap-1 text-sm">
        <span className="text-muted font-medium">{t('filterUsage')}</span>
        <select
          className="border-border bg-elevated w-full rounded-lg border px-3 py-2.5 text-base sm:text-sm"
          value={usageValue ?? ''}
          onChange={(e) =>
            updateParam('usage', (e.target.value || null) as UsageType | null)
          }
        >
          <option value="">{t('usageAll')}</option>
          <option value="self">{t('usageSelf')}</option>
          <option value="green-tariff">{t('usageGreenTariff')}</option>
          <option value="hybrid-backup">{t('usageHybridBackup')}</option>
        </select>
      </label>

      <label className="flex min-w-0 flex-col gap-1 text-sm">
        <span className="text-muted font-medium">{t('filterCapacity')}</span>
        <select
          className="border-border bg-elevated w-full rounded-lg border px-3 py-2.5 text-base sm:text-sm"
          value={capacityValue ?? ''}
          onChange={(e) =>
            updateParam('kw', (e.target.value || null) as CapacityBand | null)
          }
        >
          <option value="">{t('capacityAll')}</option>
          <option value="0-10">{t('capacityLow')}</option>
          <option value="10-20">{t('capacityMid')}</option>
          <option value="20+">{t('capacityHigh')}</option>
        </select>
      </label>

      {hasAnyFilter ? (
        <button
          type="button"
          onClick={() => router.push(pathname)}
          className="text-navy-800 text-sm font-semibold underline underline-offset-4"
        >
          {t('resetFilters')}
        </button>
      ) : null}
    </div>
  );
}
