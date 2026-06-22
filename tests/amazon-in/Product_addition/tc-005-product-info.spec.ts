// spec: specs/amazon-in/professional-test-cases.md
// scenario: TC-005

import './professional.hooks';
import { test, expect } from '../../../fixtures/amazon.fixture';
import { testData } from '../../../config/test-data';

test.describe('TC-005 — Product Information', () => {
  test('product detail page shows title price rating images delivery @regression @positive', async ({
    homePage,
    searchResultsPage,
    productPage,
  }) => {
    // Step 1: Open a product detail page
    await homePage.open();
    await homePage.search(testData.search.valid);
    await searchResultsPage.waitForResults();
    await searchResultsPage.openFirstResult();
    await productPage.waitForProduct();

    // Step 2: Review title, price, rating, images, and delivery section
    await expect(productPage.title).toBeVisible();
    await expect(productPage.title).not.toBeEmpty();

    await expect(productPage.price).toBeAttached();
    expect(await productPage.hasPriceDisplayed()).toBeTruthy();

    await expect(productPage.rating).toBeVisible();
    await expect(productPage.productImages.first()).toBeVisible();

    const deliveryVisible = await productPage.deliverySection
      .isVisible()
      .catch(() => false);
    const availabilityVisible = await productPage.availability
      .isVisible()
      .catch(() => false);
    expect(deliveryVisible || availabilityVisible).toBeTruthy();
  });
});
