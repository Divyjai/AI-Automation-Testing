// spec: specs/amazon-in/professional-test-cases.md
// scenario: TC-009

import './professional.hooks';
import { test, expect } from '../../../fixtures/amazon.fixture';
import { testData } from '../../../config/test-data';

test.describe('TC-009 — Proceed to Checkout', () => {
  test('proceed to buy from cart enters checkout flow @regression @positive', async ({
    homePage,
    searchResultsPage,
    productPage,
    cartPage,
    checkoutPage,
  }) => {
    // Step 1: Add product and open cart
    await homePage.open();
    await homePage.search(testData.search.valid);
    await searchResultsPage.waitForResults();
    await searchResultsPage.openFirstResult();
    await productPage.waitForProduct();
    await productPage.addToCart();
    await homePage.dismissOverlays();
    await cartPage.open();
    await expect(cartPage.cartHeading).toBeVisible({ timeout: 30_000 });

    // Step 2: Click Proceed to Buy / Checkout
    await cartPage.proceedToBuy();

    // Step 3: Verify user is taken to checkout flow
    await checkoutPage.waitForReady();
    expect(await checkoutPage.isCheckoutOrAddressPage()).toBeTruthy();
  });
});
