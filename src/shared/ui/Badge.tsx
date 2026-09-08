import type { ReactNode } from 'react';

type Tone = 'neutral' | 'accent' | 'positive' | 'warning';

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}

/**
 * The one small status pill, replacing three separate hand-rolled versions: the
 * accent badge inlined in StationCard, and the bare `text-green-700` /
 * `text-amber-600` spans in the admin tables.
 *
 * Tones are named for what they mean, not what colour they are, so a status can
 * be re-toned in one place without every call site reading as a lie.
 */
const TONE_STYLES: Record<Tone, string> = {
  neutral: 'bg-surface text-muted',
  accent: 'bg-gold-500/10 text-gold-700',
  positive: 'bg-emerald-600/10 text-emerald-800',
  // Deliberately gold rather than amber: amber was a fourth warm hue competing
  // with the brand gold for the same job.
  warning: 'bg-gold-500/15 text-gold-700',
};

export function Badge({ children, tone = 'neutral', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-[var(--radius-pill)] px-2.5 py-1 text-xs font-medium whitespace-nowrap ${TONE_STYLES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
