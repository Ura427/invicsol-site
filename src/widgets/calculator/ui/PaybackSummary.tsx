import { useLocale, useTranslations } from 'next-intl';
import { estimatePayback, type PaybackInput, type Range } from '../model/payback';

export function PaybackSummary({
  input,
  tone = 'light',
}: {
  input: PaybackInput;
  tone?: 'light' | 'dark';
}) {
  const t = useTranslations('Stations.payback');
  const locale = useLocale();
  const result = estimatePayback(input);
  const dark = tone === 'dark';
  const muted = dark ? 'text-white/70' : 'text-muted';
  const format = (value: number) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value);
  const range = ({ min, max }: Range) =>
    min === max ? format(min) : `${format(min)}–${format(max)}`;
  if (!result)
    return (
      <p className={`mt-4 text-sm ${muted}`} role="status">
        {t(input.solutionType === 'storage' ? 'backupOnly' : 'invalidInputs')}
      </p>
    );
  const figures = [
    {
      label: t('annualOutput'),
      value: `${range(result.annualOutput)} ${t('kwhPerYear')}`,
    },
    { label: t('annualSaving'), value: `${range(result.annualSavings)} ₴` },
    {
      label: t('payback'),
      value: result.years ? t('years', { years: range(result.years) }) : '—',
    },
  ];
  return (
    <div className="mt-6">
      <p className={`text-sm font-medium ${dark ? 'text-gold-400' : 'text-gold-700'}`}>
        {t(result.isIllustrative ? 'illustrative' : 'scenario')}
      </p>
      <dl
        className={`mt-3 grid gap-4 border-y py-5 sm:grid-cols-3 ${dark ? 'border-white/20' : 'border-border'}`}
        aria-live="polite"
        aria-atomic="true"
      >
        {figures.map(({ label, value }) => (
          <div key={label} className="min-w-0">
            <dt className={`text-xs ${muted}`}>{label}</dt>
            <dd
              className={`mt-2 break-words text-xl tabular-nums ${dark ? 'text-gold-400' : 'text-navy-800'}`}
            >
              {value}
            </dd>
          </div>
        ))}
      </dl>
      {/* Closed by default: the label above the figures already says whether
          this is a scenario, and five sentences of caveats under three numbers
          was most of the block. */}
      <details className={`mt-4 text-xs leading-relaxed ${muted}`}>
        <summary className="cursor-pointer font-medium">{t('assumptions')}</summary>
        <p className="mt-2">
          {t('energyAssumptions', { share: input.selfConsumptionPercent })}
        </p>
        <p className="mt-2">
          {t(input.monthlyKwh === null ? 'missingConsumption' : 'consumptionCap', {
            monthly: format(input.monthlyKwh ?? 0),
          })}
        </p>
        <p className="mt-2">
          {t(result.systemType === 'hybrid' ? 'hybridCosts' : 'gridCosts')}
        </p>
        {input.references.some(
          (r) => r.systemType === result.systemType && r.isPlaceholder,
        ) ? (
          <p className="mt-2">{t('exampleCosts')}</p>
        ) : null}
        {!result.years ? <p className="mt-2">{t('noPayback')}</p> : null}
        <p className="mt-2">{t('exclusions')}</p>
      </details>
    </div>
  );
}
