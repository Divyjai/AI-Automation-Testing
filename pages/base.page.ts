import { type Locator, type Page, expect } from '@playwright/test';

/**
 * Base page — shared navigation and overlay handling.
 * All page objects extend this class.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /** Navigate to a path relative to baseURL from env config */
  async goto(path: string = '/'): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  }

  /** Dismiss common Amazon.in overlays that block interaction */
  async dismissOverlays(): Promise<void> {
    const closeButtons = [
      this.page.getByRole('button', { name: /no thanks|close|not now|skip|continue shopping/i }),
      this.page.locator('[data-action="a-popover-close"]'),
    ];

    for (const button of closeButtons) {
      if (await button.first().isVisible().catch(() => false)) {
        await button.first().click().catch(() => undefined);
      }
    }
  }

  /** Detect Amazon rush-hour / 503 throttle page */
  async isRushHourPage(): Promise<boolean> {
    return this.page
      .getByText(/rush hour|traffic is piling up|try again in a short while/i)
      .isVisible()
      .catch(() => false);
  }

  /** Retry once if Amazon returns rush-hour throttle page */
  async recoverFromRushHour(): Promise<void> {
    if (await this.isRushHourPage()) {
      await this.page.waitForTimeout(3000);
      await this.page.reload({ waitUntil: 'domcontentloaded' });
      await this.dismissOverlays();
    }
  }

  async reload(): Promise<void> {
    await this.page.reload({ waitUntil: 'domcontentloaded' });
    await this.waitForReady();
  }

  async isOnAmazonDomain(): Promise<boolean> {
    return /amazon\.in/i.test(this.page.url());
  }

  /** Wait for page to be in a testable state */
  async waitForReady(): Promise<void> {
    await this.dismissOverlays();
    await this.recoverFromRushHour();
  }

  protected locator(selector: Locator): Locator {
    return selector;
  }
}
