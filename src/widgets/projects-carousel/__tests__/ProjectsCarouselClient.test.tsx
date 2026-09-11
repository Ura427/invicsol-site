import { act, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../../../../messages/en.json';
import { ProjectsCarouselClient } from '../ProjectsCarouselClient';

let canPrev = false;
let canNext = true;
const listeners = new Map<string, () => void>();
const api = {
  canScrollPrev: () => canPrev,
  canScrollNext: () => canNext,
  scrollPrev: jest.fn(),
  scrollNext: jest.fn(),
  on: (event: string, callback: () => void) => {
    listeners.set(event, callback);
    return api;
  },
  off: (event: string) => {
    listeners.delete(event);
    return api;
  },
};
jest.mock('embla-carousel-react', () => ({
  __esModule: true,
  default: () => [jest.fn(), api],
}));

it('names the arrows by direction and disables them at the corresponding edges', () => {
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ProjectsCarouselClient items={[]} />
    </NextIntlClientProvider>,
  );
  const prev = screen.getByRole('button', { name: 'Previous project' });
  const next = screen.getByRole('button', { name: 'Next project' });
  expect(prev).toBeDisabled();
  expect(next).toBeEnabled();
  act(() => {
    canPrev = true;
    canNext = false;
    listeners.get('select')?.();
  });
  expect(prev).toBeEnabled();
  expect(next).toBeDisabled();
  act(() => {
    canPrev = false;
    listeners.get('reInit')?.();
  });
  expect(prev).toBeDisabled();
  expect(next).toBeDisabled();
});
