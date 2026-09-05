import { Resend } from 'resend';

/**
 * Generic transactional email sender, shared by lead confirmations (once a form
 * collects an address to send them to — see the entities/lead layer) and the
 * admin password-reset flow.
 *
 * Disabled (no-ops, returns false) when RESEND_API_KEY is unset, mirroring
 * entities/lead/telegram.ts — local development shouldn't require a Resend
 * account to exercise the rest of the app.
 */

let client: Resend | null = null;

function getClient(): Resend | null {
  const apiKey = process.env['RESEND_API_KEY'];
  if (!apiKey) return null;
  client ??= new Resend(apiKey);
  return client;
}

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(input: SendEmailInput): Promise<boolean> {
  const resend = getClient();
  if (!resend) return false;

  const from = process.env['RESEND_FROM_EMAIL'];
  if (!from) {
    console.error('[email] RESEND_API_KEY is set but RESEND_FROM_EMAIL is missing');
    return false;
  }

  const { error } = await resend.emails.send({
    from,
    to: input.to,
    subject: input.subject,
    html: input.html,
  });

  if (error) {
    console.error('[email] Resend rejected the send:', error);
    return false;
  }

  return true;
}
