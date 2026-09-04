import { useTranslations } from 'next-intl';
import type { Dispatch } from 'react';
import type { CalculatorAction, CalculatorState, Goal } from '../model/types';
import { StepShell } from './StepShell';
import { OptionCard } from './OptionCard';

const GOALS: readonly Goal[] = ['savings', 'backup', 'independence', 'payback', 'sellExcess'];

export function Step4Goals({
  state,
  dispatch,
}: {
  state: CalculatorState;
  dispatch: Dispatch<CalculatorAction>;
}) {
  const t = useTranslations('Calculator');

  return (
    <StepShell step={4} title={t('goals.title')}>
      <p className="text-muted -mt-2 mb-4 text-sm">{t('goals.hint')}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {GOALS.map((goal) => (
          <OptionCard
            key={goal}
            label={t(`goals.${goal}`)}
            isSelected={state.goals.includes(goal)}
            onClick={() => dispatch({ type: 'TOGGLE_GOAL', value: goal })}
          />
        ))}
      </div>
    </StepShell>
  );
}
