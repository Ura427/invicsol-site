import { allowedAdminEmails, isAllowedAdminEmail } from '../admin-allowlist';

describe('isAllowedAdminEmail', () => {
  const original = process.env['ADMIN_ALLOWED_EMAILS'];

  afterEach(() => {
    if (original === undefined) delete process.env['ADMIN_ALLOWED_EMAILS'];
    else process.env['ADMIN_ALLOWED_EMAILS'] = original;
  });

  it('permits the owner by default', () => {
    delete process.env['ADMIN_ALLOWED_EMAILS'];

    expect(isAllowedAdminEmail('urakost427@gmail.com')).toBe(true);
  });

  it('refuses any other address', () => {
    delete process.env['ADMIN_ALLOWED_EMAILS'];

    expect(isAllowedAdminEmail('someone@example.com')).toBe(false);
    expect(isAllowedAdminEmail('admin@invicsol.com.ua')).toBe(false);
  });

  // Addresses arrive from a form and from a JWT, so casing and stray padding
  // are both plausible and neither should matter.
  it('ignores case and surrounding whitespace', () => {
    delete process.env['ADMIN_ALLOWED_EMAILS'];

    expect(isAllowedAdminEmail('  UraKost427@Gmail.com ')).toBe(true);
  });

  it('refuses a missing address rather than throwing', () => {
    expect(isAllowedAdminEmail(null)).toBe(false);
    expect(isAllowedAdminEmail(undefined)).toBe(false);
    expect(isAllowedAdminEmail('')).toBe(false);
  });

  it('reads the override when one is set', () => {
    process.env['ADMIN_ALLOWED_EMAILS'] = 'a@example.com, B@Example.com';

    expect(allowedAdminEmails()).toEqual(['a@example.com', 'b@example.com']);
    expect(isAllowedAdminEmail('b@example.com')).toBe(true);
    expect(isAllowedAdminEmail('urakost427@gmail.com')).toBe(false);
  });

  // Fail closed: a blank override is a misconfiguration, and denying everyone
  // is the safe reading of it.
  it('locks everyone out when the override is empty', () => {
    process.env['ADMIN_ALLOWED_EMAILS'] = '';

    expect(allowedAdminEmails()).toEqual([]);
    expect(isAllowedAdminEmail('urakost427@gmail.com')).toBe(false);
  });
});
