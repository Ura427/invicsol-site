'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { db } from '@/shared/lib/db';

/**
 * The proxy (src/proxy.ts) already blocks an unauthenticated request from
 * reaching any /admin page — but per Next's own guidance, a Server Function
 * is reachable directly and must check for itself rather than trust the
 * proxy alone. Cheap, and it's the difference between defense-in-depth and a
 * single point of failure.
 */
async function requireAdmin(): Promise<void> {
  const session = await auth();
  if (!session) {
    throw new Error('Unauthorized');
  }
}

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
