import type { ReactNode } from 'react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`border-border shadow-card rounded-2xl border bg-white p-6 ${className}`}
    >
      {children}
    </div>
  );
}
