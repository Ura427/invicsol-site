'use server';

import { headers } from 'next/headers';
import { db } from '@/shared/lib/db';
import { isRateLimited } from './rateLimit';
import { sendTelegramNotification } from './telegram';
import { buildNotificationText } from './notification';
import { normalizeUaPhone } from './phone';
import type { LeadSubmission, LeadSubmissionResult } from './types';

/**
 * Every submission does two things: persists to the database AND fires a
 * Telegram notification. Database persistence and the Telegram side effect are
 * deliberately independent — SQLite on a typical serverless host may not
 * reliably persist writes at runtime, so the notification must not depend on
 * the write having succeeded, and vice versa.
 */
export async function submitLead(submission: LeadSubmission): Promise<LeadSubmissionResult> {
  if (submission.website.trim() !== '') {
    return { ok: false, error: 'spam' };
  }

  if (!submission.name.trim() || !submission.phone.trim()) {
    return { ok: false, error: 'invalid' };
  }

  // Validated here as well as in the form, because the client check is a
  // convenience and this is the actual gate — a server function can be called
  // directly. The stored and notified number is the normalised one, so every
  // lead arrives in a single dialable format regardless of how it was typed.
  const phone = normalizeUaPhone(submission.phone);
  if (phone === null) {
    return { ok: false, error: 'invalid_phone' };
  }
  const normalized: LeadSubmission = { ...submission, phone };

  const headerList = await headers();
  const ip =
    headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headerList.get('x-real-ip') ??
    'unknown';

  if (isRateLimited(ip)) {
    return { ok: false, error: 'rate_limited' };
  }

  const payload = JSON.stringify({
    source: normalized.source,
    name: normalized.name,
    phone: normalized.phone,
    contactMethod: normalized.contactMethod,
    locale: normalized.locale,
    extra: normalized.extra ?? {},
    submittedAt: new Date().toISOString(),
  });

  const lead = await db.lead.create({
    data: {
      source: normalized.source,
      name: normalized.name,
      phone: normalized.phone,
      contactMethod: normalized.contactMethod,
      locale: normalized.locale,
      payload,
    },
  });

  // The lead is already safely persisted above. Telegram is a *second*, independent
  // side effect, so a network failure here must not surface to the visitor as a
  // failed submission — that would make them submit again, or give up entirely,
  // over a lead we already captured. A null `notifiedAt` is the signal to follow up.
  try {
    const notified = await sendTelegramNotification(buildNotificationText(normalized));
    if (notified) {
      await db.lead.update({ where: { id: lead.id }, data: { notifiedAt: new Date() } });
    }
  } catch (error) {
    console.error('[lead] Telegram notification failed for lead', lead.id, error);
  }

  return { ok: true };
}
