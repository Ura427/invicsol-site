'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/shared/ui/Button';

/**
 * Without this, a thrown Unauthorized from a server action — or any database
 * failure — hit Next's default error screen, outside the admin's own chrome and
 * in English regardless of the chosen language.
 *
 * The error object itself is deliberately not rendered: server-side messages can
 * carry connection strings and query fragments, and this page is reachable by
 * anyone who guesses the URL.
 */
export default function AdminError({ reset }: { error: Error; reset: () => void }) {
  const t = useTranslations('Admin.common');

  return (
    <div className="mx-auto flex max-w-md flex-col items-start gap-5 px-4 py-16 sm:px-6">
      <h1 className="text-navy-800 text-2xl">{t('errorHeading')}</h1>
      <p className="text-muted text-sm leading-relaxed">{t('errorBody')}</p>
      <Button onClick={reset} variant="outline">
        {t('retry')}
      </Button>
    </div>
  );
}
