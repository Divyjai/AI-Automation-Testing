// spec: specs/amazon-in/professional-test-cases.md
// scenario: TC-008

import './professional.hooks';
import { test, expect } from '../../../fixtures/amazon.fixture';
import { testData } from '../../../config/test-data';

test.describe('TC-008 — Remove Cart Item', () => {
  test('remove item from cart shows empty state @regression @positive', async ({
    homePage,
    searchResultsPage,
    productPage,
    cartPage,
  }) => {
    // Step 1: Add a product to cart
    await homePage.open();
    await homePage.search(testData.search.valid);
    await searchResultsPage.waitForResults();
    await searchResultsPage.openFirstResult();
    await productPage.waitForProduct();
    await productPage.addToCart();
    await homePage.dismissOverlays();

    // Step 2: Open cart and verify item exists
    await cartPage.open();
    await expect(cartPage.cartHeading).toBeVisible({ timeout: 30_000 });
    expect(await cartPage.getItemCount()).toBeGreaterThan(0);

    // Step 3: Remove the item from cart
    await cartPage.deleteItem(0);

    // Step 4: Verify item removed and cart reflects the change
    await expect(cartPage.itemRemovedMessage).toBeVisible({ timeout: 15_000 });
    expect(await cartPage.isEmpty()).toBeTruthy();
    expect(await cartPage.getItemCount()).toBe(0);
  });
});
