import { auth } from '@/auth';
import { isAllowedAdminEmail } from './admin-allowlist';

/**
 * The gate for every admin server action.
 *
 * proxy.ts already applies this allowlist, but it does not cover these: a server
 * action is a directly-callable POST endpoint reached by its own action id, not
 * by navigating to /admin, so the proxy's check never runs for it. Checking only
 * that a session exists — which is what both actions files did — meant any
 * signed-in account could read every lead and delete every project by calling
 * the action directly, straight past the allowlist added in 6e72d0e.
 *
 * Throws rather than returning a flag so a caller cannot forget to branch on it.
 */
export async function requireAdmin(): Promise<void> {
  const session = await auth();

  if (!isAllowedAdminEmail(session?.user?.email)) {
    throw new Error('Unauthorized');
  }
}
