/**
 * Estimates a payback period in years — the honest substitute for a price
 * calculator (see project brief: real installation pricing depends on
 * site-visit-only variables, so we never output a price). Payback CAN be
 * estimated reasonably from consumption, tariff, and system size, because the
 * two things that matter — annual output and annual savings — don't depend on
 * the roof/mount/cable-run details that make a firm price dishonest.
 *
 * annualProductionKwh = powerKw * peakSunHours * 365 * performanceRatio
 * annualSavingsUah    = annualProductionKwh * tariffUahPerKwh
 * systemCostUah        = powerKw * referenceCostPerKwUah
 * paybackYears          = systemCostUah / annualSavingsUah
 *
 * `referenceCostPerKwUah` is an internal reference figure used only to compute
 * the payback ratio — it is never surfaced to the visitor as a price, and the
 * UI must never render it directly (only the resulting year count).
 */
export function estimatePaybackYears(
  powerKw: number,
  tariffUahPerKwh: number,
  referenceCostPerKwUah = 28000,
  peakSunHours = 4,
  performanceRatio = 0.8,
): number {
  if (powerKw <= 0 || tariffUahPerKwh <= 0) return 0;

  const annualProductionKwh = powerKw * peakSunHours * 365 * performanceRatio;
  const annualSavingsUah = annualProductionKwh * tariffUahPerKwh;
  const systemCostUah = powerKw * referenceCostPerKwUah;
  const paybackYears = systemCostUah / annualSavingsUah;

  return Math.round(paybackYears * 10) / 10;
}
