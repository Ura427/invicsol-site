import { test, expect } from '@playwright/test';

/**
 * Read-only, like every other spec here: nothing submits, because there is no
 * test database and a real submission would write a real review row. The
 * moderation loop (submit → hidden → approve → visible → delete) was walked by
 * hand against the live database during development, and cleaned up after.
 */

test('the 15 kW page names its system type in the title and has one h1', async ({ page }) => {
  await page.goto('/uk/stations/15kw');
  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1).toHaveCount(1);
  await expect(h1).toHaveText(/Гібридна станція 15 кВт/);
});

test('the decision column has a call to action above the fold', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/uk/stations/15kw');
  const cta = page.getByRole('link', { name: /Залишити заявку на цю станцію/ }).first();
  await expect(cta).toBeVisible();
  const box = await cta.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.y + box!.height).toBeLessThan(900);
});

test('the equipment carousel lists the kit and can be stepped through', async ({ page }) => {
  await page.goto('/uk/stations/15kw');
  const carousel = page.getByRole('region', { name: /Комплектація/ });
  await expect(carousel).toBeVisible();
  await expect(carousel.getByRole('group')).toHaveCount(3);
  // A click that lands before hydration is lost, so retry until the slide moves.
  await expect(async () => {
    await page.getByRole('button', { name: /Наступне/ }).click();
    await expect(page.getByRole('tab', { selected: true })).not.toHaveAccessibleName(/панелей/, {
      timeout: 1000,
    });
  }).toPass();
  await expect(page.getByRole('tab', { selected: true })).toHaveAccessibleName(/інвертор/i);
});

test('with no reviews the page says so rather than showing a score', async ({ page }) => {
  await page.goto('/uk/stations/15kw');
  await expect(page.getByRole('link', { name: 'Ще немає відгуків' })).toBeVisible();
  await expect(page.locator('body')).not.toContainText(/0[.,]0/);
});

test('the review form validates locally before anything is sent', async ({ page }) => {
  await page.goto('/uk/stations/15kw');
  let submitted = false;
  page.on('request', (request) => {
    if (request.method() === 'POST') submitted = true;
  });
  const form = page.locator('form:has(input[name="authorName"])');
  // A click before hydration does nothing (noValidate), so retry until the
  // form has answered.
  await expect(async () => {
    await form.getByRole('button', { name: /Надіслати відгук/ }).click();
    await expect(form.getByText(/Оберіть оцінку/)).toBeVisible({ timeout: 1000 });
  }).toPass();
  // Each problem is named next to its own field, not as one line at the bottom.
  await expect(form.getByRole('textbox', { name: /ім’я/ })).toHaveAccessibleDescription(/ім’я/);
  await expect(form.getByRole('textbox', { name: /Ваш відгук/ })).toHaveAccessibleDescription(
    /Напишіть/,
  );
  expect(submitted).toBe(false);
});

test('the tier badge is gone from the catalogue and the type is shown instead', async ({ page }) => {
  await page.goto('/uk/#stations');
  await expect(page.locator('body')).not.toContainText(/Розширена|Стартова|Популярна/);
  // Both the phone rows and the desktop cards are in the DOM; assert on whichever shows.
  await expect(page.getByText('Гібридна', { exact: true }).locator('visible=true').first()).toBeVisible();
});

test('a station page has no horizontal overflow on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/uk/stations/15kw');
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
});

test('a phone gets a sticky price bar once the hero CTA scrolls away; desktop does not', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/uk/stations/15kw');
  const bar = page.locator('div.fixed.bottom-0');
  await page.evaluate(() => window.scrollTo(0, 2500));
  await expect(bar).toHaveAttribute('aria-hidden', 'false');
  await expect(bar).toContainText('271 000');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(bar).toHaveAttribute('aria-hidden', 'true');

  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(bar).toBeHidden();
});
