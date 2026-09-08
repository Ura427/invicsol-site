import bcrypt from 'bcryptjs';
import { db } from './db';
import { isAllowedAdminEmail } from './admin-allowlist';

/**
 * Kept out of auth.ts so the two gates it applies — the allowlist and the password check —
 * can be tested directly. Inline in the provider config they would only be
 * reachable through a full sign-in round trip, and auth.ts cannot be imported
 * from a test at all — next-auth ships ESM that Jest will not require.
 */
export async function authorizeAdmin(
  credentials: Partial<Record<string, unknown>> | undefined,
): Promise<{ id: string; email: string } | null> {
  const email = credentials?.['email'];
  const password = credentials?.['password'];
  if (typeof email !== 'string' || typeof password !== 'string') return null;

  // Authorization before authentication. A correct password on an address that
  // is not the owner's never mints a session, so an extra Admin row — created
  // by mistake, or restored from a dump — is inert rather than a way in. See
  // shared/lib/admin-allowlist.ts.
  if (!isAllowedAdminEmail(email)) return null;

  const admin = await db.admin.findUnique({ where: { email } });
  if (!admin) return null;

  const isValidPassword = await bcrypt.compare(password, admin.passwordHash);
  if (!isValidPassword) return null;

  return { id: admin.id, email: admin.email };
}

