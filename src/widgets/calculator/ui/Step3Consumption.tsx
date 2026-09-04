import { useTranslations } from 'next-intl';
import type { Dispatch } from 'react';
import type { CalculatorAction, CalculatorState } from '../model/types';
import { StepShell } from './StepShell';
import { OptionCard } from './OptionCard';

export function Step3Consumption({
  state,
  dispatch,
}: {
  state: CalculatorState;
  dispatch: Dispatch<CalculatorAction>;
}) {
  const t = useTranslations('Calculator');

  return (
    <StepShell step={3} title={t('consumption.title')}>
      <div className="space-y-6">
        <div>
          <p className="text-muted mb-2 text-sm font-medium">{t('consumption.phase')}</p>
          <div className="grid grid-cols-2 gap-3">
            <OptionCard
              label={t('consumption.phase1')}
              isSelected={state.phase === '1'}
              onClick={() => dispatch({ type: 'SET_PHASE', value: '1' })}
            />
            <OptionCard
              label={t('consumption.phase3')}
              isSelected={state.phase === '3'}
              onClick={() => dispatch({ type: 'SET_PHASE', value: '3' })}
            />
          </div>
        </div>

        <label className="block text-sm">
          <span className="text-muted font-medium">{t('consumption.monthlyKwh')}</span>
          <input
            type="number"
            min={0}
            className="border-border mt-1 w-full rounded-lg border px-3 py-2"
            value={state.monthlyKwh ?? ''}
            onChange={(e) =>
              dispatch({
                type: 'SET_MONTHLY_KWH',
                value: e.target.value === '' ? null : Number(e.target.value),
              })
            }
          />
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={state.useAutoEstimate}
            onChange={(e) => dispatch({ type: 'SET_USE_AUTO_ESTIMATE', value: e.target.checked })}
          />
          <span>{t('consumption.autoEstimate')}</span>
        </label>

        {state.useAutoEstimate && state.desiredPowerKw !== null ? (
          <p className="text-navy-800 text-sm font-semibold">
            {t('consumption.estimatedPower', { power: state.desiredPowerKw })}
          </p>
        ) : null}
      </div>
    </StepShell>
  );
}
