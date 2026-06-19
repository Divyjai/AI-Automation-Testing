// spec: specs/amazon-in/juicer-flow.md
// scenario: JUICER-004

import './juicer.hooks';
import { test, expect } from '../../../fixtures/amazon.fixture';
import { testData } from '../../../config/test-data';

test.describe('Juicer Flow', () => {
  test('navigate to cart with juicer item @positive', async ({
    homePage,
    searchResultsPage,
    productPage,
    cartPage,
  }) => {
    // Step 1: Add juicer to cart
    await homePage.open();
    await homePage.search(testData.search.juicer);
    await searchResultsPage.waitForResults();
    await searchResultsPage.openFirstResult();
    await productPage.waitForProduct();
    await productPage.addToCart();
    await homePage.dismissOverlays();

    // Step 2: Open cart page
    await cartPage.open();

    // Step 3: Verify cart page shows items
    await expect(cartPage.cartHeading).toBeVisible({ timeout: 30_000 });
    const itemCount = await cartPage.getItemCount();
    expect(itemCount).toBeGreaterThan(0);
  });
});
