import { test, expect } from '@playwright/test';

/**
 * Deliberately stops before step 7's submit button. This project has no
 * separate test database, so actually submitting would write a real row into
 * production Neon data on every CI run. The submission path itself (server
 * action, DB write, Telegram side effect) is covered by
 * src/entities/lead/__tests__ and was verified manually in a live browser
 * during development — this test only proves the step-gating logic that
 * blocks a click-through, per canAdvanceFromStep().
 */
test('the wizard blocks advancing past step 1 until a property type is chosen', async ({
  page,
}) => {
  await page.goto('/uk/calculator');

  await page.getByRole('button', { name: 'Далі' }).click();

  // Next's own route announcer is also role="alert", so scope past it.
  await expect(page.getByText('Оберіть варіант, щоб продовжити')).toBeVisible();
  await expect(page.getByText('КРОК 1 З 7')).toBeVisible();
});

test('choosing an option allows the wizard to advance', async ({ page }) => {
  await page.goto('/uk/calculator');

  await page.getByRole('button', { name: 'Приватний будинок' }).click();
  await page.getByRole('button', { name: 'Далі' }).click();

  await expect(page.getByText('КРОК 2 З 7')).toBeVisible();
});

test('the auto-estimate checkbox computes power from consumption', async ({ page }) => {
  await page.goto('/uk/calculator');

  await page.getByRole('button', { name: 'Приватний будинок' }).click();
  await page.getByRole('button', { name: 'Далі' }).click();
  await page.getByRole('button', { name: 'Сонячна станція' }).click();
  await page.getByRole('button', { name: 'Далі' }).click();

  await page.getByRole('button', { name: '1 фаза' }).click();
  await page.getByLabel(/Середнє споживання/).fill('600');
  await page.getByLabel(/Не знаю точно/).check();

  // 600 kWh/month at the documented defaults (4 sun hours, 0.8 efficiency)
  // -> 6.3 kW, per the hand-derived test in estimatePower.test.ts.
  await expect(page.getByText('6.3')).toBeVisible();
});
