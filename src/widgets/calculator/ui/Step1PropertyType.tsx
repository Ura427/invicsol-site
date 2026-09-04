import { useTranslations } from 'next-intl';
import type { Dispatch } from 'react';
import type { CalculatorAction, CalculatorState } from '../model/types';
import { StepShell } from './StepShell';
import { OptionCard } from './OptionCard';

export function Step1PropertyType({
  state,
  dispatch,
}: {
  state: CalculatorState;
  dispatch: Dispatch<CalculatorAction>;
}) {
  const t = useTranslations('Calculator');

  return (
    <StepShell step={1} title={t('propertyType.title')}>
      <div className="grid gap-3 sm:grid-cols-2">
        <OptionCard
          label={t('propertyType.house')}
          isSelected={state.propertyType === 'house'}
          onClick={() => dispatch({ type: 'SET_PROPERTY_TYPE', value: 'house' })}
        />
        <OptionCard
          label={t('propertyType.business')}
          isSelected={state.propertyType === 'business'}
          onClick={() => dispatch({ type: 'SET_PROPERTY_TYPE', value: 'business' })}
        />
      </div>
    </StepShell>
  );
}
