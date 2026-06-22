// spec: specs/amazon-in/professional-test-cases.md
// scenario: TC-007

import './professional.hooks';
import { test, expect } from '../../../fixtures/amazon.fixture';
import { testData } from '../../../config/test-data';

test.describe('TC-007 — Cart Quantity', () => {
  test('update cart quantity changes subtotal @regression @positive', async ({
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

    // Step 2: Open cart and get initial subtotal
    await cartPage.open();
    await expect(cartPage.cartHeading).toBeVisible({ timeout: 30_000 });
    const subtotalBefore = await cartPage.getSubtotalText();

    // Step 3: Increase item quantity
    await expect(cartPage.increaseQuantityButton.first()).toBeVisible({ timeout: 15_000 });
    await cartPage.increaseItemQuantity(0);

    // Step 4: Verify quantity and subtotal update
    await expect(cartPage.quantityGroup.first()).toContainText(/2/, { timeout: 15_000 });
    await expect
      .poll(async () => cartPage.getSubtotalText(), { timeout: 15_000 })
      .not.toBe(subtotalBefore);
  });
});
