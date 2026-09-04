export type LeadSource = 'calculator' | 'contact' | 'callback';
export type ContactMethod = 'phone' | 'viber' | 'telegram';

export interface LeadSubmission {
  source: LeadSource;
  name: string;
  phone: string;
  contactMethod: ContactMethod;
  locale: string;
  /** Honeypot field — real visitors never fill it in. A bot that fills every
   * field on a form will. Left blank, this is the signal the submission is human. */
  website: string;
  /** Anything else worth recording (calculator answers, a contact-form comment). */
  extra?: Record<string, unknown>;
}

export interface LeadSubmissionResult {
  ok: boolean;
  error?: 'spam' | 'rate_limited' | 'invalid';
}
