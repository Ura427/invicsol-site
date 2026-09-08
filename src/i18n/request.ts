import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale, locale }) => {
  // `locale` is set when a caller names one explicitly — getTranslations({ locale })
  // — and `requestLocale` is what the routing segment resolved to. The explicit
  // one has to win, and has to be checked first: /admin sits outside the [locale]
  // segment entirely, so requestLocale is undefined there and everything the
  // admin renders would otherwise silently collapse to the default locale no
  // matter which language it asked for.
  const requested = locale ?? (await requestLocale);
  const resolved = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale: resolved,
    messages: (await import(`../../messages/${resolved}.json`)).default,
  };
});
