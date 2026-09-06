'use client';

import { useReducer, useState, type FormEvent } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { calculatorReducer } from './model/reducer';
import { initialCalculatorState, TOTAL_STEPS } from './model/types';
import { canAdvanceFromStep, blockedReasonKey } from './model/validation';
import { submitLead } from '@/entities/lead/actions';
import { trackEvent } from '@/shared/lib/analytics';
import { Button } from '@/shared/ui/Button';
import { Step1PropertyType } from './ui/Step1PropertyType';
import { Step2SolutionType } from './ui/Step2SolutionType';
import { Step3Consumption } from './ui/Step3Consumption';
import { Step4Goals } from './ui/Step4Goals';
import { Step5Parameters } from './ui/Step5Parameters';
import { Step6Mount } from './ui/Step6Mount';
import { Step7Contact } from './ui/Step7Contact';

const STEP_COMPONENTS = [
  Step1PropertyType,
  Step2SolutionType,
  Step3Consumption,
  Step4Goals,
  Step5Parameters,
  Step6Mount,
  Step7Contact,
] as const;

export function CalculatorWizard() {
  const t = useTranslations('Calculator');
  const locale = useLocale();
  const router = useRouter();
  const [state, dispatch] = useReducer(calculatorReducer, initialCalculatorState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const StepComponent = STEP_COMPONENTS[state.step - 1]!;
  const isLastStep = state.step === TOTAL_STEPS;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Guard every step, not just the last one. Previously the wizard let you click
    // straight through all seven steps without answering anything, and then did
    // nothing at all on submit if no contact method was picked — a dead button
    // with no explanation.
    if (!canAdvanceFromStep(state, state.step)) {
      setError(t(blockedReasonKey(state.step)));
      return;
    }

    if (!isLastStep) {
      setError(null);
      dispatch({ type: 'NEXT_STEP' });
      return;
    }

    // Narrowing for TypeScript; canAdvanceFromStep already guarantees this on step 7.
    if (!state.contactMethod) return;

    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const result = await submitLead({
      source: 'calculator',
      name: state.name,
      phone: state.phone,
      contactMethod: state.contactMethod,
      locale,
      website: String(formData.get('website') ?? ''),
      extra: {
        propertyType: state.propertyType,
        solutionType: state.solutionType,
        phase: state.phase,
        monthlyKwh: state.monthlyKwh,
        goals: state.goals,
        tariff: state.tariff,
        desiredPowerKw: state.desiredPowerKw,
        mountType: state.mountType,
        wantsGenerator: state.wantsGenerator,
        wantsCriticalBackup: state.wantsCriticalBackup,
      },
    });

    setIsSubmitting(false);

    if (!result.ok) {
      setError(t('errors.submitFailed'));
      return;
    }

    trackEvent('Lead', { source: 'calculator' });
    router.push('/thank-you');
  }

  return (
    <div className="mx-auto max-w-xl">
      <form onSubmit={handleSubmit} className="relative">
        <StepComponent state={state} dispatch={dispatch} />

        <p className="mt-4 text-sm text-red-600" role="alert" aria-live="polite">
          {error}
        </p>

        <div className="mt-8 flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => dispatch({ type: 'PREV_STEP' })}
            disabled={state.step === 1}
            className={state.step === 1 ? 'invisible' : ''}
          >
            {t('back')}
          </Button>

          <Button type="submit" variant="gold" disabled={isSubmitting}>
            {isLastStep ? (isSubmitting ? t('submitting') : t('submit')) : t('next')}
          </Button>
        </div>
      </form>
    </div>
  );
}
