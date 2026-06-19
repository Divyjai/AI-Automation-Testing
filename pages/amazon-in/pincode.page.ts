import { type Locator, type Page } from '@playwright/test';
import { BasePage } from '../base.page';

export class PincodePage extends BasePage {
  readonly pincodeInput: Locator;
  readonly applyButton: Locator;
  readonly deliveryMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.pincodeInput = page.locator('#GLUXZipUpdateInput');
    this.applyButton = page.locator('#GLUXZipUpdate').or(
      page.getByRole('button', { name: /apply/i })
    );
    this.deliveryMessage = page.locator('#glow-ingress-line2, #nav-global-location-popover-link');
    this.errorMessage = page.getByText(/enter a valid|invalid|please enter/i);
  }

  async openLocationPopup(): Promise<void> {
    await this.page.locator('#nav-global-location-popover-link').click();
  }

  async setPincode(pincode: string): Promise<void> {
    await this.openLocationPopup();
    await this.pincodeInput.fill(pincode);
    await this.applyButton.click();
    await this.dismissOverlays();
  }
}
