'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/shared/lib/db';
import { requireAdmin } from '@/shared/lib/admin-session';

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

export async function getLeads(): Promise<LeadListItem[]> {
  await requireAdmin();

  const leads = await db.lead.findMany({ orderBy: { createdAt: 'desc' } });

  return leads.map((lead) => ({
    id: lead.id,
    createdAt: lead.createdAt.toISOString(),
    source: lead.source,
    name: lead.name,
    phone: lead.phone,
    contactMethod: lead.contactMethod,
    locale: lead.locale,
    notifiedAt: lead.notifiedAt ? lead.notifiedAt.toISOString() : null,
    handledAt: lead.handledAt ? lead.handledAt.toISOString() : null,
    payload: lead.payload,
  }));
}

export async function setLeadHandled(id: string, handled: boolean): Promise<void> {
  await requireAdmin();

  await db.lead.update({
    where: { id },
    data: { handledAt: handled ? new Date() : null },
  });

  revalidatePath('/admin/leads');
}
