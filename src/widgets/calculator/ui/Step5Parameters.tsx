import { useTranslations } from 'next-intl';
import type { Dispatch } from 'react';
import type { CalculatorAction, CalculatorState } from '../model/types';
import { StepShell } from './StepShell';

export function Step5Parameters({
  state,
  dispatch,
}: {
  state: CalculatorState;
  dispatch: Dispatch<CalculatorAction>;
}) {
  const t = useTranslations('Calculator');

  return (
    <StepShell step={5} title={t('parameters.title')}>
      <div className="space-y-4">
        <label className="block text-sm">
          <span className="text-muted font-medium">{t('parameters.tariff')}</span>
          <input
            type="number"
            min={0}
            step={0.1}
            className="border-border mt-1 w-full rounded-lg border px-3 py-2"
            value={state.tariff ?? ''}
            onChange={(e) =>
              dispatch({ type: 'SET_TARIFF', value: e.target.value === '' ? null : Number(e.target.value) })
            }
          />
        </label>

        <label className="block text-sm">
          <span className="text-muted font-medium">{t('parameters.desiredPower')}</span>
          <input
            type="number"
            min={0}
            step={0.1}
            className="border-border mt-1 w-full rounded-lg border px-3 py-2"
            value={state.desiredPowerKw ?? ''}
            disabled={state.useAutoEstimate}
            onChange={(e) =>
              dispatch({
                type: 'SET_DESIRED_POWER_KW',
                value: e.target.value === '' ? null : Number(e.target.value),
              })
            }
          />
        </label>
      </div>
    </StepShell>
  );
}
