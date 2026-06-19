// spec: specs/amazon-in/professional-test-cases.md
// scenario: TC-002

import './professional.hooks';
import { test, expect } from '../../../fixtures/amazon.fixture';
import { testData } from '../../../config/test-data';

test.describe('TC-002 — Valid Search', () => {
  test('valid product search returns results @regression @positive', async ({
    homePage,
    searchResultsPage,
  }) => {
    // Step 1: Open homepage
    await homePage.open();

    // Step 2: Enter valid product name and submit search
    await homePage.search(testData.search.valid);

    // Step 3: Verify relevant search results are displayed
    await searchResultsPage.waitForResults();
    await expect(searchResultsPage.firstResult()).toBeVisible();
    expect(await searchResultsPage.getResultCount()).toBeGreaterThan(0);
  });
});
