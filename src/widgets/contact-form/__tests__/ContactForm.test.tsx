import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../../../../messages/uk.json';
import { ContactForm } from '../ContactForm';

const pushMock = jest.fn();
const submitLeadMock = jest.fn();

jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

jest.mock('@/entities/lead/actions', () => ({
  submitLead: (...args: unknown[]) => submitLeadMock(...args),
}));

function renderForm() {
  return render(
    <NextIntlClientProvider locale="uk" messages={messages}>
      <ContactForm />
    </NextIntlClientProvider>,
  );
}

describe('ContactForm', () => {
  beforeEach(() => {
    pushMock.mockClear();
    submitLeadMock.mockClear();
  });

  it('submits the entered values and redirects to /thank-you on success', async () => {
    submitLeadMock.mockResolvedValue({ ok: true });
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(messages.ContactForm.name), 'Олена');
    await user.type(screen.getByLabelText(messages.ContactForm.phone), '+380671234567');
    await user.click(screen.getByRole('button', { name: messages.ContactForm.submit }));

    expect(submitLeadMock).toHaveBeenCalledWith(
      expect.objectContaining({
        source: 'contact',
        name: 'Олена',
        phone: '+380671234567',
        website: '',
      }),
    );
    expect(pushMock).toHaveBeenCalledWith('/thank-you');
  });

  it('shows an error and does not redirect when submission fails', async () => {
    submitLeadMock.mockResolvedValue({ ok: false, error: 'rate_limited' });
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(messages.ContactForm.name), 'Олена');
    await user.type(screen.getByLabelText(messages.ContactForm.phone), '+380671234567');
    await user.click(screen.getByRole('button', { name: messages.ContactForm.submit }));

    expect(pushMock).not.toHaveBeenCalled();
  });
});
