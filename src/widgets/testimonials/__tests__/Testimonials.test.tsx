import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../../../../messages/uk.json';
import { uk } from '@/shared/lib/content/uk';
import { Testimonials } from '../Testimonials';

describe('Testimonials', () => {
  it('hides the entire section when only placeholder reviews exist', () => {
    render(
      <NextIntlClientProvider locale="uk" messages={messages}>
        <Testimonials />
      </NextIntlClientProvider>,
    );

    expect(uk.testimonials.every((item) => item.isPlaceholder)).toBe(true);
    expect(
      screen.queryByRole('heading', { name: messages.Testimonials.heading }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(messages.Testimonials.placeholderBadge),
    ).not.toBeInTheDocument();
  });
});
