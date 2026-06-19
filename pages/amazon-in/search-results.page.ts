import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from '../base.page';

export class SearchResultsPage extends BasePage {
  readonly resultItems: Locator;
  readonly productLinks: Locator;
  readonly resultsHeading: Locator;
  readonly noResultsMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.resultItems = page.locator(
      '[data-component-type="s-search-result"], div.s-result-item[data-asin], div[data-asin].s-result-item'
    );
    this.productLinks = page
      .locator('a[href*="/dp/"]')
      .filter({ has: page.getByRole('heading', { level: 2 }) })
      .filter({ hasNotText: /^Sponsored/i });
    this.resultsHeading = page.locator('h2').filter({ hasText: /results/i });
    this.noResultsMessage = page.getByText(/no results|try checking your spelling/i);
  }

  async waitForResults(): Promise<void> {
    await this.waitForReady();
    await expect(this.page.getByText(/results for/i)).toBeVisible({ timeout: 30_000 });
    await expect(this.productLinks.first()).toBeVisible({ timeout: 30_000 });
  }

  firstResult(): Locator {
    return this.resultItems.first();
  }

  async openFirstResult(): Promise<void> {
    await this.waitForResults();
    const productLink = this.productLinks.first();
    const href = await productLink.getAttribute('href');

    if (href) {
      const path = href.startsWith('http') ? new URL(href).pathname + new URL(href).search : href;
      await this.page.goto(path);
      return;
    }

    await productLink.click({ modifiers: [] });
  }

  async getResultCount(): Promise<number> {
    return this.resultItems.count();
  }
}
