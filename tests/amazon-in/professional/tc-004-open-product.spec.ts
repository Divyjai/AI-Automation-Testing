// spec: specs/amazon-in/professional-test-cases.md
// scenario: TC-004

import './professional.hooks';
import { test, expect } from '../../../fixtures/amazon.fixture';
import { testData } from '../../../config/test-data';

test.describe('TC-004 — Open Product', () => {
  test('select product from search results opens PDP @regression @positive', async ({
    homePage,
    searchResultsPage,
    productPage,
  }) => {
    // Step 1: Search for a valid product
    await homePage.open();
    await homePage.search(testData.search.valid);
    await searchResultsPage.waitForResults();

    // Step 2: Select a product from the results list
    await searchResultsPage.openFirstResult();

    // Step 3: Verify correct product detail page opens
    await productPage.waitForProduct();
    await expect(productPage.title).toBeVisible({ timeout: 30_000 });
  });
});
