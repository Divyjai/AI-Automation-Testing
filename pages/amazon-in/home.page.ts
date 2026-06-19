import { type Locator, type Page } from '@playwright/test';
import { BasePage } from '../base.page';

export class HomePage extends BasePage {
  readonly searchInput: Locator;
  readonly searchSubmitButton: Locator;
  readonly cartLink: Locator;
  readonly logo: Locator;
  readonly deliverToLink: Locator;
  readonly searchSuggestions: Locator;
  readonly navBar: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.getByRole('searchbox', { name: /search amazon/i });
    this.searchSubmitButton = page.locator('#nav-search-submit-button');
    this.cartLink = page.locator('#nav-cart');
    this.logo = page.locator('#nav-logo-sprites');
    this.deliverToLink = page.locator('#nav-global-location-popover-link');
    this.searchSuggestions = page
      .getByRole('dialog')
      .getByRole('button')
      .or(page.locator('#sac-autocomplete-results .s-suggestion'));
    this.navBar = page.getByRole('navigation', { name: /primary/i });
  }

  async open(): Promise<void> {
    for (let attempt = 0; attempt < 5; attempt++) {
      await this.goto('/');
      await this.waitForReady();

      if (await this.isRushHourPage()) {
        await this.page.waitForTimeout(3000 * (attempt + 1));
        continue;
      }

      const visible = await this.searchInput.isVisible().catch(() => false);
      if (visible) {
        return;
      }

      await this.page.waitForTimeout(2000 * (attempt + 1));
    }
    await this.searchInput.waitFor({ state: 'visible', timeout: 30_000 });
  }

  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.searchSubmitButton.click();
  }

  async typePartialSearch(partial: string): Promise<void> {
    await this.searchInput.click();
    await this.searchInput.clear();
    await this.searchInput.pressSequentially(partial, { delay: 100 });
  }

  async waitForSuggestions(): Promise<void> {
    await this.page
      .getByRole('status')
      .filter({ hasText: /suggestion/i })
      .or(this.searchSuggestions.first())
      .first()
      .waitFor({ state: 'visible', timeout: 15_000 });
  }

  async submitSearch(): Promise<void> {
    await this.searchSubmitButton.click();
  }

  async getSuggestionCount(): Promise<number> {
    return this.searchSuggestions.count();
  }

  async searchViaButton(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.searchSubmitButton.click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async getCartCount(): Promise<string> {
    const count = this.page.locator('#nav-cart-count');
    if (await count.isVisible()) {
      return (await count.textContent()) ?? '0';
    }
    return '0';
  }
}
