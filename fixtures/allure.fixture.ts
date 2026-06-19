import { test as base } from '@playwright/test';
import {
  annotateTest,
  attachApiCalls,
  attachPlaywrightArtifacts,
  attachTestContext,
  attachTraceIfPresent,
  createApiTracker,
  type ApiCallRecord,
} from '../reporting/allure';

type AllureFixtures = {
  apiLog: ApiCallRecord[];
};

/**
 * Base fixture with Allure metadata, attachments, and API logging.
 * Extend this fixture in domain-specific fixtures (e.g. amazon.fixture).
 */
export const test = base.extend<AllureFixtures>({
  apiLog: async ({ page }, use) => {
    const records = createApiTracker(page);
    await use(records);
  },

  page: async ({ page }, use, testInfo) => {
    await use(page);

    if (testInfo.status !== testInfo.expectedStatus) {
      await attachTestContext(testInfo, page);
      await attachPlaywrightArtifacts(testInfo);
      await attachTraceIfPresent(testInfo);
    }
  },
});

test.beforeEach(async ({}, testInfo) => {
  await annotateTest(testInfo);
});

test.afterEach(async ({ apiLog }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    await attachApiCalls(apiLog);
  }
});

export { expect } from '@playwright/test';
