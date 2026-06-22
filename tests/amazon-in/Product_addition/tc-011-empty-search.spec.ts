// spec: specs/amazon-in/professional-test-cases.md
// scenario: TC-011

import './professional.hooks';
import { test, expect } from '../../../fixtures/amazon.fixture';
import { testData } from '../../../config/test-data';

test.describe('TC-011 — Empty Search', () => {
  test('blank search is handled gracefully @edge @negative', async ({ homePage }) => {
    // Step 1: Open homepage
    await homePage.open();

    // Step 2: Submit search with blank input
    await homePage.search(testData.search.empty);

    // Step 3: Verify search blocked or handled without page error
    expect(await homePage.isOnAmazonDomain()).toBeTruthy();
    await expect(homePage.searchInput).toBeVisible();
  });

  test('whitespace-only search is handled gracefully @edge @negative', async ({
    homePage,
  }) => {
    // Step 1: Open homepage
    await homePage.open();

    // Step 2: Submit search with spaces only
    await homePage.search(testData.search.whitespace);

    // Step 3: Verify handled gracefully — stays on site, no crash
    expect(await homePage.isOnAmazonDomain()).toBeTruthy();
    await expect(homePage.searchInput).toBeVisible();
  });
});
