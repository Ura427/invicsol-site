import { useTranslations } from 'next-intl';
import type { Dispatch } from 'react';
import type { CalculatorAction, CalculatorState, SolutionType } from '../model/types';
import { StepShell } from './StepShell';
import { OptionCard } from './OptionCard';

const OPTIONS: readonly SolutionType[] = ['station', 'storage', 'both'];

export function Step2SolutionType({
  state,
  dispatch,
}: {
  state: CalculatorState;
  dispatch: Dispatch<CalculatorAction>;
}) {
  const t = useTranslations('Calculator');

  return (
    <StepShell step={2} title={t('solutionType.title')}>
      <div className="grid gap-3">
        {OPTIONS.map((option) => (
          <OptionCard
            key={option}
            label={t(`solutionType.${option}`)}
            isSelected={state.solutionType === option}
            onClick={() => dispatch({ type: 'SET_SOLUTION_TYPE', value: option })}
          />
        ))}
      </div>
    </StepShell>
  );
}
