import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../../../../messages/uk.json';
import { CallbackModal } from '../CallbackModal';

const submitLeadMock = jest.fn();

jest.mock('@/entities/lead/actions', () => ({
  submitLead: (...args: unknown[]) => submitLeadMock(...args),
}));

jest.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

function renderModal() {
  return render(
    <NextIntlClientProvider locale="uk" messages={messages}>
      <CallbackModal />
    </NextIntlClientProvider>,
  );
}

describe('CallbackModal', () => {
  beforeEach(() => {
    submitLeadMock.mockReset();
  });

  it('starts closed and opens when the trigger is clicked', async () => {
    const user = userEvent.setup();
    renderModal();

    expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute('open');

    await user.click(screen.getByRole('button', { name: messages.CallbackModal.trigger }));

    expect(screen.getByRole('dialog')).toHaveAttribute('open');
  });

  it('closes again via the close button', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole('button', { name: messages.CallbackModal.trigger }));
    await user.click(screen.getByRole('button', { name: messages.CallbackModal.close }));

    expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute('open');
  });

  it('submits name and phone as a callback lead with an empty honeypot', async () => {
    submitLeadMock.mockResolvedValue({ ok: true });
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole('button', { name: messages.CallbackModal.trigger }));
    await user.type(screen.getByLabelText(new RegExp(messages.CallbackModal.nameLabel)), 'Тарас');
    await user.type(screen.getByLabelText(new RegExp(messages.CallbackModal.phoneLabel)), '+380671112233');
    await user.click(screen.getByRole('button', { name: messages.CallbackModal.submit }));

    expect(submitLeadMock).toHaveBeenCalledWith(
      expect.objectContaining({
        source: 'callback',
        name: 'Тарас',
        phone: '+380671112233',
        contactMethod: 'phone',
        website: '',
      }),
    );
  });

  it('shows the confirmation message after a successful submission', async () => {
    submitLeadMock.mockResolvedValue({ ok: true });
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole('button', { name: messages.CallbackModal.trigger }));
    await user.type(screen.getByLabelText(new RegExp(messages.CallbackModal.nameLabel)), 'Тарас');
    await user.type(screen.getByLabelText(new RegExp(messages.CallbackModal.phoneLabel)), '+380671112233');
    await user.click(screen.getByRole('button', { name: messages.CallbackModal.submit }));

    expect(await screen.findByRole('status')).toHaveTextContent(messages.CallbackModal.text);
  });
});
