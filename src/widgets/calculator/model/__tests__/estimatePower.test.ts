import { estimatePowerFromConsumption } from '../estimatePower';

// Every expected value below is computed by hand from the stated formula,
// independently of the function under test — never by re-running the same
// formula, which could only prove the function agrees with itself.
describe('estimatePowerFromConsumption', () => {
  it('estimates power for 600 kWh/month at defaults (4 sun hours, 0.8 efficiency)', () => {
    // daily = 600 / 30 = 20
    // required = 20 / (4 * 0.8) = 20 / 3.2 = 6.25 -> rounded to 6.3
    expect(estimatePowerFromConsumption(600)).toBe(6.3);
  });

  it('estimates power for 300 kWh/month at defaults', () => {
    // daily = 300 / 30 = 10
    // required = 10 / 3.2 = 3.125 -> rounded to 3.1
    expect(estimatePowerFromConsumption(300)).toBe(3.1);
  });

  it('estimates power for 900 kWh/month with 5 sun hours and 0.75 efficiency', () => {
    // daily = 900 / 30 = 30
    // required = 30 / (5 * 0.75) = 30 / 3.75 = 8 -> 8
    expect(estimatePowerFromConsumption(900, 5, 0.75)).toBe(8);
  });

  it('returns 0 for 0 kWh/month', () => {
    expect(estimatePowerFromConsumption(0)).toBe(0);
  });

  it('rounds to one decimal place', () => {
    // daily = 450 / 30 = 15
    // required = 15 / 3.2 = 4.6875 -> rounds to 4.7
    expect(estimatePowerFromConsumption(450)).toBe(4.7);
  });
});
