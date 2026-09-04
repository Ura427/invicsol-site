import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../../../../messages/uk.json';
import { uk } from '@/shared/lib/content/uk';
import { WhyUs } from '../WhyUs';

describe('WhyUs', () => {
  it('renders the section heading and one card per why-item', () => {
    render(
      <NextIntlClientProvider locale="uk" messages={messages}>
        <WhyUs />
      </NextIntlClientProvider>,
    );

    expect(screen.getByRole('heading', { name: messages.WhyUs.heading })).toBeInTheDocument();
    for (const card of uk.why) {
      expect(screen.getByText(card.title)).toBeInTheDocument();
    }
  });
});
