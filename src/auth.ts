import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authorizeAdmin } from '@/shared/lib/admin-credentials';

/**
 * Single-account auth for the admin panel. There is no public signup route
 * anywhere in this app — the only Admin row is created by hand via
 * scripts/create-admin.ts, run once by the site owner. This file only ever
 * checks a submitted email/password against that one row.
 *
 * JWT session strategy (no database session table): simpler, and this app
 * has exactly one user, so there's no session-revocation-at-scale need that
 * would argue for database sessions instead.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  pages: { signIn: '/admin/login' },
  // Auth.js refuses to trust the request's Host header by default (protects
  // against host-header spoofing in OAuth redirect flows). This app has no
  // OAuth provider and no public signup — only a Credentials check against
  // one row we control — so that attack surface doesn't apply, and without
  // this the admin panel logs UntrustedHost errors under `next start` and
  // on any host Auth.js doesn't auto-recognize (it auto-detects Vercel).
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: authorizeAdmin,
    }),
  ],
});
