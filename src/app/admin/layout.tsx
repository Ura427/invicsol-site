import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { QueryProvider } from './QueryProvider';
import { getAdminLocale } from '@/shared/lib/admin-locale';
import '../globals.css';

const inter = Inter({ subsets: ['latin', 'latin-ext', 'cyrillic'], variable: '--font-inter' });

// Manrope is loaded here as well as on the public site, not only there. globals.css
// is shared, so its `h1,h2,h3` rule already asks for var(--font-display) in every
// admin heading — but without this the variable resolved to nothing and the whole
// admin silently fell back to Inter at weight 300 with display tracking, which is
// a combination nobody chose. Same weights and subsets as [locale]/layout.tsx so
// the two trees render identical type.
const manrope = Manrope({
  subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
  weight: ['300', '500'],
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: 'Admin | INVICSOL',
  robots: { index: false, follow: false },
};

/**
 * Sits outside src/app/[locale]/ — the admin *route* is not localized, and is a
 * sibling route tree rather than nested under the locale layout. That means it
 * needs its own <html><body>, same as [locale]/layout.tsx does for the public
 * site; only one of the two ever renders per request, since /admin and
 * /uk|/en are disjoint route trees.
 *
 * The admin *interface* is localized even though its URL is not. The locale
 * comes from a cookie rather than a path segment, which keeps /admin/... free of
 * a /uk or /en prefix — proxy.ts short-circuits on that exact prefix to run the
 * auth gate before next-intl, and moving the admin under [locale] would put the
 * whole panel behind locale negotiation for no benefit to a single-operator tool.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const locale = await getAdminLocale();
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className={`${inter.variable} ${manrope.variable}`}>
      {/* bg-paper, matching the public site's canvas. It was bg-surface, which is
          the deepest tone in the scale — correct for a recessed panel, wrong for
          a page background, and the reason the admin read as a different product
          before you noticed anything else about it. */}
      <body className="bg-paper min-h-screen antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <QueryProvider>{children}</QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
