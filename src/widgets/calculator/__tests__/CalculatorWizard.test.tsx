import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../../../../messages/en.json';
import { CalculatorWizard } from '../CalculatorWizard';

const submitLeadMock = jest.fn();
jest.mock('@/entities/lead/actions', () => ({
  submitLead: (...args: unknown[]) => submitLeadMock(...args),
}));
jest.mock('@/i18n/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }));

it('allows retrying a rejected submission with the wizard answers intact', async () => {
  const user = userEvent.setup();
  submitLeadMock.mockRejectedValueOnce(new Error('Offline'));
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <CalculatorWizard />
    </NextIntlClientProvider>,
  );
  const next = () =>
    user.click(screen.getByRole('button', { name: messages.Calculator.next }));
  await user.click(
    screen.getByRole('button', { name: messages.Calculator.propertyType.house }),
  );
  await next();
  await user.click(
    screen.getByRole('button', { name: messages.Calculator.solutionType.station }),
  );
  await next();
  await user.click(
    screen.getByRole('button', { name: messages.Calculator.consumption.phase1 }),
  );
  await user.type(
    screen.getByRole('spinbutton', { name: messages.Calculator.consumption.monthlyKwh }),
    '400',
  );
  await next();
  await user.click(
    screen.getByRole('button', { name: messages.Calculator.goals.savings }),
  );
  await next();
  await next();
  await user.click(screen.getByRole('button', { name: messages.Calculator.mount.roof }));
  await next();
  await user.type(
    screen.getByLabelText(new RegExp(messages.Calculator.contact.name)),
    'Olena',
  );
  await user.type(
    screen.getByLabelText(new RegExp(messages.Calculator.contact.phone)),
    '+380671234567',
  );
  await user.click(
    screen.getByRole('button', { name: messages.Calculator.contact.methodPhone }),
  );
  await user.click(screen.getByRole('button', { name: messages.Calculator.submit }));
  expect(await screen.findByRole('alert')).toHaveTextContent(
    messages.Calculator.errors.submitFailed,
  );
  expect(screen.getByRole('button', { name: messages.Calculator.submit })).toBeEnabled();
  expect(screen.getByLabelText(new RegExp(messages.Calculator.contact.name))).toHaveValue(
    'Olena',
  );
  await user.click(screen.getByRole('button', { name: messages.Calculator.back }));
  expect(
    screen.getByRole('button', { name: messages.Calculator.mount.roof }),
  ).toHaveAttribute('aria-pressed', 'true');
});
