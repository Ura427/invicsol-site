'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { X } from 'lucide-react';
import { submitLead } from '@/entities/lead/actions';
import { Button } from '@/shared/ui/Button';

/**
 * Built on the native <dialog> element rather than a div with role="dialog".
 * showModal() gives us Escape-to-close, focus trapping inside the dialog, focus
 * restore to the trigger on close, and inert-ing of the rest of the page — all
 * from the browser. Hand-rolling those is the usual source of inaccessible modals.
 */
export function CallbackModal() {
  const t = useTranslations('CallbackModal');
  const locale = useLocale();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Syncing React state to an imperative DOM API is exactly what an effect is for.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  function handleClose() {
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

      <dialog
        ref={dialogRef}
        aria-labelledby="callback-modal-heading"
        // Fires for Escape and for close() alike, so state can never drift out of
        // sync with what the browser is actually showing.
        onClose={handleClose}
        // Clicking the backdrop: the dialog element itself is the backdrop area,
        // so a click landing directly on it (not on the inner card) means outside.
        onClick={(event) => {
          if (event.target === dialogRef.current) handleClose();
        }}
        className="callback-dialog w-full max-w-sm rounded-2xl bg-white p-6"
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label={t('close')}
          className="text-muted absolute top-4 right-4"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        <h2 id="callback-modal-heading" className="text-navy-800 text-lg font-bold">
          {t('heading')}
        </h2>

        {isSuccess ? (
          <p className="text-muted mt-4 text-sm" role="status">
            {t('text')}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            {/* Honeypot: hidden from real visitors, filled in by naive bots. */}
            <div className="absolute -left-[9999px]" aria-hidden="true">
              <label htmlFor="callback-website">Website</label>
              <input
                type="text"
                id="callback-website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <label className="block text-sm">
              <span className="text-muted font-medium">{t('nameLabel')}</span>
              <input
                type="text"
                name="name"
                required
                autoComplete="name"
                placeholder={t('namePlaceholder')}
                className="border-border mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              />
            </label>

            <label className="block text-sm">
              <span className="text-muted font-medium">{t('phoneLabel')}</span>
              <input
                type="tel"
                name="phone"
                required
                autoComplete="tel"
                placeholder={t('phonePlaceholder')}
                className="border-border mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              />
            </label>

            <Button type="submit" variant="gold" disabled={isSubmitting} className="w-full">
              {isSubmitting ? t('submitting') : t('submit')}
            </Button>
          </form>
        )}
      </dialog>
    </>
  );
}
