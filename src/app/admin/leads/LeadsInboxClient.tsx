'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLeads, setLeadHandled, type LeadListItem } from './actions';

const SOURCE_LABEL: Record<string, string> = {
  calculator: 'Calculator',
  contact: 'Contact form',
  callback: 'Callback request',
};

const CONTACT_METHOD_LABEL: Record<string, string> = {
  phone: 'Phone',
  viber: 'Viber',
  telegram: 'Telegram',
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

export function LeadsInboxClient() {
  const queryClient = useQueryClient();

  const { data: leads, isLoading, isError } = useQuery({
    queryKey: ['leads'],
    queryFn: getLeads,
  });

  const mutation = useMutation({
    mutationFn: ({ id, handled }: { id: string; handled: boolean }) => setLeadHandled(id, handled),
    // Optimistic update: the whole point of a leads inbox is that ticking a
    // box feels instant. Roll back to the previous list on failure rather
    // than silently leaving the UI wrong.
    onMutate: async ({ id, handled }) => {
      await queryClient.cancelQueries({ queryKey: ['leads'] });
      const previous = queryClient.getQueryData<LeadListItem[]>(['leads']);

      queryClient.setQueryData<LeadListItem[]>(['leads'], (old) =>
        old?.map((lead) =>
          lead.id === id ? { ...lead, handledAt: handled ? new Date().toISOString() : null } : lead,
        ),
      );

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['leads'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });

  if (isLoading) {
    return <p className="text-sm text-gray-500">Loading leads…</p>;
  }

  if (isError || !leads) {
    return <p className="text-sm text-red-600">Could not load leads.</p>;
  }

  if (leads.length === 0) {
    return <p className="text-sm text-gray-500">No leads yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs tracking-wide text-gray-500 uppercase">
          <tr>
            <th className="px-4 py-3">When</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Via</th>
            <th className="px-4 py-3">Source</th>
            <th className="px-4 py-3">Sent to Telegram</th>
            <th className="px-4 py-3">Handled</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {leads.map((lead) => (
            <tr key={lead.id} className={lead.handledAt ? 'bg-gray-50/60' : undefined}>
              <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                {formatDate(lead.createdAt)}
              </td>
              <td className="px-4 py-3 font-medium text-gray-900">{lead.name}</td>
              <td className="px-4 py-3">
                <a href={`tel:${lead.phone}`} className="text-gray-900 underline underline-offset-2">
                  {lead.phone}
                </a>
              </td>
              <td className="px-4 py-3 text-gray-500">
                {CONTACT_METHOD_LABEL[lead.contactMethod] ?? lead.contactMethod}
              </td>
              <td className="px-4 py-3 text-gray-500">{SOURCE_LABEL[lead.source] ?? lead.source}</td>
              <td className="px-4 py-3">
                {lead.notifiedAt ? (
                  <span className="text-green-700">Yes</span>
                ) : (
                  <span className="text-red-600">No</span>
                )}
              </td>
              <td className="px-4 py-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(lead.handledAt)}
                    onChange={(event) =>
                      mutation.mutate({ id: lead.id, handled: event.target.checked })
                    }
                  />
                  <span className="text-gray-500">{lead.handledAt ? 'Handled' : 'Not yet'}</span>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
