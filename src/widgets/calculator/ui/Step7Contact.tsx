import { useTranslations } from 'next-intl';
import type { Dispatch } from 'react';
import type { CalculatorAction, CalculatorState, ContactMethod } from '../model/types';
import { estimatePaybackYears } from '../model/estimatePayback';
import { StepShell } from './StepShell';
import { OptionCard } from './OptionCard';

const CONTACT_METHODS: readonly ContactMethod[] = ['phone', 'viber', 'telegram'];

export function Step7Contact({
  state,
  dispatch,
}: {
  state: CalculatorState;
  dispatch: Dispatch<CalculatorAction>;
}) {
  const t = useTranslations('Calculator');
  const paybackYears =
    state.tariff && state.desiredPowerKw ? estimatePaybackYears(state.desiredPowerKw, state.tariff) : null;

  return (
    <StepShell step={7} title={t('contact.title')}>
      <div className="space-y-4">
        <label className="block text-sm">
          <span className="text-muted font-medium">{t('contact.name')}</span>
          <input
            type="text"
            name="name"
            required
            placeholder={t('contact.namePlaceholder')}
            className="border-border mt-1 w-full rounded-lg border px-3 py-2"
            value={state.name}
            onChange={(e) => dispatch({ type: 'SET_NAME', value: e.target.value })}
          />
        </label>

        <label className="block text-sm">
          <span className="text-muted font-medium">{t('contact.phone')}</span>
          <input
            type="tel"
            name="phone"
            required
            placeholder={t('contact.phonePlaceholder')}
            className="border-border mt-1 w-full rounded-lg border px-3 py-2"
            value={state.phone}
            onChange={(e) => dispatch({ type: 'SET_PHONE', value: e.target.value })}
          />
        </label>

        <div>
          <p className="text-muted mb-2 text-sm font-medium">{t('contact.contactMethod')}</p>
          <div className="grid grid-cols-3 gap-3">
            {CONTACT_METHODS.map((method) => (
              <OptionCard
                key={method}
                label={t(`contact.method${method[0]!.toUpperCase()}${method.slice(1)}`)}
                isSelected={state.contactMethod === method}
                onClick={() => dispatch({ type: 'SET_CONTACT_METHOD', value: method })}
              />
            ))}
          </div>
        </div>

        {/* Honeypot: hidden from real visitors, filled in by naive bots. */}
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label htmlFor="calc-website">Website</label>
          <input type="text" id="calc-website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        {paybackYears !== null ? (
          <p className="text-navy-800 bg-gold-500/10 rounded-lg p-3 text-sm font-semibold">
            {t('paybackEstimate', { years: paybackYears })}
          </p>
        ) : null}

        <p className="text-muted text-xs leading-relaxed">{t('noPriceNotice')}</p>
      </div>
    </StepShell>
  );
}
