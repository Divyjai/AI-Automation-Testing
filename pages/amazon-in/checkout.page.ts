import { type Locator, type Page } from '@playwright/test';
import { BasePage } from '../base.page';

export type DummyCheckoutDetails = {
  fullName: string;
  phone: string;
  pincode: string;
  addressLine: string;
  city: string;
  state: string;
};

export class CheckoutPage extends BasePage {
  readonly fullNameInput: Locator;
  readonly phoneInput: Locator;
  readonly pincodeInput: Locator;
  readonly addressLineInput: Locator;
  readonly cityInput: Locator;
  readonly stateDropdown: Locator;
  readonly continueButton: Locator;
  readonly deliverToAddressButton: Locator;

  constructor(page: Page) {
    super(page);
    this.fullNameInput = page.locator(
      'input[name="address-ui-widgets-enterAddressFullName"], #address-ui-widgets-enterAddressFullName'
    );
    this.phoneInput = page.locator(
      'input[name="address-ui-widgets-enterAddressPhoneNumber"], #address-ui-widgets-enterAddressPhoneNumber'
    );
    this.pincodeInput = page.locator(
      'input[name="address-ui-widgets-enterAddressPostalCode"], #address-ui-widgets-enterAddressPostalCode'
    );
    this.addressLineInput = page.locator(
      'input[name="address-ui-widgets-enterAddressLine1"], #address-ui-widgets-enterAddressLine1'
    );
    this.cityInput = page.locator(
      'input[name="address-ui-widgets-enterAddressCity"], #address-ui-widgets-enterAddressCity'
    );
    this.stateDropdown = page.locator(
      'select[name="address-ui-widgets-enterAddressStateOrRegion"], #address-ui-widgets-enterAddressStateOrRegion'
    );
    this.continueButton = page.getByRole('button', { name: /continue|use this address|deliver to this address/i });
    this.deliverToAddressButton = page.getByRole('button', { name: /deliver to this address/i });
  }

  async isCheckoutOrAddressPage(): Promise<boolean> {
    const urlMatch = /checkout|address|buy|signin|ap\/account/i.test(this.page.url());
    const formVisible = await this.fullNameInput.isVisible().catch(() => false);
    const loginVisible =
      (await this.page.locator('#ap_email').isVisible().catch(() => false)) ||
      (await this.page
        .getByRole('textbox', { name: /enter mobile number or email/i })
        .isVisible()
        .catch(() => false)) ||
      (await this.page
        .getByRole('heading', { name: /sign in or create account/i })
        .isVisible()
        .catch(() => false));
    return urlMatch || formVisible || loginVisible;
  }

  async fillDummyAddress(details: DummyCheckoutDetails): Promise<void> {
    await this.dismissOverlays();

    if (await this.fullNameInput.isVisible().catch(() => false)) {
      await this.fullNameInput.fill(details.fullName);
    }
    if (await this.phoneInput.isVisible().catch(() => false)) {
      await this.phoneInput.fill(details.phone);
    }
    if (await this.pincodeInput.isVisible().catch(() => false)) {
      await this.pincodeInput.fill(details.pincode);
    }
    if (await this.addressLineInput.isVisible().catch(() => false)) {
      await this.addressLineInput.fill(details.addressLine);
    }
    if (await this.cityInput.isVisible().catch(() => false)) {
      await this.cityInput.fill(details.city);
    }
    if (await this.stateDropdown.isVisible().catch(() => false)) {
      await this.stateDropdown.selectOption({ label: details.state }).catch(async () => {
        await this.stateDropdown.selectOption(details.state).catch(() => undefined);
      });
    }
  }

  async submitAddressStep(): Promise<void> {
    if (await this.deliverToAddressButton.isVisible().catch(() => false)) {
      await this.deliverToAddressButton.click();
      return;
    }
    if (await this.continueButton.first().isVisible().catch(() => false)) {
      await this.continueButton.first().click();
    }
  }
}
