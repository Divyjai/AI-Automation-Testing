import { type Locator, type Page } from '@playwright/test';
import { BasePage } from '../base.page';
import { testData } from '../../config/test-data';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly emptyCartMessage: Locator;
  readonly proceedToCheckoutButton: Locator;
  readonly proceedToBuyButton: Locator;
  readonly subtotal: Locator;
  readonly cartHeading: Locator;
  readonly itemQuantityDropdown: Locator;
  readonly increaseQuantityButton: Locator;
  readonly deleteItemButton: Locator;
  readonly itemRemovedMessage: Locator;
  readonly quantityGroup: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator(
      '[data-name="Active Items"] .sc-list-item, .sc-list-item[data-asin], [role="list"][aria-label*="Shopping Cart" i] [role="listitem"]'
    );
    this.emptyCartMessage = page.getByText(
      /your amazon cart is empty|was removed from shopping cart|subtotal \(0 items\)/i
    );
    this.itemRemovedMessage = page.getByText(/was removed from shopping cart/i);
    this.proceedToCheckoutButton = page
      .getByRole('button', { name: /proceed to checkout/i })
      .or(page.locator('input[name="proceedToRetailCheckout"]'))
      .first();
    this.proceedToBuyButton = page
      .getByRole('button', { name: /proceed to (buy|checkout)/i })
      .or(page.locator('#sc-buy-box-ptc-button, input[name="proceedToRetailCheckout"]'))
      .first();
    this.subtotal = page.locator('#sc-subtotal-amount-activecart');
    this.cartHeading = page
      .getByRole('heading', { name: /your amazon cart|shopping cart|amazon cart/i })
      .or(page.locator('#sc-active-cart, [data-name="Active Items"]'))
      .first();
    this.itemQuantityDropdown = page.locator(
      '[data-name="Active Items"] select[name="quantity"], .sc-list-item select[name="quantity"]'
    );
    this.increaseQuantityButton = page.getByRole('button', { name: /increase quantity by one/i });
    this.deleteItemButton = page
      .locator('.sc-action-delete input[type="submit"], span.sc-action-delete input')
      .or(page.getByRole('button', { name: /^Delete /i }));
    this.quantityGroup = page.getByRole('group', { name: /quantity is/i });
  }

  async proceedToBuy(): Promise<void> {
    const checkoutButton = (await this.proceedToBuyButton.isVisible().catch(() => false))
      ? this.proceedToBuyButton
      : this.proceedToCheckoutButton;

    await checkoutButton.waitFor({ state: 'visible', timeout: 15_000 });
    await Promise.all([
      this.page.waitForURL(/signin|checkout|buy|ap\/|address/i, { timeout: 45_000 }),
      checkoutButton.click(),
    ]);
    await this.waitForReady();
  }

  async open(): Promise<void> {
    await this.goto(testData.paths.cart);
    await this.waitForReady();
    await this.cartHeading.waitFor({ state: 'visible', timeout: 30_000 }).catch(() => undefined);
  }

  async deleteItem(index: number = 0): Promise<void> {
    await this.deleteItemButton.nth(index).click();
    await this.itemRemovedMessage
      .or(this.emptyCartMessage)
      .first()
      .waitFor({ state: 'visible', timeout: 15_000 })
      .catch(() => undefined);
  }

  async increaseItemQuantity(index: number = 0): Promise<void> {
    if (await this.increaseQuantityButton.nth(index).isVisible().catch(() => false)) {
      await this.increaseQuantityButton.nth(index).click();
      await this.page.waitForLoadState('domcontentloaded');
      return;
    }
    await this.itemQuantityDropdown.nth(index).selectOption('2');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getSubtotalText(): Promise<string> {
    const subtotal = this.page.locator(
      '#sc-subtotal-amount-activecart, #sc-subtotal-amount-buybox, .sc-subtotal-amount'
    );
    return (await subtotal.first().textContent()) ?? '';
  }

  async getItemCount(): Promise<number> {
    if (await this.isEmpty()) {
      return 0;
    }
    const count = await this.cartItems.count();
    if (count > 0) {
      return count;
    }
    const altItems = this.page.locator('.sc-list-item[data-asin], [data-name="Active Items"] .sc-product-container');
    return altItems.count();
  }

  async isEmpty(): Promise<boolean> {
    const subtotal = await this.getSubtotalText();
    return (
      (await this.itemRemovedMessage.isVisible().catch(() => false)) ||
      (await this.emptyCartMessage.isVisible().catch(() => false)) ||
      /subtotal \(0 items\)/i.test(subtotal)
    );
  }
}
