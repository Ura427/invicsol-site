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
  // Matched by role and type rather than by its label: the admin interface is
  // translated now, so asserting on "Sign in" would make this test fail every
  // time the default language changes, which is a copy decision and not the
  // thing this test is guarding.
  await expect(page.locator('form button[type="submit"]')).toBeVisible();
});

test('admin URLs carry no locale prefix', async ({ page }) => {
  await page.goto('/admin/login');
  // The admin *interface* is translated; its *routes* are not, and that
  // distinction is load-bearing. proxy.ts short-circuits on a path starting
  // /admin to run the auth gate ahead of next-intl, so a locale prefix appearing
  // here would silently route the whole panel through locale negotiation. The
  // language lives in a cookie precisely to keep this URL shape.
  //
  // Port-agnostic on purpose: hardcoding 3100 made this fail the moment the
  // server moved to another port.
  await expect(page).toHaveURL(/^https?:\/\/[^/]+\/admin\/login$/);
});
