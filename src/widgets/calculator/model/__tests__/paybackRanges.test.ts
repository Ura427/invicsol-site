import { estimatePayback, type CostReference } from '../payback';

const references: CostReference[] = [
  {
    powerKw: 5,
    systemType: 'grid-tied',
    equipmentUah: 100000,
    installMinUah: 20000,
    installMaxUah: 40000,
    isPlaceholder: false,
  },
  {
    powerKw: 5,
    systemType: 'hybrid',
    equipmentUah: 180000,
    installMinUah: 20000,
    installMaxUah: 40000,
    isPlaceholder: true,
  },
];
const input = {
  powerKw: 5,
  tariff: 5,
  monthlyKwh: 100,
  selfConsumptionPercent: 50,
  solutionType: 'station' as const,
  references,
};

it('caps savings at annual consumption and uses installed cost bounds', () => {
  const result = estimatePayback(input)!;
  expect(result.annualSavings).toEqual({ min: 6000, max: 6000 });
  expect(result.years).toEqual({ min: 20, max: 24 });
  expect(result.isIllustrative).toBe(false);
});
it('makes oversizing pay back slower for the same consumption', () => {
  expect(estimatePayback({ ...input, powerKw: 10 })!.years!.min).toBeGreaterThan(
    estimatePayback(input)!.years!.min,
  );
});
it('uses the hybrid battery-inclusive kit costs instead of grid costs', () => {
  const result = estimatePayback({ ...input, solutionType: 'both' })!;
  expect(result.years).toEqual({ min: 33, max: 37 });
  expect(result.isIllustrative).toBe(true);
});
it('marks a missing consumption estimate illustrative', () => {
  const result = estimatePayback({ ...input, monthlyKwh: null })!;
  expect(result.isIllustrative).toBe(true);
  expect(result.annualSavings).toEqual({ min: 11250, max: 15000 });
});
it('does not invent payback when matching cost data is unavailable', () => {
  expect(estimatePayback({ ...input, references: [] })!.years).toBeNull();
});
it('does not assign solar output or payback to backup-only storage', () => {
  expect(estimatePayback({ ...input, solutionType: 'storage' })).toBeNull();
});
it('honors self-consumption and avoids infinite payback for zero savings', () => {
  expect(estimatePayback({ ...input, selfConsumptionPercent: 0 })!.years).toBeNull();
  expect(estimatePayback({ ...input, monthlyKwh: 0 })!.years).toBeNull();
  expect(
    estimatePayback({ ...input, monthlyKwh: 1000, selfConsumptionPercent: 25 })!
      .annualSavings,
  ).toEqual({ min: 5625, max: 7500 });
});
it.each([NaN, Infinity, -1, 0])('rejects invalid power %s', (powerKw) => {
  expect(estimatePayback({ ...input, powerKw })).toBeNull();
});
it('rejects finite inputs whose derived figures overflow', () => {
  expect(estimatePayback({ ...input, powerKw: Number.MAX_VALUE })).toBeNull();
});
