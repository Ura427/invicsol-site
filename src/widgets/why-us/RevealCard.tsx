'use client';

import type { ReactNode } from 'react';
import { useScrollReveal } from '@/shared/hooks/useScrollReveal';

export function RevealCard({ children, delayMs = 0 }: { children: ReactNode; delayMs?: number }) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}
