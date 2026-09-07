import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import Script from 'next/script';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { SITE } from '@/shared/lib/site';
import { buildLocalBusinessJsonLd } from '@/shared/lib/jsonld';
import { Nav } from '@/widgets/nav';
import { Footer } from '@/widgets/footer';
import { FloatingButtons } from '@/widgets/floating-buttons';
import '../globals.css';

const inter = Inter({ subsets: ['latin', 'latin-ext', 'cyrillic'], variable: '--font-inter' });
// A distinctive geometric display face for headings only — body copy stays
// Inter. One deliberate typographic contrast is usually enough to shed a
// "default template" look without redesigning layout; Manrope was picked
// specifically for full Cyrillic + Cyrillic Extended support (verified
// against next/font's own bundled font manifest) alongside a confident,
// slightly technical character that fits a solar/energy brand.
const manrope = Manrope({
  // 300 carries every heading — see the h1,h2,h3 rule in globals.css; this
  // design sets display type light rather than bold. 500 is kept for the few
  // places a heading sits over photography and needs more body to stay legible.
  subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
  weight: ['300', '500'],
  variable: '--font-manrope',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    metadataBase: new URL(SITE.url),
    title: { default: t('defaultTitle'), template: t('titleTemplate') },
    description: t('defaultDescription'),
    alternates: {
      languages: Object.fromEntries(routing.locales.map((l) => [l, `${SITE.url}/${l}`])),
    },
    openGraph: {
      siteName: t('siteName'),
      locale,
      type: 'website',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enables static rendering for this locale's server components.
  setRequestLocale(locale);

  const t = await getTranslations('Nav');
  const localBusinessJsonLd = buildLocalBusinessJsonLd();
  // Analytics are entirely disabled — no script tag at all, not even the
  // shim — when no domain is configured. Same graceful-degradation pattern
  // as the Telegram and Resend integrations: local dev and preview builds
  // never need a Plausible account to run the rest of the site.
  const plausibleDomain = process.env['NEXT_PUBLIC_PLAUSIBLE_DOMAIN'];

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${manrope.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="flex min-h-screen flex-col antialiased">
        {plausibleDomain ? (
          <>
            {/* beforeInteractive scripts must live directly in the root
                layout file per Next's own lint rule — this file plays that
                role (there is no separate app/layout.tsx). Runs before
                hydration so window.plausible safely queues events even if
                the real script below hasn't finished loading yet. */}
            <Script id="plausible-queue" strategy="beforeInteractive">
              {`window.plausible = window.plausible || function () { (window.plausible.q = window.plausible.q || []).push(arguments); };`}
            </Script>
            <Script
              defer
              data-domain={plausibleDomain}
              src="https://plausible.io/js/script.js"
              strategy="afterInteractive"
            />
          </>
        ) : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <NextIntlClientProvider>
          <a href="#main" className="skip-link">
            {t('skipToContent')}
          </a>
          <Nav />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <FloatingButtons />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
