import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { db } from '@/shared/lib/db';

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
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.['email'];
        const password = credentials?.['password'];
        if (typeof email !== 'string' || typeof password !== 'string') return null;

        const admin = await db.admin.findUnique({ where: { email } });
        if (!admin) return null;

        const isValidPassword = await bcrypt.compare(password, admin.passwordHash);
        if (!isValidPassword) return null;

        return { id: admin.id, email: admin.email };
      },
    }),
  ],
});
