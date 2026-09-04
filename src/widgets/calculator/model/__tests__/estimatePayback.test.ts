import { estimatePaybackYears } from '../estimatePayback';

// Expected values are computed by hand from the documented formula, never by
// re-deriving the same formula the function itself uses.
describe('estimatePaybackYears', () => {
  it('estimates payback for a 5 kW station at 4.5 UAH/kWh, default cost/kW', () => {
    // annualProduction = 5 * 4 * 365 * 0.8 = 5840
    // annualSavings = 5840 * 4.5 = 26280
    // systemCost = 5 * 28000 = 140000
    // payback = 140000 / 26280 = 5.3272... -> 5.3
    expect(estimatePaybackYears(5, 4.5)).toBe(5.3);
  });

  it('estimates payback for a 10 kW station at 4.5 UAH/kWh, default cost/kW', () => {
    // annualProduction = 10 * 4 * 365 * 0.8 = 11680
    // annualSavings = 11680 * 4.5 = 52560
    // systemCost = 10 * 28000 = 280000
    // payback = 280000 / 52560 = 5.3272... -> 5.3
    expect(estimatePaybackYears(10, 4.5)).toBe(5.3);
  });

  it('respects a custom reference cost per kW', () => {
    // annualProduction = 5 * 4 * 365 * 0.8 = 5840
    // annualSavings = 5840 * 5 = 29200
    // systemCost = 5 * 20000 = 100000
    // payback = 100000 / 29200 = 3.4246... -> 3.4
    expect(estimatePaybackYears(5, 5, 20000)).toBe(3.4);
  });

  it('returns 0 when power is 0', () => {
    expect(estimatePaybackYears(0, 4.5)).toBe(0);
  });

  it('returns 0 when tariff is 0', () => {
    expect(estimatePaybackYears(5, 0)).toBe(0);
  });
});
