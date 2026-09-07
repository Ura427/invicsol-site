import type { ReactNode } from 'react';

/**
 * Flat by design: a white fill lifted off the warm canvas by tone alone — no
 * border, no shadow. The previous version had both a 1px border AND a 32px-blur
 * shadow, which is a recognized generated-UI signature: it commits to neither a
 * defined edge nor real elevation. Tonal layering is the entire elevation system
 * here (surface → paper → elevated → navy); see the tokens in globals.css.
 */
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-elevated rounded-[var(--radius-lg)] p-7 ${className}`}>{children}</div>
  );
}
