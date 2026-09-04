import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// With no argument the plugin looks for ./src/i18n/request.ts by default.
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
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
