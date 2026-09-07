import { useTranslations } from 'next-intl';
import type { Dispatch } from 'react';
import type { CalculatorAction, CalculatorState, ContactMethod } from '../model/types';
import { estimatePaybackYears } from '../model/estimatePayback';
import { TextField } from '@/shared/ui/TextField';
import { StepShell } from './StepShell';
import { OptionCard } from './OptionCard';

const CONTACT_METHODS: readonly ContactMethod[] = ['phone', 'viber', 'telegram'];

export function Step7Contact({
  state,
  dispatch,
  fieldErrors = {},
}: {
  state: CalculatorState;
  dispatch: Dispatch<CalculatorAction>;
  /** Set by the wizard on submit — never while the visitor is still typing. */
  fieldErrors?: { name?: string; phone?: string };
}) {
  const t = useTranslations('Calculator');
  const tf = useTranslations('Forms');
  const paybackYears =
    state.tariff && state.desiredPowerKw ? estimatePaybackYears(state.desiredPowerKw, state.tariff) : null;

  return (
    <StepShell step={7} title={t('contact.title')}>
      <div className="space-y-4">
        <p className="text-muted text-xs">{tf('requiredNote')}</p>

        <TextField
          id="calc-name"
          name="name"
          type="text"
          label={t('contact.name')}
          required
          autoComplete="name"
          placeholder={t('contact.namePlaceholder')}
          value={state.name}
          onChange={(e) => dispatch({ type: 'SET_NAME', value: e.target.value })}
          error={fieldErrors.name ?? null}
        />

        <TextField
          id="calc-phone"
          name="phone"
          type="tel"
          label={t('contact.phone')}
          required
          autoComplete="tel"
          inputMode="tel"
          placeholder={t('contact.phonePlaceholder')}
          value={state.phone}
          onChange={(e) => dispatch({ type: 'SET_PHONE', value: e.target.value })}
          error={fieldErrors.phone ?? null}
        />

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
