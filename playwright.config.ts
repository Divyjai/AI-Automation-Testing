import { defineConfig, devices } from '@playwright/test';
import { env } from './config/env.config';
import {
  ALLURE_REPORTER_OPTIONS,
  ALLURE_CATEGORIES,
  buildAllureEnvironment,
} from './reporting/allure';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    [
      'allure-playwright',
      {
        ...ALLURE_REPORTER_OPTIONS,
        environmentInfo: buildAllureEnvironment(
          process.env.PLAYWRIGHT_PROJECT ?? 'chromium'
        ),
        categories: ALLURE_CATEGORIES,
      },
    ],
    ['list'],
  ],
  timeout: 90_000,
  use: {
    baseURL: env.baseUrl,
    headless: env.headless,
    launchOptions: {
      slowMo: env.slowMo,
    },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
