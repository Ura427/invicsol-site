'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { CostReference } from '@/widgets/calculator/model/payback';
import type { SolutionType } from '@/widgets/calculator/model/types';
import { PaybackSummary } from '@/widgets/calculator/ui/PaybackSummary';

export function PaybackCalculator({
  powerKw,
  tone = 'light',
  references = [],
  systemType,
}: {
  powerKw: number;
  tone?: 'light' | 'dark';
  references?: readonly CostReference[];
  systemType?: 'grid-tied' | 'hybrid';
}) {
  const t = useTranslations('Stations.payback');
  const [tariff, setTariff] = useState('4.32');
  const [consumption, setConsumption] = useState('');
  const [share, setShare] = useState('50');
  const [solution, setSolution] = useState<SolutionType>('station');
  const solutionType = systemType
    ? systemType === 'hybrid'
      ? 'both'
      : 'station'
    : solution;
  const dark = tone === 'dark';
  const fieldClass =
    'mt-2 block w-full rounded-[var(--radius-sm)] border px-3 py-2.5 text-base ' +
    (dark
      ? 'border-white/25 bg-navy-800 text-white'
      : 'border-border bg-elevated text-navy-800');
  const fields = [
    { label: t('tariffLabel'), value: tariff, set: setTariff, min: 0.01, step: 0.01 },
    {
      label: t('monthlyConsumption'),
      value: consumption,
      set: setConsumption,
      min: 0,
      step: 1,
    },
    {
      label: t('selfConsumption'),
      value: share,
      set: setShare,
      min: 0,
      max: 100,
      step: 1,
    },
  ];
  return (
    <div>
      {!systemType ? (
        <label
          className={'mb-5 block text-sm ' + (dark ? 'text-white/80' : 'text-muted')}
        >
          {t('systemType')}
          <select
            className={fieldClass}
            value={solution}
            onChange={(event) =>
              setSolution(event.target.value === 'both' ? 'both' : 'station')
            }
          >
            <option value="station">{t('gridTied')}</option>
            <option value="both">{t('hybrid')}</option>
          </select>
        </label>
      ) : null}
      <div className="grid items-end gap-4 sm:grid-cols-3">
        {fields.map((field) => (
          <label
            key={field.label}
            className={'block text-sm ' + (dark ? 'text-white/80' : 'text-muted')}
          >
            {field.label}
            <input
              type="number"
              min={field.min}
              max={field.max}
              step={field.step}
              value={field.value}
              onChange={(event) => field.set(event.target.value)}
              className={fieldClass}
            />
          </label>
        ))}
      </div>
      <PaybackSummary
        tone={tone}
        input={{
          powerKw,
          tariff: Number(tariff),
          monthlyKwh: consumption === '' ? null : Number(consumption),
          selfConsumptionPercent: share === '' ? NaN : Number(share),
          solutionType,
          references,
        }}
      />
    </div>
  );
}
