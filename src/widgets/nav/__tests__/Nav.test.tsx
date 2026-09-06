import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../../../../messages/uk.json';
import { Nav } from '../Nav';

jest.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
  usePathname: () => '/',
}));

// Nav renders CallbackModal, which imports the submitLead server action. Without
// this mock, Jest would pull in the real db.ts -> the real `pg` driver -> code
// that references TextEncoder in a way jsdom doesn't provide, crashing every Nav
// test on an unrelated dependency. Testing Nav should never exercise the real
// lead-submission path anyway.
jest.mock('@/entities/lead/actions', () => ({
  submitLead: jest.fn(),
}));

function renderNav() {
  return render(
    <NextIntlClientProvider locale="uk" messages={messages}>
      <Nav />
    </NextIntlClientProvider>,
  );
}

describe('Nav', () => {
  it('renders the primary nav links', () => {
    renderNav();
    expect(screen.getByRole('link', { name: messages.Nav.services })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: messages.Nav.stations })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: messages.Nav.projects })).toBeInTheDocument();
  });

  it('opens the mobile menu on burger click', async () => {
    const user = userEvent.setup();
    renderNav();

    expect(screen.queryByText(messages.Nav.closeMenu)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: messages.Nav.openMenu }));

    expect(screen.getByRole('button', { name: messages.Nav.closeMenu })).toBeInTheDocument();
  });
});
