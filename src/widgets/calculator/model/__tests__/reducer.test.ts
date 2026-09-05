import { calculatorReducer } from '../reducer';
import { initialCalculatorState, TOTAL_STEPS, type CalculatorState } from '../types';

describe('calculatorReducer', () => {
  it('does not mutate the state object passed in', () => {
    const before = { ...initialCalculatorState };
    calculatorReducer(initialCalculatorState, { type: 'NEXT_STEP' });
    expect(initialCalculatorState).toEqual(before);
  });

  describe('step navigation', () => {
    it('advances the step on NEXT_STEP', () => {
      const result = calculatorReducer(initialCalculatorState, { type: 'NEXT_STEP' });
      expect(result.step).toBe(2);
    });

    it('does not advance past the last step', () => {
      const atLastStep: CalculatorState = { ...initialCalculatorState, step: TOTAL_STEPS };
      const result = calculatorReducer(atLastStep, { type: 'NEXT_STEP' });
      expect(result.step).toBe(TOTAL_STEPS);
    });

    it('retreats the step on PREV_STEP', () => {
      const atStep3: CalculatorState = { ...initialCalculatorState, step: 3 };
      const result = calculatorReducer(atStep3, { type: 'PREV_STEP' });
      expect(result.step).toBe(2);
    });

    it('does not go below the first step', () => {
      const result = calculatorReducer(initialCalculatorState, { type: 'PREV_STEP' });
      expect(result.step).toBe(1);
    });
  });

  it('sets propertyType on SET_PROPERTY_TYPE', () => {
    const result = calculatorReducer(initialCalculatorState, {
      type: 'SET_PROPERTY_TYPE',
      value: 'business',
    });
    expect(result.propertyType).toBe('business');
  });

  it('sets solutionType on SET_SOLUTION_TYPE', () => {
    const result = calculatorReducer(initialCalculatorState, {
      type: 'SET_SOLUTION_TYPE',
      value: 'both',
    });
    expect(result.solutionType).toBe('both');
  });

  it('sets phase on SET_PHASE', () => {
    const result = calculatorReducer(initialCalculatorState, { type: 'SET_PHASE', value: '3' });
    expect(result.phase).toBe('3');
  });

  it('sets monthlyKwh on SET_MONTHLY_KWH', () => {
    const result = calculatorReducer(initialCalculatorState, {
      type: 'SET_MONTHLY_KWH',
      value: 450,
    });
    expect(result.monthlyKwh).toBe(450);
  });

  describe('SET_USE_AUTO_ESTIMATE', () => {
    it('auto-fills desiredPowerKw from monthlyKwh when enabled', () => {
      const withConsumption: CalculatorState = { ...initialCalculatorState, monthlyKwh: 600 };
      const result = calculatorReducer(withConsumption, {
        type: 'SET_USE_AUTO_ESTIMATE',
        value: true,
      });
      expect(result.useAutoEstimate).toBe(true);
      expect(result.desiredPowerKw).toBe(6.3);
    });

    it('does not touch desiredPowerKw when monthlyKwh is not set yet', () => {
      const result = calculatorReducer(initialCalculatorState, {
        type: 'SET_USE_AUTO_ESTIMATE',
        value: true,
      });
      expect(result.desiredPowerKw).toBeNull();
    });

    it('does not touch desiredPowerKw when disabling auto-estimate', () => {
      const withPower: CalculatorState = { ...initialCalculatorState, desiredPowerKw: 8 };
      const result = calculatorReducer(withPower, {
        type: 'SET_USE_AUTO_ESTIMATE',
        value: false,
      });
      expect(result.desiredPowerKw).toBe(8);
    });
  });

  describe('TOGGLE_GOAL', () => {
    it('adds a goal not yet selected', () => {
      const result = calculatorReducer(initialCalculatorState, {
        type: 'TOGGLE_GOAL',
        value: 'savings',
      });
      expect(result.goals).toEqual(['savings']);
    });

    it('removes a goal already selected', () => {
      const withGoal: CalculatorState = { ...initialCalculatorState, goals: ['savings', 'backup'] };
      const result = calculatorReducer(withGoal, { type: 'TOGGLE_GOAL', value: 'savings' });
      expect(result.goals).toEqual(['backup']);
    });
  });

  describe('SET_MONTHLY_KWH while auto-estimate is on', () => {
    it('recalculates desiredPowerKw when consumption changes', () => {
      // Regression: the estimate used to be computed only when the checkbox was
      // toggled, so editing the kWh figure afterwards left a stale power value.
      const autoOn: CalculatorState = {
        ...initialCalculatorState,
        useAutoEstimate: true,
        monthlyKwh: 600,
        desiredPowerKw: 6.3,
      };
      // daily = 300 / 30 = 10; required = 10 / (4 * 0.8) = 3.125 -> 3.1
      const result = calculatorReducer(autoOn, { type: 'SET_MONTHLY_KWH', value: 300 });
      expect(result.desiredPowerKw).toBe(3.1);
    });

    it('leaves desiredPowerKw alone when auto-estimate is off', () => {
      const manual: CalculatorState = {
        ...initialCalculatorState,
        useAutoEstimate: false,
        desiredPowerKw: 12,
      };
      const result = calculatorReducer(manual, { type: 'SET_MONTHLY_KWH', value: 300 });
      expect(result.desiredPowerKw).toBe(12);
    });

    it('does not attempt an estimate when consumption is cleared', () => {
      const autoOn: CalculatorState = {
        ...initialCalculatorState,
        useAutoEstimate: true,
        monthlyKwh: 600,
        desiredPowerKw: 6.3,
      };
      const result = calculatorReducer(autoOn, { type: 'SET_MONTHLY_KWH', value: null });
      expect(result.monthlyKwh).toBeNull();
      expect(result.desiredPowerKw).toBe(6.3);
    });
  });

  it('sets tariff on SET_TARIFF', () => {
    const result = calculatorReducer(initialCalculatorState, { type: 'SET_TARIFF', value: 4.5 });
    expect(result.tariff).toBe(4.5);
  });

  it('sets desiredPowerKw on SET_DESIRED_POWER_KW', () => {
    const result = calculatorReducer(initialCalculatorState, {
      type: 'SET_DESIRED_POWER_KW',
      value: 10,
    });
    expect(result.desiredPowerKw).toBe(10);
  });

  it('sets mountType on SET_MOUNT_TYPE', () => {
    const result = calculatorReducer(initialCalculatorState, {
      type: 'SET_MOUNT_TYPE',
      value: 'ground',
    });
    expect(result.mountType).toBe('ground');
  });

  it('sets wantsGenerator on SET_WANTS_GENERATOR', () => {
    const result = calculatorReducer(initialCalculatorState, {
      type: 'SET_WANTS_GENERATOR',
      value: true,
    });
    expect(result.wantsGenerator).toBe(true);
  });

  it('sets wantsCriticalBackup on SET_WANTS_CRITICAL_BACKUP', () => {
    const result = calculatorReducer(initialCalculatorState, {
      type: 'SET_WANTS_CRITICAL_BACKUP',
      value: true,
    });
    expect(result.wantsCriticalBackup).toBe(true);
  });

  it('sets name on SET_NAME', () => {
    const result = calculatorReducer(initialCalculatorState, { type: 'SET_NAME', value: 'Олег' });
    expect(result.name).toBe('Олег');
  });

  it('sets phone on SET_PHONE', () => {
    const result = calculatorReducer(initialCalculatorState, {
      type: 'SET_PHONE',
      value: '+380671234567',
    });
    expect(result.phone).toBe('+380671234567');
  });

  it('sets contactMethod on SET_CONTACT_METHOD', () => {
    const result = calculatorReducer(initialCalculatorState, {
      type: 'SET_CONTACT_METHOD',
      value: 'viber',
    });
    expect(result.contactMethod).toBe('viber');
  });

  it('resets to initial state on RESET', () => {
    const dirty: CalculatorState = { ...initialCalculatorState, step: 5, name: 'Test' };
    const result = calculatorReducer(dirty, { type: 'RESET' });
    expect(result).toEqual(initialCalculatorState);
  });
});
