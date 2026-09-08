'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { estimatePaybackYears } from '@/widgets/calculator/model/estimatePayback';

/**
 * Ukraine's regulated household tariff, pre-filled so the figure appears
 * immediately rather than behind an empty input. Someone on a different tariff
 * changes one number; someone who does not know theirs still gets a useful
 * answer.
 */
const DEFAULT_TARIFF_UAH = 4.32;
const PEAK_SUN_HOURS = 4;
const PERFORMANCE_RATIO = 0.8;

interface PaybackCalculatorProps {
  powerKw: number;
  tone?: 'light' | 'dark';
  /** Tightens the figures for a half-width column. */
  compact?: boolean;
}

/**
 * The payback estimate, on the station page, for this station.
 *
 * It replaces a button labelled "Estimate payback" that linked to /calculator —
 * a seven-step wizard whose fifth step asks what size station you want, which is
 * the question this page has already answered. The estimator itself only needs
 * power and tariff, and power is known here, so the whole interaction collapses
 * to one number.
 *
 * It never shows a price. Payback can be estimated honestly from output and
 * tariff; a price cannot, because it turns on roof, mounting and cable runs that
 * only a site visit settles.
 */
export function PaybackCalculator({ powerKw, tone = 'light', compact = false }: PaybackCalculatorProps) {
  const t = useTranslations('Stations.payback');
  const locale = useLocale();
  const [tariff, setTariff] = useState(DEFAULT_TARIFF_UAH);

  const isDark = tone === 'dark';
  const years = estimatePaybackYears(powerKw, tariff);
  const annualKwh = Math.round(powerKw * PEAK_SUN_HOURS * 365 * PERFORMANCE_RATIO);
  const annualSavings = Math.round(annualKwh * tariff);

  const number = (value: number) => new Intl.NumberFormat(locale).format(value);

  const figures = [
    { label: t('annualOutput'), value: `${number(annualKwh)} ${t('kwhPerYear')}` },
    { label: t('annualSaving'), value: `${number(annualSavings)} ₴` },
    { label: t('payback'), value: years > 0 ? t('years', { years }) : '—' },
  ];

  return (
    <div>
      <label className="block">
        <span className={`text-sm font-medium ${isDark ? 'text-white/70' : 'text-muted'}`}>
          {t('tariffLabel')}
        </span>
        <span className="mt-2 flex items-center gap-3">
          <input
            type="number"
            min={0.5}
            max={30}
            step={0.01}
            value={tariff}
            onChange={(event) => setTariff(Number(event.target.value))}
            className={`w-32 rounded-[var(--radius-sm)] border px-3.5 py-2.5 text-base transition-colors sm:text-sm ${
              isDark
                ? 'border-white/25 bg-white/10 text-white'
                : 'border-border bg-elevated text-navy-800'
            }`}
          />
          <span className={`text-sm ${isDark ? 'text-white/60' : 'text-muted'}`}>
            {t('tariffUnit')}
          </span>
        </span>
      </label>

      {/* A 1px gap over a border-coloured parent — the same ruled-grid device
          the rest of the site uses, so this reads as part of the page rather
          than as a widget dropped onto it. */}
      <dl
        className={`grid gap-px ${compact ? 'mt-6 grid-cols-3' : 'mt-7 sm:grid-cols-3'} ${
          isDark ? 'bg-white/15' : 'bg-border'
        }`}
      >
        {figures.map((figure) => (
          <div
            key={figure.label}
            className={`${compact ? 'px-4 py-5' : 'px-5 py-6'} ${isDark ? 'bg-navy-800' : 'bg-paper'}`}
          >
            <dt
              className={`font-medium tracking-[0.12em] uppercase ${compact ? 'text-[10px]' : 'text-xs'} ${
                isDark ? 'text-white/60' : 'text-muted'
              }`}
            >
              {figure.label}
            </dt>
            <dd
              className={`font-light tracking-[-0.03em] ${compact ? 'mt-2 text-xl' : 'mt-2.5 text-3xl'} ${
                isDark ? 'text-gold-400' : 'text-gold-600'
              }`}
            >
              {figure.value}
            </dd>
          </div>
        ))}
      </dl>

      <p className={`mt-4 max-w-[62ch] text-xs leading-relaxed ${isDark ? 'text-white/50' : 'text-muted'}`}>
        {t('disclaimer', { power: powerKw })}
      </p>
    </div>
  );
}
