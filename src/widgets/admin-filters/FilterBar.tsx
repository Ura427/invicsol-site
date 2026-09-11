'use client';

import { useRef, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Search, SlidersHorizontal, X } from 'lucide-react';
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
  const sheet = useRef<HTMLDialogElement>(null);
  const activeCount = filters.filter((f) => searchParams.get(f.param)).length;

  const selectClass =
    'bg-elevated border-border w-full rounded-[var(--radius-sm)] border px-3.5 py-2.5 transition-colors lg:w-auto';

  const controls = (
    <>
      {filters.map((filter) => (
        <label key={filter.param} className="block text-base lg:text-sm">
          <span className="text-muted mb-1.5 block text-sm font-medium lg:sr-only">
            {filter.label}
          </span>
          <select
            value={searchParams.get(filter.param) ?? ''}
            onChange={(event) => setParam(filter.param, event.target.value || null)}
            aria-label={filter.label}
            className={selectClass}
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

      <label className="block text-base lg:text-sm">
        <span className="text-muted mb-1.5 block text-sm font-medium lg:sr-only">
          {sort.label}
        </span>
        <select
          value={searchParams.get(sort.param) ?? sort.options[0]?.value}
          onChange={(event) => setParam(sort.param, event.target.value)}
          aria-label={sort.label}
          className={selectClass}
        >
          {sort.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </>
  );

  const clearButton = hasActive ? (
    <button
      type="button"
      onClick={clear}
      className="text-muted hover:text-navy-800 inline-flex items-center gap-1.5 py-2.5 text-sm font-medium transition-colors"
    >
      <X className="h-4 w-4" aria-hidden />
      {t('clear')}
    </button>
  ) : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="relative min-w-0 flex-1 lg:min-w-[14rem]">
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

        {/* Below lg the selects live in a bottom sheet behind one button that
            carries the count of active filters; five stacked selects were a
            screen of chrome before the first row. */}
        <button
          type="button"
          onClick={() => sheet.current?.showModal()}
          className={`border-border text-navy-800 inline-flex h-11 items-center gap-2 rounded-[var(--radius-sm)] border px-3.5 text-sm font-medium lg:hidden ${
            activeCount > 0 ? 'border-gold-600 bg-gold-500/10' : 'bg-elevated'
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden />
          {t('filtersButton')}
          {activeCount > 0 ? <span className="tabular-nums">({activeCount})</span> : null}
        </button>

        <div className="hidden items-end gap-3 lg:flex">
          {controls}
          {clearButton}
        </div>
      </div>

      <dialog
        ref={sheet}
        className="bg-paper text-navy-800 fixed inset-x-0 top-auto bottom-0 m-0 w-full max-w-none rounded-t-[var(--radius-lg)] p-0 backdrop:bg-navy-900/40 lg:hidden"
        aria-label={t('filtersTitle')}
      >
        <form method="dialog" className="space-y-5 px-5 pt-5 pb-6">
          <div className="flex items-center justify-between">
            <p className="text-lg">{t('filtersTitle')}</p>
            <button
              type="submit"
              aria-label={t('filtersDone')}
              className="text-muted flex h-11 w-11 items-center justify-center"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
          {controls}
          <div className="flex items-center justify-between pt-1">
            {clearButton ?? <span />}
            <button
              type="submit"
              className="bg-navy-800 rounded-[var(--radius-pill)] px-6 py-3 text-sm font-medium text-white"
            >
              {t('filtersDone')}
            </button>
          </div>
        </form>
      </dialog>

      {/* Without a count, an over-narrow filter is indistinguishable from an
          empty inbox — the operator concludes there are no leads rather than
          that they filtered them away. */}
      <p className="text-muted text-sm">{summary}</p>
    </div>
  );
}
