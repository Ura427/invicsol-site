'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/shared/ui/Button';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('Error');

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-navy-800 text-3xl">{t('heading')}</h1>
      <p className="text-muted max-w-md">{t('text')}</p>
      <Button onClick={reset} variant="primary">
        {t('retry')}
      </Button>
    </div>
  );
}
