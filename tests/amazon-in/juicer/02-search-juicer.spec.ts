// spec: specs/amazon-in/juicer-flow.md
// scenario: JUICER-002

import './juicer.hooks';
import { test, expect } from '../../../fixtures/amazon.fixture';
import { testData } from '../../../config/test-data';

test.describe('Juicer Flow', () => {
  test('search for juicer and open a product @positive', async ({
    homePage,
    searchResultsPage,
    productPage,
  }) => {
    // Step 1: Open homepage
    await homePage.open();

    // Step 2: Search for juicer
    await homePage.search(testData.search.juicer);

    // Step 3: Verify results and open first product
    await searchResultsPage.openFirstResult();

    // Step 4: Verify product detail page loaded
    await productPage.waitForProduct();
    await expect(productPage.title).toBeVisible({ timeout: 30_000 });
  });
});
