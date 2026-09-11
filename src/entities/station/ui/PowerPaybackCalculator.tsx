'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { PaybackCalculator } from './PaybackCalculator';

const MIN_KW = 3;
const MAX_KW = 100;
const DEFAULT_KW = 10;

/**
 * The bespoke station has no fixed power, so the one input the fixed pages
 * already know is asked here. Rendered as a navy panel — the page's one piece
 * of live data, set apart from the prose around it the way the stats band is —
 * with the input on the left and the figures on the right.
 */
export function PowerPaybackCalculator() {
  const t = useTranslations('Stations');
  const [powerKw, setPowerKw] = useState(DEFAULT_KW);

  const clamp = (value: number) =>
    Number.isFinite(value) ? Math.min(MAX_KW, Math.max(MIN_KW, Math.round(value))) : DEFAULT_KW;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">
      <div>
        <p className="text-gold-400 flex items-center gap-2.5">
          <span className="bg-gold-400 inline-block h-1 w-1 shrink-0" aria-hidden />
          <span className="text-xs font-medium tracking-[0.14em] uppercase">
            {t('customEstimatorEyebrow')}
          </span>
        </p>
        <h2 className="mt-5 text-3xl text-white sm:text-4xl">{t('customEstimatorHeading')}</h2>

        <label className="mt-8 block">
          <span className="text-sm font-medium text-white/70">{t('customCalcPower')}</span>
          <span className="mt-3 flex items-center gap-4">
            <input
              type="range"
              min={MIN_KW}
              max={MAX_KW}
              step={1}
              value={powerKw}
              onChange={(event) => setPowerKw(Number(event.target.value))}
              className="accent-gold-400 h-1.5 w-full cursor-pointer"
              aria-label={t('customCalcPower')}
            />
            <span className="flex shrink-0 items-center gap-2">
              <input
                type="number"
                min={MIN_KW}
                max={MAX_KW}
                step={1}
                value={powerKw}
                onChange={(event) => setPowerKw(clamp(Number(event.target.value)))}
                className="w-20 rounded-[var(--radius-sm)] border border-white/25 bg-white/10 px-3.5 py-2.5 text-base text-white transition-colors sm:text-sm"
              />
              <span className="text-sm text-white/60">{t('kwUnit')}</span>
            </span>
          </span>
        </label>
        <p className="mt-2 text-xs text-white/50">{t('customCalcHint')}</p>
      </div>

      <PaybackCalculator powerKw={powerKw} tone="dark" />
    </div>
  );
}
