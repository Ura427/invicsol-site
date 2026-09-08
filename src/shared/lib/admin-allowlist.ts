/**
 * Who is allowed into /admin, independent of who has a valid password.
 *
 * Authentication and authorization are deliberately two separate gates here.
 * Knowing a correct email/password pair proves you are *an* Admin row; it does
 * not prove you are the site owner. If an extra Admin row is ever created —
 * by a mistaken `npm run admin:create`, a restored database dump, or someone
 * with write access to Postgres — that row still cannot reach the panel unless
 * its address appears below.
 *
 * The list is not a secret (it is one public business address), so it is
 * hardcoded rather than hidden in an env var. ADMIN_ALLOWED_EMAILS overrides
 * it for anyone forking this project, and for adding a second operator later
 * without a code change.
 */
const DEFAULT_ALLOWED_EMAILS = ['urakost427@gmail.com'];

function normalize(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Note this fails *closed*: setting ADMIN_ALLOWED_EMAILS to an empty string
 * locks everyone out rather than falling back to the default, so a misconfigured
 * deployment denies access instead of quietly granting it.
 */
export function allowedAdminEmails(): readonly string[] {
  const configured = process.env['ADMIN_ALLOWED_EMAILS'];
  const source = configured === undefined ? DEFAULT_ALLOWED_EMAILS : configured.split(',');

  return source.map(normalize).filter((email) => email.length > 0);
}

export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  if (typeof email !== 'string') return false;

  return allowedAdminEmails().includes(normalize(email));
}
