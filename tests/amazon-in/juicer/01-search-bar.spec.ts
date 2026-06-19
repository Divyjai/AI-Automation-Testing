// spec: specs/amazon-in/juicer-flow.md
// scenario: JUICER-001

import './juicer.hooks';
import { test, expect } from '../../../fixtures/amazon.fixture';

test.describe('Juicer Flow', () => {
  test('homepage includes search bar @regression @positive', async ({ homePage }) => {
    // Step 1: Open Amazon.in homepage
    await homePage.open();

    // Step 2: Verify search bar is visible and enabled
    await expect(homePage.searchInput).toBeVisible({ timeout: 30_000 });
    await expect(homePage.searchInput).toBeEnabled();
  });
});
