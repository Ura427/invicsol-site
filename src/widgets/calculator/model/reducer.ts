import { estimatePowerFromConsumption } from './estimatePower';
import { initialCalculatorState, TOTAL_STEPS, type CalculatorAction, type CalculatorState } from './types';

/**
 * Pure, independently testable — no DOM, no submission side effect. The wizard
 * component dispatches into this and reads `state.step` to decide which step to
 * render.
 */
export function calculatorReducer(
  state: CalculatorState,
  action: CalculatorAction,
): CalculatorState {
  switch (action.type) {
    case 'NEXT_STEP':
      return { ...state, step: Math.min(state.step + 1, TOTAL_STEPS) };
    case 'PREV_STEP':
      return { ...state, step: Math.max(state.step - 1, 1) };
    case 'SET_PROPERTY_TYPE':
      return { ...state, propertyType: action.value };
    case 'SET_SOLUTION_TYPE':
      return { ...state, solutionType: action.value };
    case 'SET_PHASE':
      return { ...state, phase: action.value };
    case 'SET_MONTHLY_KWH':
      return { ...state, monthlyKwh: action.value };
    case 'SET_USE_AUTO_ESTIMATE': {
      if (!action.value || state.monthlyKwh === null) {
        return { ...state, useAutoEstimate: action.value };
      }
      return {
        ...state,
        useAutoEstimate: action.value,
        desiredPowerKw: estimatePowerFromConsumption(state.monthlyKwh),
      };
    }
    case 'TOGGLE_GOAL': {
      const has = state.goals.includes(action.value);
      return {
        ...state,
        goals: has
          ? state.goals.filter((g) => g !== action.value)
          : [...state.goals, action.value],
      };
    }
    case 'SET_TARIFF':
      return { ...state, tariff: action.value };
    case 'SET_DESIRED_POWER_KW':
      return { ...state, desiredPowerKw: action.value };
    case 'SET_MOUNT_TYPE':
      return { ...state, mountType: action.value };
    case 'SET_WANTS_GENERATOR':
      return { ...state, wantsGenerator: action.value };
    case 'SET_WANTS_CRITICAL_BACKUP':
      return { ...state, wantsCriticalBackup: action.value };
    case 'SET_NAME':
      return { ...state, name: action.value };
    case 'SET_PHONE':
      return { ...state, phone: action.value };
    case 'SET_CONTACT_METHOD':
      return { ...state, contactMethod: action.value };
    case 'RESET':
      return initialCalculatorState;
    default:
      return state;
  }
}
