export type PropertyType = 'house' | 'business';
export type SolutionType = 'station' | 'storage' | 'both';
export type Phase = '1' | '3';
export type Goal = 'savings' | 'backup' | 'independence' | 'payback' | 'sellExcess';
export type MountType = 'roof' | 'ground';
export type ContactMethod = 'phone' | 'viber' | 'telegram';

export const TOTAL_STEPS = 7;

export interface CalculatorState {
  step: number;
  propertyType: PropertyType | null;
  solutionType: SolutionType | null;
  phase: Phase | null;
  monthlyKwh: number | null;
  useAutoEstimate: boolean;
  goals: readonly Goal[];
  tariff: number | null;
  desiredPowerKw: number | null;
  mountType: MountType | null;
  wantsGenerator: boolean;
  wantsCriticalBackup: boolean;
  name: string;
  phone: string;
  contactMethod: ContactMethod | null;
}

export const initialCalculatorState: CalculatorState = {
  step: 1,
  propertyType: null,
  solutionType: null,
  phase: null,
  monthlyKwh: null,
  useAutoEstimate: false,
  goals: [],
  tariff: null,
  desiredPowerKw: null,
  mountType: null,
  wantsGenerator: false,
  wantsCriticalBackup: false,
  name: '',
  phone: '',
  contactMethod: null,
};

export type CalculatorAction =
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SET_PROPERTY_TYPE'; value: PropertyType }
  | { type: 'SET_SOLUTION_TYPE'; value: SolutionType }
  | { type: 'SET_PHASE'; value: Phase }
  | { type: 'SET_MONTHLY_KWH'; value: number | null }
  | { type: 'SET_USE_AUTO_ESTIMATE'; value: boolean }
  | { type: 'TOGGLE_GOAL'; value: Goal }
  | { type: 'SET_TARIFF'; value: number | null }
  | { type: 'SET_DESIRED_POWER_KW'; value: number | null }
  | { type: 'SET_MOUNT_TYPE'; value: MountType }
  | { type: 'SET_WANTS_GENERATOR'; value: boolean }
  | { type: 'SET_WANTS_CRITICAL_BACKUP'; value: boolean }
  | { type: 'SET_NAME'; value: string }
  | { type: 'SET_PHONE'; value: string }
  | { type: 'SET_CONTACT_METHOD'; value: ContactMethod }
  | { type: 'RESET' };
