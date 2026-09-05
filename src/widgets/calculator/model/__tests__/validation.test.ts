import { canAdvanceFromStep, blockedReasonKey } from '../validation';
import { initialCalculatorState, type CalculatorState } from '../types';

function stateWith(overrides: Partial<CalculatorState>): CalculatorState {
  return { ...initialCalculatorState, ...overrides };
}

describe('canAdvanceFromStep', () => {
  it('blocks every gated step on a freshly opened wizard', () => {
    for (const step of [1, 2, 3, 4, 6, 7]) {
      expect(canAdvanceFromStep(initialCalculatorState, step)).toBe(false);
    }
  });

  it('allows step 1 once a property type is chosen', () => {
    expect(canAdvanceFromStep(stateWith({ propertyType: 'house' }), 1)).toBe(true);
  });

  it('allows step 2 once a solution type is chosen', () => {
    expect(canAdvanceFromStep(stateWith({ solutionType: 'both' }), 2)).toBe(true);
  });

  describe('step 3 (phase + consumption)', () => {
    it('blocks when only the phase is set', () => {
      expect(canAdvanceFromStep(stateWith({ phase: '1' }), 3)).toBe(false);
    });

    it('blocks when only consumption is set', () => {
      expect(canAdvanceFromStep(stateWith({ monthlyKwh: 500 }), 3)).toBe(false);
    });

    it('blocks a zero consumption figure', () => {
      expect(canAdvanceFromStep(stateWith({ phase: '1', monthlyKwh: 0 }), 3)).toBe(false);
    });

    it('allows when both are set', () => {
      expect(canAdvanceFromStep(stateWith({ phase: '3', monthlyKwh: 500 }), 3)).toBe(true);
    });
  });

  it('requires at least one goal on step 4', () => {
    expect(canAdvanceFromStep(stateWith({ goals: [] }), 4)).toBe(false);
    expect(canAdvanceFromStep(stateWith({ goals: ['savings'] }), 4)).toBe(true);
  });

  it('never blocks step 5, because tariff and power are optional', () => {
    expect(canAdvanceFromStep(initialCalculatorState, 5)).toBe(true);
  });

  it('requires a mount type on step 6', () => {
    expect(canAdvanceFromStep(stateWith({ mountType: 'roof' }), 6)).toBe(true);
  });

  describe('step 7 (contact details)', () => {
    const complete = { name: 'Олег', phone: '+380671234567', contactMethod: 'phone' } as const;

    it('allows when name, phone and contact method are all present', () => {
      expect(canAdvanceFromStep(stateWith(complete), 7)).toBe(true);
    });

    it('blocks when the contact method is missing', () => {
      expect(canAdvanceFromStep(stateWith({ ...complete, contactMethod: null }), 7)).toBe(false);
    });

    it('blocks whitespace-only input', () => {
      expect(canAdvanceFromStep(stateWith({ ...complete, name: '   ' }), 7)).toBe(false);
      expect(canAdvanceFromStep(stateWith({ ...complete, phone: '  ' }), 7)).toBe(false);
    });
  });

  it('blocks an out-of-range step rather than defaulting to allowed', () => {
    expect(canAdvanceFromStep(initialCalculatorState, 99)).toBe(false);
  });
});

describe('blockedReasonKey', () => {
  it('asks for fields on the two data-entry steps', () => {
    expect(blockedReasonKey(3)).toBe('errors.fillFields');
    expect(blockedReasonKey(7)).toBe('errors.fillFields');
  });

  it('asks for a choice on the selection steps', () => {
    expect(blockedReasonKey(1)).toBe('errors.selectOption');
    expect(blockedReasonKey(4)).toBe('errors.selectOption');
  });
});
