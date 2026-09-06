import { test, expect } from '@playwright/test';

/**
 * Filtering happens server-side (a Server Component reading searchParams,
 * not client-side array filtering) specifically so it works before hydration
 * and survives a bookmark or shared link. The `request` fixture proves that:
 * it fetches raw HTML with no JavaScript execution at all, so if the
 * filtered set is correct here, it isn't client-side JS doing the filtering.
 */
test('filtering by type and usage returns the correct subset without any JavaScript', async ({
  request,
}) => {
  const response = await request.get('/uk/projects?type=house&usage=green-tariff');
  expect(response.ok()).toBe(true);
  const html = await response.text();

  // The seeded green-tariff project is a farm (business), not a house, so
  // this combination should legitimately return zero projects.
  expect(html).toContain('За обраними фільтрами проєктів не знайдено');
});

test('filtering by type=house alone returns only house projects', async ({ request }) => {
  const response = await request.get('/uk/projects?type=house');
  const html = await response.text();

  expect(html).toContain('Брюховичі');
  expect(html).toContain('Сокільники');
  // The business-type seeded projects must not appear.
  expect(html).not.toContain('Готель, Львів');
  expect(html).not.toContain('Фермерське господарство');
});

test('the filter UI survives a full page reload with the same query string', async ({ page }) => {
  await page.goto('/uk/projects?type=house');
  await page.reload();

  await expect(page.locator('select').first()).toHaveValue('house');
  await expect(page.getByText('Брюховичі')).toBeVisible();
});

test('resetting filters returns to the unfiltered URL', async ({ page }) => {
  await page.goto('/uk/projects?type=house');
  await page.getByRole('button', { name: 'Скинути фільтри' }).click();

  await expect(page).toHaveURL(/\/uk\/projects\/?$/);
});
