import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { QueryProvider } from './QueryProvider';
import '../globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Admin | INVICSOL',
  // Never indexed — this is a management area, not a page a search engine or
  // a curious visitor should ever land on.
  robots: { index: false, follow: false },
};

/**
 * Sits outside src/app/[locale]/ — the admin area is not localized, and is a
 * sibling route tree rather than nested under the locale layout. That means it
 * needs its own <html><body>, same as [locale]/layout.tsx does for the public
 * site; only one of the two ever renders per request, since /admin and
 * /uk|/en are disjoint route trees.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-surface min-h-screen antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
