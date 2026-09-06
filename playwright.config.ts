import { defineConfig, devices } from '@playwright/test';

/**
 * Deliberately does NOT include any test that actually submits the
 * calculator, contact form, or callback modal — this project has no separate
 * test database, so a real submission would write a real row into
 * production Neon data on every single CI run. E2E coverage here verifies
 * navigation, rendering, and validation gating instead; the lead-submission
 * path is covered by unit tests on the reducer/validation and was verified
 * manually against a live browser during development.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3100',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3100',
    reuseExistingServer: !process.env['CI'],
    timeout: 120_000,
  },
});
