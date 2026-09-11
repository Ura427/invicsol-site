import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// With no argument the plugin looks for ./src/i18n/request.ts by default.
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  experimental: {
    // A server action's request body is capped at 1MB by default, which is
    // under the size of an ordinary phone photo — the admin's photo upload
    // would have failed on almost every real picture. Raised only as far as the
    // upload actually needs; the action itself rejects anything larger with a
    // message, rather than letting the framework reject it opaquely.
    serverActions: { bodySizeLimit: '12mb' },
  },
  // /services and /stations used to be pages that repeated two homepage
  // sections verbatim; the menu now jumps to those sections and the old
  // addresses follow. The station detail pages (/stations/15kw) are not
  // matched — the sources are exact, not prefixes.
  redirects: async () => [
    { source: '/:locale(uk|en)/services', destination: '/:locale/#services', permanent: true },
    { source: '/:locale(uk|en)/stations', destination: '/:locale/#stations', permanent: true },
    { source: '/services', destination: '/#services', permanent: true },
    { source: '/stations', destination: '/#stations', permanent: true },
  ],
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
  // next-intl's dependency chain ships ESM-only packages that Jest cannot parse
  // unless Next transpiles them first. Found by walking the dependency tree for
  // `"type": "module"`, not by trial and error.
  transpilePackages: [
    'next-intl',
    'use-intl',
    'intl-messageformat',
    'icu-minify',
    'po-parser',
    '@formatjs/fast-memoize',
    '@formatjs/icu-messageformat-parser',
    '@formatjs/icu-skeleton-parser',
    '@formatjs/intl-localematcher',
    '@schummar/icu-type-parser',
  ],
};

export default withNextIntl(nextConfig);
