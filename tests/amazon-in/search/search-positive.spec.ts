// spec: specs/amazon-in/search.md
// scenario: SRCH-REG-001

import { test, expect } from '../../../fixtures/amazon.fixture';
import { testData } from '../../../config/test-data';

test.describe('Search — Positive', () => {
  test('valid search returns results @regression @positive', async ({
    homePage,
    searchResultsPage,
  }) => {
    // Step 1: Open Amazon.in homepage
    await homePage.open();

    // Step 2: Enter valid search term and submit
    await homePage.search(testData.search.valid);

    // Step 3: Verify search results page shows products
    await searchResultsPage.waitForResults();
    await expect(searchResultsPage.firstResult()).toBeVisible();
  });
});
