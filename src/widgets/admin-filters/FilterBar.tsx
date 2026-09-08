'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Search, X } from 'lucide-react';
import { useFilterParams, useDebouncedSearch } from './useFilterParams';

interface FilterBarProps {
  /** Each entry becomes one <select>. */
  filters: {
    param: string;
    label: string;
    allLabel: string;
    options: { value: string; label: string }[];
  }[];
  sort: { param: string; label: string; options: { value: string; label: string }[] };
  searchPlaceholder: string;
  hasActive: boolean;
  /** Rendered beside the controls — the "showing N of M" line. */
  summary: ReactNode;
}

/**
 * One filter bar for both admin lists.
 *
 * Everything lives in the URL rather than component state, so a filtered view
 * survives a refresh, can be sent to someone, and is the same view the server
 * queried — there is no second, client-side copy of the list to keep in sync.
 */
export function FilterBar({
  filters,
  sort,
  searchPlaceholder,
  hasActive,
  summary,
}: FilterBarProps) {
  const t = useTranslations('Admin.filters');
  const { searchParams, setParam, clear } = useFilterParams();
  const [query, setQuery] = useDebouncedSearch(searchParams.get('q') ?? '', (value) =>
    setParam('q', value || null, { replace: true }),
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="relative min-w-[14rem] flex-1">
          <label htmlFor="admin-search" className="sr-only">
            {searchPlaceholder}
          </label>
          <Search
            className="text-muted pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2"
            aria-hidden
          />
          <input
            id="admin-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            className="bg-elevated border-border w-full rounded-[var(--radius-sm)] border py-2.5 pr-3.5 pl-10 text-base transition-colors sm:text-sm"
          />
        </div>

        {filters.map((filter) => (
          <label key={filter.param} className="text-base sm:text-sm">
            <span className="sr-only">{filter.label}</span>
            <select
              value={searchParams.get(filter.param) ?? ''}
              onChange={(event) => setParam(filter.param, event.target.value || null)}
              aria-label={filter.label}
              className="bg-elevated border-border rounded-[var(--radius-sm)] border px-3.5 py-2.5 transition-colors"
            >
              <option value="">{filter.allLabel}</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ))}

        <label className="text-base sm:text-sm">
          <span className="sr-only">{sort.label}</span>
          <select
            value={searchParams.get(sort.param) ?? sort.options[0]?.value}
            onChange={(event) => setParam(sort.param, event.target.value)}
            aria-label={sort.label}
            className="bg-elevated border-border rounded-[var(--radius-sm)] border px-3.5 py-2.5 transition-colors"
          >
            {sort.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        {hasActive ? (
          <button
            type="button"
            onClick={clear}
            className="text-muted hover:text-navy-800 inline-flex items-center gap-1.5 py-2.5 text-sm font-medium transition-colors"
          >
            <X className="h-4 w-4" aria-hidden />
            {t('clear')}
          </button>
        ) : null}
      </div>

      {/* Without a count, an over-narrow filter is indistinguishable from an
          empty inbox — the operator concludes there are no leads rather than
          that they filtered them away. */}
      <p className="text-muted text-sm">{summary}</p>
    </div>
  );
}
