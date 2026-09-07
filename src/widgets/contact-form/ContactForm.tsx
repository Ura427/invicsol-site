'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { submitLead } from '@/entities/lead/actions';
import { trackEvent } from '@/shared/lib/analytics';
import { Button } from '@/shared/ui/Button';
import { SectionHeading } from '@/shared/ui/SectionHeading';
import type { ContactMethod } from '@/entities/lead/types';

export function ContactForm() {
  const t = useTranslations('ContactForm');
  const locale = useLocale();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const result = await submitLead({
      source: 'contact',
      name: String(formData.get('name') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      contactMethod: (formData.get('contactMethod') as ContactMethod) ?? 'phone',
      locale,
      website: String(formData.get('website') ?? ''),
      extra: { message: String(formData.get('message') ?? '') },
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setError(t('error'));
      return;
    }

    trackEvent('Lead', { source: 'contact' });
    router.push('/thank-you');
  }

  return (
    <section className="mx-auto max-w-xl px-4 py-24 sm:px-6 lg:px-8">
      <SectionHeading title={t('heading')} description={t('text')} />

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {/* Honeypot — hidden from real visitors via CSS, filled in by naive bots. */}
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <label className="block text-sm">
          <span className="text-muted font-medium">{t('name')}</span>
          <input
            type="text"
            name="name"
            required
            className="border-border mt-1 w-full rounded-lg border px-3 py-2"
          />
        </label>

        <label className="block text-sm">
          <span className="text-muted font-medium">{t('phone')}</span>
          <input
            type="tel"
            name="phone"
            required
            className="border-border mt-1 w-full rounded-lg border px-3 py-2"
          />
        </label>

        <fieldset className="text-sm">
          <legend className="text-muted font-medium">{t('contactMethod')}</legend>
          <div className="mt-1 flex gap-4">
            <label className="flex items-center gap-2">
              <input type="radio" name="contactMethod" value="phone" defaultChecked /> {t('methodPhone')}
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="contactMethod" value="viber" /> {t('methodViber')}
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="contactMethod" value="telegram" /> {t('methodTelegram')}
            </label>
          </div>
        </fieldset>

        <label className="block text-sm">
          <span className="text-muted font-medium">{t('message')}</span>
          <textarea
            name="message"
            rows={3}
            className="border-border mt-1 w-full rounded-lg border px-3 py-2"
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
