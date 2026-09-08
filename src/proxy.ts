import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { auth } from './auth';
import { isAllowedAdminEmail } from '@/shared/lib/admin-allowlist';

const intlProxy = createMiddleware(routing);

/**
 * Next 16 renamed `middleware.ts` to `proxy.ts` (same mechanism, new name) and
 * changed its default runtime from Edge to Node.js — which is what makes this
 * combination possible at all. The admin check below calls the real auth()
 * function, which reads the session and, via the Credentials provider, would
 * need the Postgres driver — Node-only. Under the old Edge default this file
 * could only have done a lightweight JWT-cookie check; here it can ask the
 * real thing.
 *
 * /admin is excluded from next-intl entirely (see the matcher below) — it is
 * the one part of this app that is not localized.
 */
export default async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    return handleAdminAuth(request);
  }

  return intlProxy(request);
}

async function handleAdminAuth(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname === '/admin/login';
  const session = await auth();

  // The same allowlist that guards sign-in, re-checked on every request. The
  // sign-in gate alone would leave one hole: a session minted before an address
  // was removed from the list stays valid until its JWT expires, because a JWT
  // session is never re-read from the database. Checking here means removing an
  // address takes effect on the owner's very next request, not days later.
  const isPermitted = session !== null && isAllowedAdminEmail(session.user?.email);

  if (!isPermitted) {
    if (isLoginPage) return NextResponse.next();

    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  if (isLoginPage) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // /api is excluded entirely — NextAuth's own route handler at
  // /api/auth/[...nextauth] is self-contained and doesn't need this proxy to
  // run for it. /admin IS matched (so the auth check above runs for it) but
  // is excluded from next-intl's own locale-prefixing logic inside proxy().
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
