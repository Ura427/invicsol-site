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
