// spec: specs/amazon-in/search.md
// scenario: SRCH-NEG-001

import { test, expect } from '../../../fixtures/amazon.fixture';
import { testData } from '../../../config/test-data';

test.describe('Search — Negative', () => {
  test('search with no results term shows empty state @negative', async ({
    homePage,
    searchResultsPage,
  }) => {
    // Step 1: Open homepage
    await homePage.open();

    // Step 2: Search for term with no expected results
    await homePage.search(testData.search.noResults);

    // Step 3: Verify no results or zero result items
    await searchResultsPage.waitForResults();
    const count = await searchResultsPage.getResultCount();
    const noResultsVisible = await searchResultsPage.noResultsMessage
      .isVisible()
      .catch(() => false);

    expect(count === 0 || noResultsVisible).toBeTruthy();
  });
});
