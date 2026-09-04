'use server';

import { headers } from 'next/headers';
import { db } from '@/shared/lib/db';
import { isRateLimited } from './rateLimit';
import { sendTelegramNotification } from './telegram';
import type { LeadSubmission, LeadSubmissionResult } from './types';

const CONTACT_METHOD_LABEL: Record<LeadSubmission['contactMethod'], string> = {
  phone: 'Дзвінок',
  viber: 'Viber',
  telegram: 'Telegram',
};

const SOURCE_LABEL: Record<LeadSubmission['source'], string> = {
  calculator: 'Калькулятор',
  contact: 'Контактна форма',
  callback: 'Замовлення дзвінка',
};

function buildNotificationText(submission: LeadSubmission): string {
  const lines = [
    `<b>Нова заявка — ${SOURCE_LABEL[submission.source]}</b>`,
    `Ім'я: ${submission.name}`,
    `Телефон: ${submission.phone}`,
    `Зв'язок: ${CONTACT_METHOD_LABEL[submission.contactMethod]}`,
  ];
  return lines.join('\n');
}

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

  const headerList = await headers();
  const ip =
    headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headerList.get('x-real-ip') ??
    'unknown';

  if (isRateLimited(ip)) {
    return { ok: false, error: 'rate_limited' };
  }

  const payload = JSON.stringify({
    source: submission.source,
    name: submission.name,
    phone: submission.phone,
    contactMethod: submission.contactMethod,
    locale: submission.locale,
    extra: submission.extra ?? {},
    submittedAt: new Date().toISOString(),
  });

  const lead = await db.lead.create({
    data: {
      source: submission.source,
      name: submission.name,
      phone: submission.phone,
      contactMethod: submission.contactMethod,
      locale: submission.locale,
      payload,
    },
  });

  const notified = await sendTelegramNotification(buildNotificationText(submission));
  if (notified) {
    await db.lead.update({ where: { id: lead.id }, data: { notifiedAt: new Date() } });
  }

  return { ok: true };
}
