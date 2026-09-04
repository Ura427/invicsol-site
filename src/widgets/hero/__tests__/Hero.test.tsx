import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../../../../messages/uk.json';
import { Hero } from '../Hero';

jest.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe('Hero', () => {
  it('renders the headline with the highlighted word and both CTAs', () => {
    render(
      <NextIntlClientProvider locale="uk" messages={messages}>
        <Hero />
      </NextIntlClientProvider>,
    );

    expect(screen.getByText(messages.Hero.titleHighlight)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: messages.Hero.ctaPrimary })).toHaveAttribute(
      'href',
      '/calculator',
    );
    expect(screen.getByRole('link', { name: messages.Hero.ctaSecondary })).toHaveAttribute(
      'href',
      '/stations',
    );
  });
});
