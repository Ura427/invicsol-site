import { test, expect } from '@playwright/test';

test.describe('homepage renders in both locales', () => {
  test('Ukrainian (default locale)', async ({ page }) => {
    await page.goto('/uk');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('реально працюють');
  });

  test('English', async ({ page }) => {
    await page.goto('/en');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('actually work');
  });

  test('root path redirects to a locale — next-intl negotiates via Accept-Language', async ({
    page,
  }) => {
    // Chromium's default Accept-Language is en-US, so the un-forced case
    // legitimately redirects to /en, not the app's uk default — that's
    // next-intl's own locale-detection working as intended, not a bug.
    await page.goto('/');
    await expect(page).toHaveURL(/\/(uk|en)\/?$/);
  });

  test('root path falls back to uk (the app default) with no language preference', async ({
    browser,
  }) => {
    const context = await browser.newContext({ locale: 'uk-UA' });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page).toHaveURL(/\/uk\/?$/);
    await context.close();
  });
});

test.describe('station pages', () => {
  test('a real station slug renders its detail page', async ({ page }) => {
    await page.goto('/uk/stations/10kw');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('10 кВт');
  });

  test('an unknown station slug returns a real 404, not a blank page', async ({ page }) => {
    const response = await page.goto('/uk/stations/999kw-does-not-exist');
    expect(response?.status()).toBe(404);
  });
});

test.describe('project pages', () => {
  test('a real project slug renders its detail page', async ({ page }) => {
    await page.goto('/uk/projects');
    const firstProjectLink = page.locator('a[href*="/uk/projects/"]').first();
    await firstProjectLink.click();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('an unknown project slug returns a real 404', async ({ page }) => {
    const response = await page.goto('/uk/projects/this-slug-does-not-exist');
    expect(response?.status()).toBe(404);
  });
});

test('sitemap and robots.txt resolve', async ({ request }) => {
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).toContain('<urlset');

  const robots = await request.get('/robots.txt');
  expect(robots.ok()).toBe(true);
  expect(await robots.text()).toContain('Sitemap:');
});

test('a station detail page emits valid Product JSON-LD', async ({ page }) => {
  await page.goto('/uk/stations/10kw');
  const jsonLdText = await page.locator('script[type="application/ld+json"]').last().textContent();
  const jsonLd = JSON.parse(jsonLdText ?? '{}');
  expect(jsonLd['@type']).toBe('Product');
});
