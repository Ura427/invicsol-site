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
  it('recovers from a rejected request without clearing the contact details', async () => {
    submitLeadMock.mockRejectedValueOnce(new Error('Network unavailable'));
    const user = userEvent.setup();
    renderForm();
    await user.type(
      screen.getByLabelText(new RegExp(messages.ContactForm.name)),
      'Олена',
    );
    await user.type(
      screen.getByLabelText(new RegExp(messages.ContactForm.phone)),
      '+380671234567',
    );
    await user.click(screen.getByRole('button', { name: messages.ContactForm.submit }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      messages.ContactForm.error,
    );
    expect(
      screen.getByRole('button', { name: messages.ContactForm.submit }),
    ).toBeEnabled();
    expect(screen.getByLabelText(new RegExp(messages.ContactForm.name))).toHaveValue(
      'Олена',
    );
    expect(screen.getByLabelText(new RegExp(messages.ContactForm.phone))).toHaveValue(
      '+380671234567',
    );
    expect(pushMock).not.toHaveBeenCalled();
  });
  beforeEach(() => {
    pushMock.mockClear();
    submitLeadMock.mockClear();
  });

  it('refuses to submit a phone number that is not a phone number', async () => {
    // The reported bug: this field accepted literally anything, so leads could
    // arrive with a number nobody could call back.
    const user = userEvent.setup();
    renderForm();

    await user.type(
      screen.getByLabelText(new RegExp(messages.ContactForm.name)),
      'Олена',
    );
    await user.type(
      screen.getByLabelText(new RegExp(messages.ContactForm.phone)),
      'подзвоніть мені',
    );
    await user.click(screen.getByRole('button', { name: messages.ContactForm.submit }));

    expect(submitLeadMock).not.toHaveBeenCalled();
    expect(screen.getByText(messages.Forms.errPhone)).toBeInTheDocument();
  });

  it('marks both empty required fields rather than failing silently', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole('button', { name: messages.ContactForm.submit }));

    expect(submitLeadMock).not.toHaveBeenCalled();
    expect(screen.getAllByText(messages.Forms.errRequired)).toHaveLength(2);
  });

  it('submits the entered values and redirects to /thank-you on success', async () => {
    submitLeadMock.mockResolvedValue({ ok: true });
    const user = userEvent.setup();
    renderForm();

    await user.type(
      screen.getByLabelText(new RegExp(messages.ContactForm.name)),
      'Олена',
    );
    await user.type(
      screen.getByLabelText(new RegExp(messages.ContactForm.phone)),
      '+380671234567',
    );
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

    await user.type(
      screen.getByLabelText(new RegExp(messages.ContactForm.name)),
      'Олена',
    );
    await user.type(
      screen.getByLabelText(new RegExp(messages.ContactForm.phone)),
      '+380671234567',
    );
    await user.click(screen.getByRole('button', { name: messages.ContactForm.submit }));

    expect(pushMock).not.toHaveBeenCalled();
  });
});
