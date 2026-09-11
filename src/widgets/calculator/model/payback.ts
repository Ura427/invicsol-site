import type { ParsedStation } from '@/entities/station/parse';
import type { SolutionType } from './types';

export interface CostReference {
  powerKw: number;
  systemType: 'grid-tied' | 'hybrid';
  equipmentUah: number;
  installMinUah: number;
  installMaxUah: number;
  isPlaceholder: boolean;
}

export interface Range {
  min: number;
  max: number;
}

export interface PaybackInput {
  powerKw: number;
  tariff: number;
  monthlyKwh: number | null;
  selfConsumptionPercent: number;
  solutionType: SolutionType;
  references: readonly CostReference[];
}

export function toCostReferences(stations: readonly ParsedStation[]): CostReference[] {
  return stations.flatMap(({ powerKw, systemType, pricing, commercialIsPlaceholder }) => {
    if (
      powerKw === null ||
      systemType === 'custom' ||
      !pricing ||
      pricing.installMinUah === null ||
      pricing.installMaxUah === null
    )
      return [];
    return [
      {
        powerKw,
        systemType,
        equipmentUah: pricing.equipmentUah,
        installMinUah: pricing.installMinUah,
        installMaxUah: pricing.installMaxUah,
        isPlaceholder: commercialIsPlaceholder,
      },
    ];
  });
}

/** Scenario bounds, not a site-specific forecast. No export income is assumed.
 * Cost references include installation and the equipment in the selected kit
 * type (including its batteries for hybrid kits). Scaling is illustrative.
 */
export function estimatePayback(input: PaybackInput) {
  const {
    powerKw,
    tariff,
    monthlyKwh,
    selfConsumptionPercent,
    solutionType,
    references,
  } = input;
  if (
    solutionType === 'storage' ||
    !Number.isFinite(powerKw) ||
    powerKw <= 0 ||
    !Number.isFinite(tariff) ||
    tariff <= 0 ||
    !Number.isFinite(selfConsumptionPercent) ||
    selfConsumptionPercent < 0 ||
    selfConsumptionPercent > 100 ||
    (monthlyKwh !== null && (!Number.isFinite(monthlyKwh) || monthlyKwh < 0))
  )
    return null;

  const systemType = solutionType === 'both' ? 'hybrid' : 'grid-tied';
  const matching = references.filter(
    (r) =>
      r.systemType === systemType &&
      [r.powerKw, r.equipmentUah, r.installMinUah, r.installMaxUah].every(
        Number.isFinite,
      ) &&
      r.powerKw > 0 &&
      r.equipmentUah > 0 &&
      r.installMinUah >= 0 &&
      r.installMaxUah >= r.installMinUah,
  );
  const annualOutput = { min: powerKw * 900, max: powerKw * 1200 };
  const consumptionCap = monthlyKwh === null ? Infinity : monthlyKwh * 12;
  const share = selfConsumptionPercent / 100;
  const annualSavings = {
    min: Math.min(annualOutput.min * share, consumptionCap) * tariff,
    max: Math.min(annualOutput.max * share, consumptionCap) * tariff,
  };
  const installedCost = matching.length
    ? {
        min:
          Math.min(
            ...matching.map((r) => (r.equipmentUah + r.installMinUah) / r.powerKw),
          ) * powerKw,
        max:
          Math.max(
            ...matching.map((r) => (r.equipmentUah + r.installMaxUah) / r.powerKw),
          ) * powerKw,
      }
    : null;
  // Round outwards to whole years rather than implying decimal precision.
  const years =
    installedCost && annualSavings.min > 0
      ? {
          min: Math.max(1, Math.floor(installedCost.min / annualSavings.max)),
          max: Math.max(1, Math.ceil(installedCost.max / annualSavings.min)),
        }
      : null;
  if (
    ![
      annualOutput.min,
      annualOutput.max,
      annualSavings.min,
      annualSavings.max,
      ...(years ? [years.min, years.max] : []),
    ].every(Number.isFinite)
  )
    return null;
  return {
    annualOutput,
    annualSavings,
    years,
    systemType,
    isIllustrative:
      monthlyKwh === null ||
      matching.length === 0 ||
      matching.some((r) => r.isPlaceholder || r.powerKw !== powerKw),
  };
}
