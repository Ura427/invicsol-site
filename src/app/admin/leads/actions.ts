'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/shared/lib/db';
import { requireAdmin } from '@/shared/lib/admin-session';
import {
  toPrismaWhere,
  toPrismaOrderBy,
  type LeadFilters,
} from '@/entities/lead/filters';

export interface LeadListItem {
  id: string;
  createdAt: string;
  source: string;
  name: string;
  phone: string;
  contactMethod: string;
  locale: string;
  notifiedAt: string | null;
  handledAt: string | null;
  payload: string;
}

export interface LeadListResult {
  leads: LeadListItem[];
  /** Rows matching the current filters. */
  count: number;
  /** Rows in the table regardless of filters, so the UI can say "12 of 340". */
  total: number;
}

/**
 * Filters are applied in the database rather than in the browser. That is the
 * difference between a list that stays usable at a few thousand leads and one
 * that ships the entire table to the client on every page load.
 *
 * Still a server action rather than a route handler, because the client uses it
 * as a TanStack queryFn — which is what keeps the "handled" checkbox optimistic.
 */
export async function getLeads(filters: LeadFilters): Promise<LeadListResult> {
  await requireAdmin();

  const where = toPrismaWhere(filters);

  const [leads, count, total] = await Promise.all([
    db.lead.findMany({ where, orderBy: toPrismaOrderBy(filters.sort) }),
    db.lead.count({ where }),
    db.lead.count(),
  ]);

  return {
    leads: leads.map((lead) => ({
      id: lead.id,
      createdAt: lead.createdAt.toISOString(),
      source: lead.source,
      name: lead.name,
      phone: lead.phone,
      contactMethod: lead.contactMethod,
      locale: lead.locale,
      notifiedAt: lead.notifiedAt?.toISOString() ?? null,
      handledAt: lead.handledAt?.toISOString() ?? null,
      payload: lead.payload,
    })),
    count,
    total,
  };
}

export async function setLeadHandled(id: string, handled: boolean): Promise<void> {
  await requireAdmin();

  await db.lead.update({
    where: { id },
    data: { handledAt: handled ? new Date() : null },
  });

  revalidatePath('/admin/leads');
}
