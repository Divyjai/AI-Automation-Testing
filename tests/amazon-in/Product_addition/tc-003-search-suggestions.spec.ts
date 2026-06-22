// spec: specs/amazon-in/professional-test-cases.md
// scenario: TC-003

import './professional.hooks';
import { test, expect } from '../../../fixtures/amazon.fixture';
import { testData } from '../../../config/test-data';

test.describe('TC-003 — Search Suggestions', () => {
  test('partial keyword shows auto-suggestions @regression @positive', async ({ homePage }) => {
    // Step 1: Open homepage
    await homePage.open();

    // Step 2: Type a partial keyword in the search bar
    await homePage.typePartialSearch(testData.search.partial);
    await homePage.waitForSuggestions();

    // Step 3: Verify auto-suggestions appear and remain relevant
    await expect(homePage.searchSuggestions.first()).toBeVisible({ timeout: 15_000 });
    expect(await homePage.getSuggestionCount()).toBeGreaterThan(0);
    await expect(homePage.searchSuggestions.first()).toContainText(
      new RegExp(testData.search.partial, 'i')
    );
  });
});
