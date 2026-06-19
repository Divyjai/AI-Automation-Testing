// spec: specs/amazon-in/juicer-flow.md
// scenario: JUICER-003

import './juicer.hooks';
import { test, expect } from '../../../fixtures/amazon.fixture';
import { testData } from '../../../config/test-data';

test.describe('Juicer Flow', () => {
  test('add juicer product to cart @positive', async ({
    homePage,
    searchResultsPage,
    productPage,
  }) => {
    // Step 1: Search and open a juicer product
    await homePage.open();
    await homePage.search(testData.search.juicer);
    await searchResultsPage.waitForResults();
    await searchResultsPage.openFirstResult();
    await productPage.waitForProduct();

    // Step 2: Add to cart
    await expect(productPage.addToCartButton).toBeVisible();
    const cartBefore = await homePage.getCartCount();
    await productPage.addToCart();

    // Step 3: Verify cart count increased or add-to-cart succeeded
    const cartIncreased = await expect
      .poll(async () => homePage.getCartCount(), { timeout: 10_000 })
      .not.toBe(cartBefore)
      .then(() => true)
      .catch(() => false);

    expect(cartIncreased || (await productPage.wasAddedToCart())).toBeTruthy();
  });
});
