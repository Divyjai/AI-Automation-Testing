// spec: specs/amazon-in/juicer-flow.md
// scenario: JUICER-005

import './juicer.hooks';
import { test, expect } from '../../../fixtures/amazon.fixture';
import { testData } from '../../../config/test-data';

test.describe('Juicer Flow', () => {
  test('proceed to buy and fill dummy checkout details @positive', async ({
    homePage,
    searchResultsPage,
    productPage,
    cartPage,
    checkoutPage,
    loginPage,
  }) => {
    // Step 1: Add juicer to cart
    await homePage.open();
    await homePage.search(testData.search.juicer);
    await searchResultsPage.waitForResults();
    await searchResultsPage.openFirstResult();
    await productPage.waitForProduct();
    await productPage.addToCart();
    await homePage.dismissOverlays();

    // Step 2: Go to cart page
    await cartPage.open();
    await expect(cartPage.cartHeading).toBeVisible({ timeout: 30_000 });

    // Step 3: Click proceed to buy / checkout
    await cartPage.proceedToBuy();

    // Step 4: Checkout or sign-in (guest may need login before address form)
    await checkoutPage.waitForReady();
    expect(await checkoutPage.isCheckoutOrAddressPage()).toBeTruthy();

    const addressFormVisible = await checkoutPage.fullNameInput
      .isVisible()
      .catch(() => false);

    if (addressFormVisible) {
      await checkoutPage.fillDummyAddress(testData.checkout);

      // Step 5: Verify dummy details entered (stop before payment)
      await expect(checkoutPage.fullNameInput).toHaveValue(testData.checkout.fullName);
      await expect(checkoutPage.phoneInput).toHaveValue(testData.checkout.phone);
      await expect(checkoutPage.pincodeInput).toHaveValue(testData.checkout.pincode);
    } else {
      // Guest checkout redirected to sign-in — expected without pipeline login
      await expect(loginPage.emailInput).toBeVisible({ timeout: 15_000 });
      await expect(loginPage.continueButton).toBeVisible();
    }
  });
});
