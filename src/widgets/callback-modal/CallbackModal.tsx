'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { X } from 'lucide-react';
import { submitLead } from '@/entities/lead/actions';
import { Button } from '@/shared/ui/Button';

export function CallbackModal() {
  const t = useTranslations('CallbackModal');
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function close() {
    setIsOpen(false);
    setIsSuccess(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const result = await submitLead({
      source: 'callback',
      name: String(formData.get('name') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      contactMethod: 'phone',
      locale,
      website: String(formData.get('website') ?? ''),
    });

    setIsSubmitting(false);
    if (result.ok) setIsSuccess(true);
  }

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        {t('trigger')}
      </Button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={t('heading')}
        >
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6">
            <button
              type="button"
              onClick={close}
              aria-label={t('close')}
              className="text-muted absolute top-4 right-4"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-navy-800 text-lg font-bold">{t('heading')}</h2>

            {isSuccess ? (
              <p className="text-muted mt-4 text-sm">{t('text')}</p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <label htmlFor="callback-website">Website</label>
                  <input type="text" id="callback-website" name="website" tabIndex={-1} autoComplete="off" />
                </div>

                <input
                  type="text"
                  name="name"
                  required
                  placeholder={t('namePlaceholder')}
                  className="border-border w-full rounded-lg border px-3 py-2 text-sm"
                />
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder={t('phonePlaceholder')}
                  className="border-border w-full rounded-lg border px-3 py-2 text-sm"
                />
                <Button type="submit" variant="gold" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? '…' : t('trigger')}
                </Button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
