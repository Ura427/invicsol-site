/**
 * Ukrainian phone normalisation.
 *
 * Input is deliberately forgiving and output is deliberately strict: people
 * write their own number the way they say it out loud — "067 123 45 67",
 * "+38 (067) 123-45-67", "380671234567" — and rejecting those loses real
 * leads for no benefit. What matters is that every number that reaches the
 * Telegram notification is in one dialable shape.
 *
 * Landlines are accepted as well as mobiles: a customer may well leave a Lviv
 * city number (032…), and validating against a list of mobile operator codes
 * would reject it. The check is therefore structural — a leading zero, then
 * nine more digits — not a lookup of known prefixes, which would go stale.
 */

const NON_DIGITS = /[^\d+]/g;

/** Canonical form: +380 followed by nine digits. */
export const UA_PHONE_CANONICAL = /^\+380\d{9}$/;

/**
 * Returns the number as `+380XXXXXXXXX`, or null when it cannot be a Ukrainian
 * number. Null is the only failure signal — callers decide what to tell the user.
 */
export function normalizeUaPhone(input: string): string | null {
  if (typeof input !== 'string') return null;

  const cleaned = input.trim().replace(NON_DIGITS, '');
  if (cleaned === '') return null;

  // A "+" is only meaningful in the leading position; "06+7..." is a typo, not a number.
  const plusCount = (cleaned.match(/\+/g) ?? []).length;
  if (plusCount > 1) return null;
  if (plusCount === 1 && !cleaned.startsWith('+')) return null;

  const digits = cleaned.replace(/\+/g, '');

  // 0XXXXXXXXX — the way numbers are written domestically.
  if (/^0\d{9}$/.test(digits)) {
    return `+38${digits}`;
  }

  // 380XXXXXXXXX, with or without the leading plus.
  if (/^380\d{9}$/.test(digits)) {
    return `+${digits}`;
  }

  // 80XXXXXXXXX — the old intercity dialling prefix, still typed out of habit.
  if (/^80\d{9}$/.test(digits)) {
    return `+3${digits}`;
  }

  return null;
}

/** Convenience wrapper for form-level checks. */
export function isValidUaPhone(input: string): boolean {
  return normalizeUaPhone(input) !== null;
}
