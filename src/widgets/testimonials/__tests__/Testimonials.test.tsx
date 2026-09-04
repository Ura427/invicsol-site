import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../../../../messages/uk.json';
import { uk } from '@/shared/lib/content/uk';
import { Testimonials } from '../Testimonials';

describe('Testimonials', () => {
  it('badges every placeholder testimonial so none reads as a real review', () => {
    render(
      <NextIntlClientProvider locale="uk" messages={messages}>
        <Testimonials />
      </NextIntlClientProvider>,
    );

    const placeholderCount = uk.testimonials.filter((item) => item.isPlaceholder).length;
    expect(screen.getAllByText(messages.Testimonials.placeholderBadge)).toHaveLength(
      placeholderCount,
    );
  });
});
