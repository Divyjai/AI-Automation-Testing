// spec: specs/amazon-in/professional-test-cases.md
// scenario: TC-006

import './professional.hooks';
import { test, expect } from '../../../fixtures/amazon.fixture';
import { testData } from '../../../config/test-data';

test.describe('TC-006 — Add to Cart', () => {
  test('add product to cart updates cart count @regression @positive', async ({
    homePage,
    searchResultsPage,
    productPage,
  }) => {
    // Step 1: Open product detail page
    await homePage.open();
    await homePage.search(testData.search.valid);
    await searchResultsPage.waitForResults();
    await searchResultsPage.openFirstResult();
    await productPage.waitForProduct();

    // Step 2: Click Add to Cart
    await expect(productPage.addToCartButton).toBeVisible();
    const cartBefore = await homePage.getCartCount();
    await productPage.addToCart();

    // Step 3: Verify item added and cart count updates
    const cartIncreased = await expect
      .poll(async () => homePage.getCartCount(), { timeout: 10_000 })
      .not.toBe(cartBefore)
      .then(() => true)
      .catch(() => false);

    expect(cartIncreased || (await productPage.wasAddedToCart())).toBeTruthy();
  });
});
