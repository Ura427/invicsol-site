'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Badge } from '@/shared/ui/Badge';
import { FilterBar } from '@/widgets/admin-filters';
import { parseLeadFilters, hasActiveLeadFilters } from '@/entities/lead/filters';
import { getLeads, setLeadHandled, type LeadListResult } from './actions';

/**
 * Maps the database's locale-neutral vocabulary onto message keys. The values
 * stay raw in the column (`calculator`, `viber`) and are only ever translated at
 * the edge, so switching the admin language cannot change what is stored.
 */
const SOURCE_KEY: Record<string, string> = {
  calculator: 'sourceCalculator',
  contact: 'sourceContact',
  callback: 'sourceCallback',
};

const METHOD_KEY: Record<string, string> = {
  phone: 'methodPhone',
  viber: 'methodViber',
  telegram: 'methodTelegram',
};

export function LeadsInboxClient() {
  const queryClient = useQueryClient();
  const t = useTranslations('Admin.leads');
  const tCommon = useTranslations('Admin.common');
  const tFilters = useTranslations('Admin.filters');
  const locale = useLocale();

  const searchParams = useSearchParams();
  const filters = parseLeadFilters(Object.fromEntries(searchParams.entries()));

  // Dates follow the admin's chosen language rather than a hardcoded 'en-GB'.
  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    // The filters are part of the key, so each filtered view caches separately
    // and going back to a previous one is instant rather than a refetch.
    queryKey: ['leads', filters],
    queryFn: () => getLeads(filters),
    // Keeps the previous rows on screen while the next query runs, so changing
    // a filter does not blank the table and jump the page height.
    placeholderData: (previous) => previous,
  });

  const mutation = useMutation({
    mutationFn: ({ id, handled }: { id: string; handled: boolean }) => setLeadHandled(id, handled),
    // Optimistic update: the whole point of a leads inbox is that ticking a
    // box feels instant. Roll back to the previous list on failure rather
    // than silently leaving the UI wrong.
    onMutate: async ({ id, handled }) => {
      await queryClient.cancelQueries({ queryKey: ['leads', filters] });
      const previous = queryClient.getQueryData<LeadListResult>(['leads', filters]);

      queryClient.setQueryData<LeadListResult>(['leads', filters], (old) =>
        old
          ? {
              ...old,
              leads: old.leads.map((lead) =>
                lead.id === id
                  ? { ...lead, handledAt: handled ? new Date().toISOString() : null }
                  : lead,
              ),
            }
          : old,
      );

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['leads', filters], context.previous);
      }
    },
    onSettled: () => {
      // Every filtered view is now stale — a lead just moved between the
      // handled and unhandled sets.
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });

  const filterBar = (
    <FilterBar
      hasActive={hasActiveLeadFilters(filters)}
      searchPlaceholder={tFilters('searchLeads')}
      filters={[
        {
          param: 'source',
          label: tFilters('source'),
          allLabel: tFilters('sourceAll'),
          options: [
            { value: 'calculator', label: t('sourceCalculator') },
            { value: 'contact', label: t('sourceContact') },
            { value: 'callback', label: t('sourceCallback') },
          ],
        },
        {
          param: 'via',
          label: tFilters('via'),
          allLabel: tFilters('viaAll'),
          options: [
            { value: 'phone', label: t('methodPhone') },
            { value: 'viber', label: t('methodViber') },
            { value: 'telegram', label: t('methodTelegram') },
          ],
        },
        {
          param: 'status',
          label: tFilters('status'),
          allLabel: tFilters('statusAll'),
          options: [
            { value: 'open', label: tFilters('statusOpen') },
            { value: 'handled', label: tFilters('statusHandled') },
          ],
        },
        {
          param: 'notified',
          label: tFilters('notified'),
          allLabel: tFilters('notifiedAll'),
          options: [
            { value: 'sent', label: tFilters('notifiedSent') },
            { value: 'failed', label: tFilters('notifiedFailed') },
          ],
        },
      ]}
      sort={{
        param: 'sort',
        label: tFilters('sort'),
        options: [
          { value: 'newest', label: tFilters('sortNewest') },
          { value: 'oldest', label: tFilters('sortOldest') },
          { value: 'name', label: tFilters('sortName') },
        ],
      }}
      summary={
        data ? tFilters('showingFiltered', { count: data.count, total: data.total }) : ''
      }
    />
  );

  if (isLoading) {
    return (
      <div className="space-y-8">
        {filterBar}
        <p className="text-muted text-sm">{t('loading')}</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-8">
        {filterBar}
        <p className="text-sm text-red-700">{t('loadError')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {filterBar}

      {data.leads.length === 0 ? (
        // Two different empty states on purpose: "no leads yet" and "your
        // filters match nothing" look identical in a table and mean opposite
        // things — one is a quiet week, the other is a mistake you can undo.
        <p className="text-muted text-sm">
          {data.total === 0 ? t('empty') : tFilters('none')}
        </p>
      ) : (
        // Hairline rules over a bordered, shadowed card — the same device the
        // public site uses for its ruled grids. A table is already a grid of
        // rules; wrapping it in a second container edge was one border too many.
        <div className="border-border overflow-x-auto border-y">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-border text-muted border-b text-xs tracking-[0.14em] uppercase">
                <th className="py-3 pr-4 font-medium">{t('colWhen')}</th>
                <th className="py-3 pr-4 font-medium">{t('colName')}</th>
                <th className="py-3 pr-4 font-medium">{t('colPhone')}</th>
                <th className="py-3 pr-4 font-medium">{t('colVia')}</th>
                <th className="py-3 pr-4 font-medium">{t('colSource')}</th>
                <th className="py-3 pr-4 font-medium">{t('colNotified')}</th>
                <th className="py-3 font-medium">{t('colHandled')}</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {data.leads.map((lead) => (
                <tr key={lead.id} className={lead.handledAt ? 'text-muted' : undefined}>
                  <td className="text-muted py-3 pr-4 whitespace-nowrap">
                    {formatDate(lead.createdAt)}
                  </td>
                  <td className="text-navy-800 py-3 pr-4 font-medium">{lead.name}</td>
                  <td className="py-3 pr-4">
                    <a
                      href={`tel:${lead.phone}`}
                      className="text-navy-800 underline underline-offset-2"
                    >
                      {lead.phone}
                    </a>
                  </td>
                  <td className="text-muted py-3 pr-4">
                    {METHOD_KEY[lead.contactMethod]
                      ? t(METHOD_KEY[lead.contactMethod]!)
                      : lead.contactMethod}
                  </td>
                  <td className="text-muted py-3 pr-4">
                    {SOURCE_KEY[lead.source] ? t(SOURCE_KEY[lead.source]!) : lead.source}
                  </td>
                  <td className="py-3 pr-4">
                    {lead.notifiedAt ? (
                      <Badge tone="positive">{tCommon('yes')}</Badge>
                    ) : (
                      <Badge tone="warning">{tCommon('no')}</Badge>
                    )}
                  </td>
                  <td className="py-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={Boolean(lead.handledAt)}
                        onChange={(event) =>
                          mutation.mutate({ id: lead.id, handled: event.target.checked })
                        }
                        className="accent-gold-600 h-4 w-4"
                      />
                      <span className="text-muted">
                        {lead.handledAt ? t('handled') : t('notHandled')}
                      </span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
