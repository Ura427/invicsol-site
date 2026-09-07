import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { TOTAL_STEPS } from '../model/types';

interface StepShellProps {
  step: number;
  title: string;
  children: ReactNode;
}

export function StepShell({ step, title, children }: StepShellProps) {
  const t = useTranslations('Calculator');

  return (
    <div>
      <div className="border-border h-1.5 w-full overflow-hidden rounded-full bg-surface">
        <div
          className="bg-gold-500 h-full rounded-full transition-all"
          style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        />
      </div>
      <p className="text-muted mt-3 text-xs font-semibold tracking-wide uppercase">
        {t('step', { current: step, total: TOTAL_STEPS })}
      </p>
      <h2 className="text-navy-800 mt-2 text-2xl">{title}</h2>
      <div className="mt-6">{children}</div>
    </div>
  );
}
