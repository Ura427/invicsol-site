/**
 * Estimates the solar array power (kW) needed to cover a given monthly
 * consumption, for the "I don't know my required power" fallback in step 3.
 *
 * daily = monthlyKwh / 30
 * requiredKw = daily / (peakSunHours * systemEfficiency)
 *
 * `peakSunHours` and `systemEfficiency` default to conservative Lviv-region
 * values (4 peak-sun-equivalent hours/day, 80% system efficiency after wiring,
 * inverter, and temperature losses) but are parameters so the test file can
 * hand-derive expected values independently of this formula.
 */
export function estimatePowerFromConsumption(
  monthlyKwh: number,
  peakSunHours = 4,
  systemEfficiency = 0.8,
): number {
  const dailyKwh = monthlyKwh / 30;
  const requiredKw = dailyKwh / (peakSunHours * systemEfficiency);
  return Math.round(requiredKw * 10) / 10;
}
