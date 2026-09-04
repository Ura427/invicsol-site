import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../../../../messages/uk.json';
import { uk } from '@/shared/lib/content/uk';
import { Faq } from '../Faq';

describe('Faq', () => {
  it('shows the first answer expanded by default and others collapsed', () => {
    render(
      <NextIntlClientProvider locale="uk" messages={messages}>
        <Faq />
      </NextIntlClientProvider>,
    );

    expect(screen.getByText(uk.faq[0]!.answer)).toBeInTheDocument();
    expect(screen.queryByText(uk.faq[1]!.answer)).not.toBeInTheDocument();
  });

  it('toggles an answer open and closed on click', async () => {
    const user = userEvent.setup();
    render(
      <NextIntlClientProvider locale="uk" messages={messages}>
        <Faq />
      </NextIntlClientProvider>,
    );

    const secondQuestion = screen.getByText(uk.faq[1]!.question);
    await user.click(secondQuestion);
    expect(screen.getByText(uk.faq[1]!.answer)).toBeInTheDocument();

    await user.click(secondQuestion);
    expect(screen.queryByText(uk.faq[1]!.answer)).not.toBeInTheDocument();
  });
});
