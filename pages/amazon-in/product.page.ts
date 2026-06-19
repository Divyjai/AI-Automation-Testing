import { type Locator, type Page } from '@playwright/test';
import { BasePage } from '../base.page';

export class ProductPage extends BasePage {
  readonly title: Locator;
  readonly price: Locator;
  readonly addToCartButton: Locator;
  readonly availability: Locator;
  readonly quantityDropdown: Locator;
  readonly buyNowButton: Locator;
  readonly addedToCartConfirmation: Locator;
  readonly warrantyUpsellDialog: Locator;
  readonly rating: Locator;
  readonly productImages: Locator;
  readonly deliverySection: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('span#productTitle');
    this.price = page
      .locator(
        '#corePriceDisplay_desktop_feature_div .a-price, #tp_price_block_total_price_ww .a-price, #priceblock_ourprice, span.a-price[data-a-size]'
      )
      .first();
    this.addToCartButton = page
      .locator('#add-to-cart-button')
      .or(page.locator('input[name="submit.add-to-cart"][type="button"], input[name="submit.add-to-cart"][type="submit"]'))
      .first();
    this.buyNowButton = page.getByRole('button', { name: /buy now/i }).first();
    this.availability = page.locator('#availability');
    this.quantityDropdown = page.locator('#quantity');
    this.addedToCartConfirmation = page.locator(
      '#attachDisplayAddBaseAlert, #sw-atc-details-single-container, #huc-v2-order-row-confirm-text'
    );
    this.warrantyUpsellDialog = page.getByRole('dialog', { name: /add to your order/i });
    this.rating = page
      .locator('#acrPopover, #averageCustomerReviews, [data-hook="rating-out-of-text"]')
      .first();
    this.productImages = page.locator('#altImages img, #landingImage, #imgTagWrapperId img');
    this.deliverySection = page.locator(
      '#deliveryBlockMessage, #mir-layout-DELIVERY_BLOCK, #ddmDeliveryMessage'
    );
  }

  async waitForProduct(): Promise<void> {
    await this.page.waitForURL(/\/(dp|gp\/product)\//, { timeout: 30_000 });
    await this.waitForReady();
  }

  async dismissWarrantyUpsell(): Promise<void> {
    const noThanks = this.page.getByRole('button', { name: /no thanks/i });
    if (await noThanks.isVisible().catch(() => false)) {
      await noThanks.click();
      await noThanks.waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => undefined);
    }
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
    await this.warrantyUpsellDialog
      .or(this.addedToCartConfirmation)
      .first()
      .waitFor({ state: 'visible', timeout: 15_000 })
      .catch(() => undefined);
    await this.dismissWarrantyUpsell();
    await this.dismissOverlays();
  }

  async wasAddedToCart(): Promise<boolean> {
    const cartCount = await this.page.locator('#nav-cart-count').textContent().catch(() => '0');
    if (cartCount && cartCount !== '0') {
      return true;
    }
    return (
      (await this.addedToCartConfirmation.isVisible().catch(() => false)) ||
      (await this.warrantyUpsellDialog.isVisible().catch(() => false))
    );
  }

  async buyNow(): Promise<void> {
    await this.buyNowButton.click();
  }

  async isAddToCartVisible(): Promise<boolean> {
    return this.addToCartButton.isVisible();
  }

  async hasPriceDisplayed(): Promise<boolean> {
    const priceText = (await this.price.textContent().catch(() => '')) ?? '';
    return /₹|\d/.test(priceText);
  }
}
