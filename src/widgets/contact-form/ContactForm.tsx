'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { submitLead } from '@/entities/lead/actions';
import { isValidUaPhone } from '@/entities/lead/phone';
import { trackEvent } from '@/shared/lib/analytics';
import { Button } from '@/shared/ui/Button';
import { TextField } from '@/shared/ui/TextField';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import type { ContactMethod } from '@/entities/lead/types';

export function ContactForm() {
  const t = useTranslations('ContactForm');
  const tf = useTranslations('Forms');
  const locale = useLocale();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Per-field errors, set on submit rather than while typing.
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; phone?: string }>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setError(null);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') ?? '').trim();
    const phone = String(formData.get('phone') ?? '').trim();

    const nextFieldErrors: { name?: string; phone?: string } = {};
    if (!name) nextFieldErrors.name = tf('errRequired');
    if (!phone) nextFieldErrors.phone = tf('errRequired');
    else if (!isValidUaPhone(phone)) nextFieldErrors.phone = tf('errPhone');

    setFieldErrors(nextFieldErrors);
    if (Object.keys(nextFieldErrors).length > 0) return;

    setIsSubmitting(true);

    let result: Awaited<ReturnType<typeof submitLead>>;
    try {
      result = await submitLead({
        source: 'contact',
        name,
        phone,
        contactMethod: (formData.get('contactMethod') as ContactMethod) ?? 'phone',
        locale,
        website: String(formData.get('website') ?? ''),
        extra: { message: String(formData.get('message') ?? '') },
      });
    } catch {
      setError(t('error'));
      return;
    } finally {
      setIsSubmitting(false);
    }

    if (!result.ok) {
      // The server validates the phone too; surface that on the field rather
      // than as a generic failure the visitor cannot act on.
      if (result.error === 'invalid_phone') {
        setFieldErrors({ phone: tf('errPhone') });
        return;
      }
      setError(t('error'));
      return;
    }

    trackEvent('Lead', { source: 'contact' });
    router.push('/thank-you');
  }

  return (
    <section className="mx-auto max-w-xl px-4 py-14 sm:py-20 lg:py-24 sm:px-6 lg:px-8">
      <SectionHeading title={t('heading')} description={t('text')} />

      <form noValidate onSubmit={handleSubmit} className="mt-8 space-y-4">
        {/* Honeypot — hidden from real visitors via CSS, filled in by naive bots. */}
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            type="text"
            id="website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <p className="text-muted text-xs">{tf('requiredNote')}</p>

        <TextField
          id="contact-name"
          name="name"
          type="text"
          label={t('name')}
          required
          autoComplete="name"
          error={fieldErrors.name ?? null}
        />

        <TextField
          id="contact-phone"
          name="phone"
          type="tel"
          label={t('phone')}
          required
          autoComplete="tel"
          inputMode="tel"
          placeholder="+380 67 123 45 67"
          error={fieldErrors.phone ?? null}
        />

        <fieldset className="text-sm">
          <legend className="text-muted font-medium">{t('contactMethod')}</legend>
          <div className="mt-1 flex gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" name="contactMethod" value="phone" defaultChecked />{' '}
              {t('methodPhone')}
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="contactMethod" value="viber" /> {t('methodViber')}
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="contactMethod" value="telegram" />{' '}
              {t('methodTelegram')}
            </label>
          </div>
        </fieldset>

        <label className="block text-sm">
          <span className="text-muted font-medium">{t('message')}</span>
          <textarea
            name="message"
            rows={3}
            className="border-border bg-elevated mt-1 w-full rounded-lg border px-3 py-2 text-base sm:text-sm"
          />
        </label>

        <p className="text-sm text-red-600" role="alert" aria-live="polite">
          {error}
        </p>

        <Button type="submit" variant="gold" disabled={isSubmitting} className="w-full">
          {isSubmitting ? t('submitting') : t('submit')}
        </Button>
      </form>
    </section>
  );
}
