/**
 * Typed, per-locale editorial content.
 *
 * This is deliberately NOT the same system as `messages/*.json`:
 *
 * - `messages/*.json` (next-intl) holds short, flat UI strings — button labels,
 *   nav items, form errors, headline fragments.
 * - This module holds *repeating structured content that never changes shape* —
 *   cards, steps, stats, testimonials, FAQ entries. Flattening those into JSON
 *   produces keys like `why_card_1_title` and loses all type safety.
 *
 * Each locale file ends with `satisfies SiteContent`, so a locale missing a field
 * is a compile error rather than a blank space on the live page.
 *
 * Content here is fixed and non-filterable, which is exactly why it does not live
 * in the database — there is nothing to filter or paginate, and a database round
 * trip cannot buy compile-time locale completeness.
 */

/** Locale-neutral icon identifier, resolved to a lucide component at render time. */
export type IconName =
  | 'ShieldCheck'
  | 'Zap'
  | 'Wrench'
  | 'PiggyBank'
  | 'Sun'
  | 'BatteryCharging'
  | 'PlugZap'
  | 'LineChart'
  | 'HardHat'
  | 'FileCheck2'
  | 'Headset'
  | 'Building2';

export interface WhyCard {
  readonly id: string;
  readonly icon: IconName;
  readonly title: string;
  readonly text: string;
}

export interface ServiceItem {
  readonly id: string;
  readonly icon: IconName;
  readonly title: string;
  readonly text: string;
}

export interface ProcessStep {
  readonly id: string;
  readonly title: string;
  readonly text: string;
}

export interface StatItem {
  readonly id: string;
  readonly value: string;
  readonly label: string;
}

export interface ExpertiseCard {
  readonly id: string;
  readonly title: string;
  readonly text: string;
}

export interface Testimonial {
  readonly id: string;
  readonly author: string;
  readonly role: string;
  readonly text: string;
  /**
   * LAUNCH BLOCKER. Invented reviews attributed to named people are deceptive if
   * shown to a real visitor. Anything flagged here is filtered out of production
   * rendering by `visibleTestimonials()` and must be replaced with real, consented
   * reviews before go-live.
   */
  readonly isPlaceholder: boolean;
}

export interface FaqItem {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
}

export interface EquipmentBrand {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly note: string;
}

export interface TeamMember {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly bio: string;
  readonly isPlaceholder: boolean;
}

export interface WarrantyItem {
  readonly id: string;
  readonly years: number;
  readonly title: string;
  readonly text: string;
}

export interface FinancingOption {
  readonly id: string;
  readonly icon: IconName;
  readonly provider: string;
  readonly terms: string;
  readonly note: string;
  readonly isPlaceholder: boolean;
}

export interface PullQuote {
  readonly text: string;
  readonly author: string;
  readonly authorRole: string;
}

export interface ContactDetails {
  readonly phone: string;
  readonly phoneDisplay: string;
  readonly email: string;
  readonly address: string;
  readonly hours: string;
  readonly telegram: string;
  readonly viber: string;
  readonly mapEmbedUrl: string;
}

export interface SiteContent {
  readonly why: readonly WhyCard[];
  readonly services: readonly ServiceItem[];
  readonly process: readonly ProcessStep[];
  readonly stats: readonly StatItem[];
  readonly expertise: readonly ExpertiseCard[];
  readonly testimonials: readonly Testimonial[];
  readonly faq: readonly FaqItem[];
  readonly brands: readonly EquipmentBrand[];
  readonly team: readonly TeamMember[];
  readonly warranty: readonly WarrantyItem[];
  readonly financing: readonly FinancingOption[];
  readonly quote: PullQuote;
  readonly contact: ContactDetails;
}
