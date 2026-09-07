import { normalizeUaPhone, isValidUaPhone } from '../phone';

describe('normalizeUaPhone', () => {
  it('accepts the domestic form and returns the canonical one', () => {
    expect(normalizeUaPhone('0671234567')).toBe('+380671234567');
  });

  it('accepts the way people actually type their own number', () => {
    // Every one of these is the same number written as a human writes it.
    const written = [
      '+38 (067) 123-45-67',
      '+380671234567',
      '380671234567',
      '067 123 45 67',
      '067-123-45-67',
      '  0671234567  ',
      '80671234567',
    ];
    for (const input of written) {
      expect(normalizeUaPhone(input)).toBe('+380671234567');
    }
  });

  it('accepts landlines, not just mobile operator codes', () => {
    // A Lviv city number. Validating against a list of known mobile prefixes
    // would reject this, and it is a perfectly reachable number.
    expect(normalizeUaPhone('032 123 45 67')).toBe('+380321234567');
  });

  it('rejects numbers that are too short or too long', () => {
    expect(normalizeUaPhone('067123456')).toBeNull();
    expect(normalizeUaPhone('06712345678')).toBeNull();
    expect(normalizeUaPhone('+3806712345678')).toBeNull();
  });

  it('rejects other countries', () => {
    expect(normalizeUaPhone('+48123456789')).toBeNull();
    expect(normalizeUaPhone('+1 555 123 4567')).toBeNull();
  });

  it('rejects the free text the field currently allows', () => {
    // This is the actual bug being fixed: the input accepted anything at all.
    expect(normalizeUaPhone('передзвоніть будь ласка')).toBeNull();
    expect(normalizeUaPhone('asdf')).toBeNull();
    expect(normalizeUaPhone('')).toBeNull();
    expect(normalizeUaPhone('   ')).toBeNull();
  });

  it('rejects a misplaced or repeated plus', () => {
    expect(normalizeUaPhone('06+71234567')).toBeNull();
    expect(normalizeUaPhone('++380671234567')).toBeNull();
  });

  it('does not treat a bare digit string of the right length as valid', () => {
    // 10 digits but not starting with 0 — e.g. someone typing a tax ID.
    expect(normalizeUaPhone('1234567890')).toBeNull();
  });
});

describe('isValidUaPhone', () => {
  it('mirrors normalizeUaPhone', () => {
    expect(isValidUaPhone('067 123 45 67')).toBe(true);
    expect(isValidUaPhone('nope')).toBe(false);
  });
});
