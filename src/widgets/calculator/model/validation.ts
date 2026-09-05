import type { CalculatorState } from './types';

/**
 * Whether the wizard may advance from the given step.
 *
 * Pure and step-indexed so it can be unit-tested without rendering anything, and
 * so the Next button and the submit guard share one definition of "complete"
 * rather than drifting apart.
 *
 * Deliberately lenient on step 5: tariff and desired power feed the payback
 * estimate, which is a nice-to-have. Blocking the whole funnel over an optional
 * figure costs leads, and a lead with a phone number is worth more than a lead
 * with a complete form.
 */
export function canAdvanceFromStep(state: CalculatorState, step: number): boolean {
  switch (step) {
    case 1:
      return state.propertyType !== null;
    case 2:
      return state.solutionType !== null;
    case 3:
      return state.phase !== null && state.monthlyKwh !== null && state.monthlyKwh > 0;
    case 4:
      return state.goals.length > 0;
    case 5:
      return true;
    case 6:
      return state.mountType !== null;
    case 7:
      return (
        state.name.trim().length > 0 &&
        state.phone.trim().length > 0 &&
        state.contactMethod !== null
      );
    default:
      return false;
  }
}

/** Which translation key explains why the current step is blocked. */
export function blockedReasonKey(step: number): 'errors.selectOption' | 'errors.fillFields' {
  return step === 3 || step === 7 ? 'errors.fillFields' : 'errors.selectOption';
}
