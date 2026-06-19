// spec: specs/amazon-in/professional-test-cases.md
// scenario: TC-012

import './professional.hooks';
import { test, expect } from '../../../fixtures/amazon.fixture';
import { testData } from '../../../config/test-data';

test.describe('TC-012 — Session Refresh', () => {
  test('cart refresh preserves or safely recovers state @edge @positive', async ({
    homePage,
    searchResultsPage,
    productPage,
    cartPage,
    loginPage,
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
    const itemsBefore = await cartPage.getItemCount();

    // Step 2: Refresh the page
    await cartPage.reload();

    // Step 3: Verify system handles state safely
    const itemsAfter = await cartPage.getItemCount();
    const emptyCart = await cartPage.isEmpty().catch(() => false);
    const signInPrompt = await loginPage.isSignInPromptVisible();

    expect(itemsAfter === itemsBefore || emptyCart || signInPrompt).toBeTruthy();
  });
});
