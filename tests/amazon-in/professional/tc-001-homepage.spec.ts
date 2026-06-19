// spec: specs/amazon-in/professional-test-cases.md
// scenario: TC-001

import './professional.hooks';
import { test, expect } from '../../../fixtures/amazon.fixture';

test.describe('TC-001 — Homepage', () => {
  test('homepage loads with key UI elements @regression @positive', async ({ homePage }) => {
    // Step 1: Open amazon.in
    await homePage.open();

    // Step 2: Verify key UI elements are visible
    await expect(homePage.logo).toBeVisible();
    await expect(homePage.searchInput).toBeVisible();
    await expect(homePage.searchInput).toBeEnabled();
    await expect(homePage.navBar).toBeVisible();
    await expect(homePage.cartLink).toBeVisible();
  });
});
