'use client';

import { useId, useMemo, useState, type FormEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Star } from 'lucide-react';
import { Stars } from '@/entities/review/ui/Stars';
import { submitReview } from '@/entities/review/actions';
import {
  validateReviewSubmission,
  AUTHOR_NAME_MAX,
  REVIEW_TEXT_MAX,
  type Rating,
} from '@/entities/review/parse';
import type { RatingSummary } from '@/entities/review/queries';
import { TextField } from '@/shared/ui/TextField';
import { Textarea } from '@/shared/ui/Textarea';
import { Button } from '@/shared/ui/Button';

/** What the server hands over — dates already serialised for the client boundary. */
export interface ReviewView {
  id: string;
  authorName: string;
  rating: Rating;
  text: string;
  locale: string;
  createdAt: string;
}

interface StationReviewsProps {
  stationId: string;
  reviews: readonly ReviewView[];
  summary: RatingSummary | null;
}

type Sort = 'newest' | 'highest' | 'lowest';
const RATINGS: readonly Rating[] = [5, 4, 3, 2, 1];

/**
 * The approved reviews arrive server-rendered as props; sorting and the star
 * filter run here over that list. The page is statically generated, so a
 * client fetch would have meant a flash of "no reviews" on every load and
 * nothing for a search engine to index.
 */
export function StationReviews({ stationId, reviews, summary }: StationReviewsProps) {
  const t = useTranslations('Stations');
  const locale = useLocale();
  const [sort, setSort] = useState<Sort>('newest');
  const [starFilter, setStarFilter] = useState<Rating | null>(null);

  const visible = useMemo(() => {
    const list = starFilter === null ? [...reviews] : reviews.filter((r) => r.rating === starFilter);
    switch (sort) {
      case 'highest':
        return list.sort((a, b) => b.rating - a.rating || b.createdAt.localeCompare(a.createdAt));
      case 'lowest':
        return list.sort((a, b) => a.rating - b.rating || b.createdAt.localeCompare(a.createdAt));
      case 'newest':
        return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
  }, [reviews, sort, starFilter]);

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(iso));

  return (
    <section id="reviews" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2fr)] lg:gap-16">
        {/* Summary column: sticky like WhyUs's photo, so the numbers stay in view
            while the list scrolls. */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="text-navy-800 text-[2rem] sm:text-[2.75rem]">{t('reviewsHeading')}</h2>

          {summary ? (
            <div className="mt-6">
              <p className="text-navy-800 text-5xl font-light tracking-[-0.03em]">
                {summary.average.toFixed(1)}
              </p>
              <Stars
                value={summary.average}
                size="md"
                label={t('reviewsStar', { count: Math.round(summary.average) })}
                className="mt-2"
              />
              <p className="text-muted mt-2 text-sm">
                {t('reviewsBasedOn', { count: summary.count })}
              </p>

              <ul className="mt-6 space-y-1.5">
                {RATINGS.map((n) => {
                  const count = summary.distribution[n];
                  const share = summary.count ? (count / summary.count) * 100 : 0;
                  const isActive = starFilter === n;
                  return (
                    <li key={n}>
                      <button
                        type="button"
                        onClick={() => setStarFilter(isActive ? null : n)}
                        aria-pressed={isActive}
                        className={`flex w-full items-center gap-3 rounded-[var(--radius-sm)] px-1 py-1 text-sm transition-colors ${
                          isActive ? 'bg-surface text-navy-800' : 'text-muted hover:text-navy-800'
                        }`}
                      >
                        <span className="w-3 tabular-nums">{n}</span>
                        <Star className="fill-gold-700 text-gold-700 h-3.5 w-3.5" aria-hidden />
                        <span className="bg-border h-1.5 flex-1 overflow-hidden rounded-full">
                          <span
                            className="bg-gold-700 block h-full rounded-full"
                            style={{ width: `${share}%` }}
                          />
                        </span>
                        <span className="w-6 text-right tabular-nums">{count}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="mt-6">
              <p className="text-navy-800 text-xl">{t('reviewsEmpty')}</p>
              <p className="text-muted mt-2 max-w-[36ch] text-sm leading-relaxed">
                {t('reviewsEmptyBody')}
              </p>
            </div>
          )}
        </div>

        <div>
          {reviews.length > 0 ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-2" role="group" aria-label={t('reviewsSort')}>
                  {(['newest', 'highest', 'lowest'] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setSort(option)}
                      aria-pressed={sort === option}
                      className={`rounded-[var(--radius-pill)] border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                        sort === option
                          ? 'border-navy-800 bg-navy-800 text-white'
                          : 'border-border text-navy-800 hover:border-navy-800/50'
                      }`}
                    >
                      {t(
                        option === 'newest'
                          ? 'reviewsSortNewest'
                          : option === 'highest'
                            ? 'reviewsSortHighest'
                            : 'reviewsSortLowest',
                      )}
                    </button>
                  ))}
                </div>
                {starFilter !== null ? (
                  <button
                    type="button"
                    onClick={() => setStarFilter(null)}
                    className="text-navy-800 text-sm font-medium underline underline-offset-4"
                  >
                    {t('reviewsFilterAll')}
                  </button>
                ) : null}
              </div>

              {visible.length === 0 ? (
                <p className="text-muted mt-8 text-sm">{t('reviewsNoneMatch')}</p>
              ) : (
                <ul className="border-border divide-border mt-6 divide-y border-t">
                  {visible.map((review) => (
                    <li key={review.id} className="py-7">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        <Stars
                          value={review.rating}
                          label={t('reviewsStar', { count: review.rating })}
                        />
                        <span className="text-navy-800 font-medium">{review.authorName}</span>
                        <span className="text-muted text-sm">
                          {formatDate(review.createdAt)}
                          {review.locale !== locale ? (
                            <>
                              {' · '}
                              {t('reviewsWrittenIn', { locale: review.locale.toUpperCase() })}
                            </>
                          ) : null}
                        </span>
                      </div>
                      <p className="text-navy-800 mt-3 max-w-[62ch] leading-relaxed">{review.text}</p>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : null}

          <ReviewForm stationId={stationId} className={reviews.length > 0 ? 'mt-14' : ''} />
        </div>
      </div>
    </section>
  );
}

function ReviewForm({ stationId, className = '' }: { stationId: string; className?: string }) {
  const t = useTranslations('Stations');
  const locale = useLocale();
  const groupId = useId();
  const [rating, setRating] = useState<Rating | null>(null);
  const [hovered, setHovered] = useState<Rating | null>(null);
  const [state, setState] = useState<'idle' | 'submitting' | 'done'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);
    const submission = {
      stationId,
      authorName: String(form.get('authorName') ?? ''),
      rating: rating ?? 0,
      text: String(form.get('text') ?? ''),
      locale,
      website: String(form.get('website') ?? ''),
    };

    // Same check the server runs, so the user hears about a short review from
    // the form and not from a round trip.
    if (validateReviewSubmission(submission) === null) {
      setError(t('reviewsFormErrorInvalid'));
      return;
    }

    setState('submitting');
    try {
      const result = await submitReview(submission);
      if (result.ok) {
        setState('done');
        return;
      }
      setError(
        result.error === 'rate_limited'
          ? t('reviewsFormErrorRateLimited')
          : result.error === 'invalid'
            ? t('reviewsFormErrorInvalid')
            : t('reviewsFormErrorGeneric'),
      );
    } catch {
      setError(t('reviewsFormErrorGeneric'));
    }
    setState('idle');
  }

  if (state === 'done') {
    return (
      <p
        className={`bg-surface text-navy-800 rounded-[var(--radius-lg)] px-6 py-5 text-sm leading-relaxed ${className}`}
        role="status"
      >
        {t('reviewsFormThanks')}
      </p>
    );
  }

  const shown = hovered ?? rating ?? 0;

  return (
    <form onSubmit={handleSubmit} noValidate className={`max-w-xl space-y-5 ${className}`}>
      <h3 className="text-navy-800 text-xl">{t('reviewsFormHeading')}</h3>

      <TextField
        id={`${groupId}-name`}
        name="authorName"
        label={t('reviewsFormName')}
        required
        maxLength={AUTHOR_NAME_MAX}
        autoComplete="name"
      />

      {/* Five radio buttons, visually stars. A fieldset with real radios is what
          keeps this keyboard-operable and announced correctly; the icons are
          just the label. */}
      <fieldset className="text-base sm:text-sm">
        <legend className="text-muted font-medium">
          {t('reviewsFormRating')}
          <span className="text-gold-700 ml-1" aria-hidden>
            *
          </span>
        </legend>
        <div className="mt-1.5 flex gap-1" onMouseLeave={() => setHovered(null)}>
          {([1, 2, 3, 4, 5] as const).map((n) => (
            <label
              key={n}
              className="cursor-pointer p-1"
              onMouseEnter={() => setHovered(n)}
            >
              <input
                type="radio"
                name="rating"
                value={n}
                checked={rating === n}
                onChange={() => setRating(n)}
                className="sr-only"
                aria-label={t('reviewsStar', { count: n })}
              />
              <Star
                aria-hidden
                className={`h-7 w-7 transition-colors ${
                  n <= shown ? 'fill-gold-700 text-gold-700' : 'text-border'
                }`}
              />
            </label>
          ))}
        </div>
      </fieldset>

      <Textarea
        id={`${groupId}-text`}
        name="text"
        label={t('reviewsFormText')}
        hint={t('reviewsFormTextHint')}
        required
        rows={4}
        maxLength={REVIEW_TEXT_MAX}
      />

      {/* Honeypot — off-screen, never labelled for a person, skipped by the tab
          order. A bot that fills every field fills this one. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      {error ? (
        <p className="text-sm text-red-700" role="alert" aria-live="polite">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={state === 'submitting'}>
        {state === 'submitting' ? t('reviewsFormSubmitting') : t('reviewsFormSubmit')}
      </Button>
    </form>
  );
}
