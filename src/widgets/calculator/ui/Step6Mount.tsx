import { useTranslations } from 'next-intl';
import type { Dispatch } from 'react';
import type { CalculatorAction, CalculatorState } from '../model/types';
import { StepShell } from './StepShell';
import { OptionCard } from './OptionCard';

export function Step6Mount({
  state,
  dispatch,
}: {
  state: CalculatorState;
  dispatch: Dispatch<CalculatorAction>;
}) {
  const t = useTranslations('Calculator');

  return (
    <StepShell step={6} title={t('mount.title')}>
      <div className="space-y-6">
        <div>
          <p className="text-muted mb-2 text-sm font-medium">{t('mount.mountType')}</p>
          <div className="grid grid-cols-2 gap-3">
            <OptionCard
              label={t('mount.roof')}
              isSelected={state.mountType === 'roof'}
              onClick={() => dispatch({ type: 'SET_MOUNT_TYPE', value: 'roof' })}
            />
            <OptionCard
              label={t('mount.ground')}
              isSelected={state.mountType === 'ground'}
              onClick={() => dispatch({ type: 'SET_MOUNT_TYPE', value: 'ground' })}
            />
          </div>
        </div>

        <div>
          <p className="text-muted mb-2 text-sm font-medium">{t('mount.extras')}</p>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={state.wantsGenerator}
                onChange={(e) => dispatch({ type: 'SET_WANTS_GENERATOR', value: e.target.checked })}
              />
              <span>{t('mount.generator')}</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={state.wantsCriticalBackup}
                onChange={(e) => dispatch({ type: 'SET_WANTS_CRITICAL_BACKUP', value: e.target.checked })}
              />
              <span>{t('mount.criticalBackup')}</span>
            </label>
          </div>
        </div>
      </div>
    </StepShell>
  );
}
