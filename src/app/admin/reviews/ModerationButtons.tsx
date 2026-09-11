'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { setReviewStatus, deleteReview } from './actions';
import type { ReviewStatus } from '@/entities/review/parse';

export function ModerationButtons({ id, status }: { id: string; status: ReviewStatus }) {
  const t = useTranslations('Admin.reviews');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // A failed action (an expired session, a lost connection) used to vanish
  // into a discarded promise: the click did nothing and said nothing.
  const act = (fn: () => Promise<void>) =>
    startTransition(async () => {
      setError(null);
      try {
        await fn();
      } catch {
        setError(t('error'));
      }
    });

  const link = 'text-sm font-medium transition-colors disabled:opacity-50';

  return (
    <div className="flex flex-wrap justify-end gap-x-4 gap-y-1 whitespace-nowrap">
      {status !== 'approved' ? (
        <button
          type="button"
          disabled={isPending}
          onClick={() => act(() => setReviewStatus(id, 'approved'))}
          className={`${link} text-emerald-800 hover:text-emerald-900`}
        >
          {t('approve')}
        </button>
      ) : null}
      {status !== 'rejected' ? (
        <button
          type="button"
          disabled={isPending}
          onClick={() => act(() => setReviewStatus(id, 'rejected'))}
          className={`${link} text-navy-800 hover:text-gold-700`}
        >
          {t('reject')}
        </button>
      ) : null}
      {status !== 'pending' ? (
        <button
          type="button"
          disabled={isPending}
          onClick={() => act(() => setReviewStatus(id, 'pending'))}
          className={`${link} text-muted hover:text-navy-800`}
        >
          {t('restore')}
        </button>
      ) : null}
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          if (!window.confirm(t('confirmDelete'))) return;
          act(() => deleteReview(id));
        }}
        className={`${link} text-red-700 hover:text-red-900`}
      >
        {t('delete')}
      </button>
      {error ? (
        <p
          className="w-full text-right text-xs whitespace-normal text-red-700"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
