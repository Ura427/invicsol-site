import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../../../../messages/en.json';
import { PowerPaybackCalculator } from '../ui/PowerPaybackCalculator';

it('allows clearing and typing power before clamping on blur', async () => {
  const user = userEvent.setup();
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <PowerPaybackCalculator />
    </NextIntlClientProvider>,
  );
  const power = screen.getAllByRole('spinbutton')[0]!;
  await user.clear(power);
  expect(power).toHaveValue(null);
  await user.type(power, '25');
  await user.tab();
  expect(power).toHaveValue(25);
  expect(screen.getByRole('slider')).toHaveValue('25');
  await user.clear(power);
  await user.type(power, '999');
  expect(power).toHaveValue(999);
  await user.tab();
  expect(power).toHaveValue(100);
});
