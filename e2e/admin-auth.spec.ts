import { test, expect } from '@playwright/test';

/**
 * Read-only checks against the proxy's auth gate — no login attempted here,
 * since that would need real admin credentials that must never live in a
 * repo or CI config as a plaintext test fixture. Verified manually with the
 * real account during development instead.
 */
test('an unauthenticated visitor is redirected from /admin to /admin/login', async ({ page }) => {
  await page.goto('/admin');
  await expect(page).toHaveURL(/\/admin\/login$/);
});

test('an unauthenticated visitor is redirected from a nested admin route', async ({ page }) => {
  await page.goto('/admin/leads');
  await expect(page).toHaveURL(/\/admin\/login$/);
});

test('the login page itself is reachable without a redirect loop', async ({ page }) => {
  const response = await page.goto('/admin/login');
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
});

test('the admin area is not localized — no /uk or /en prefix', async ({ page }) => {
  await page.goto('/admin/login');
  await expect(page).toHaveURL(/^http:\/\/localhost:3100\/admin\/login$/);
});
