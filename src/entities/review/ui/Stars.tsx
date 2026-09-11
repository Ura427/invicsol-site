import { Star } from 'lucide-react';

interface StarsProps {
  /** 0–5; fractional values fill the nearest whole star below. */
  value: number;
  /** Accessible name — "4 stars", "4.6 out of 5". Always required: five icons say nothing. */
  label: string;
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Five stars, filled up to `value`, in the brand gold. Read-only: the input
 * version lives in the review form, where the stars are radio buttons.
 *
 * gold-700 for the fill, the same value every small gold icon on the site
 * uses, and for the same reason: a filled star carries meaning (it *is* the
 * rating), so WCAG's 3:1 floor for graphics applies. Measured: gold-700 is
 * 5.62:1 on paper and 5.19:1 on surface; gold-600, which looked more like a
 * star, is 2.89:1 and 2.67:1 — under the line on both.
 */
export function Stars({ value, label, size = 'sm', className = '' }: StarsProps) {
  const px = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  const filled = Math.floor(value);

  return (
    <span role="img" aria-label={label} className={`inline-flex gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          aria-hidden
          className={`${px} ${n <= filled ? 'fill-gold-700 text-gold-700' : 'text-border'}`}
        />
      ))}
    </span>
  );
}
