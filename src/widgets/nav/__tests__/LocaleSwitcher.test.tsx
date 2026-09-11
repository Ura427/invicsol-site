import { fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { LocaleSwitcher } from '../LocaleSwitcher';
jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(window.location.search),
}));

jest.mock('@/i18n/navigation', () => ({
  usePathname: () => '/projects',
  Link: ({
    href,
    locale,
    children,
  }: {
    href: string;
    locale: string;
    children: React.ReactNode;
  }) => <a href={`/${locale}${href}`}>{children}</a>,
}));

it('preserves repeated filters and anchors, including changes after mounting', () => {
  window.history.replaceState(null, '', '/en/projects?type=house&type=business#gallery');
  render(
    <NextIntlClientProvider locale="en" messages={{}}>
      <LocaleSwitcher />
    </NextIntlClientProvider>,
  );
  expect(screen.getByRole('link', { name: 'UA' })).toHaveAttribute(
    'href',
    '/uk/projects?type=house&type=business#gallery',
  );
  window.history.replaceState(null, '', '/en/projects?mount=roof#results');
  fireEvent.popState(window);
  expect(screen.getByRole('link', { name: 'UA' })).toHaveAttribute(
    'href',
    '/uk/projects?mount=roof#results',
  );
});
