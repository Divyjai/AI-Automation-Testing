import { type Locator, type Page } from '@playwright/test';
import { BasePage } from '../base.page';

export class LoginPage extends BasePage {
  readonly signInLink: Locator;
  readonly emailInput: Locator;
  readonly continueButton: Locator;
  readonly passwordInput: Locator;
  readonly signInSubmitButton: Locator;
  readonly otpInput: Locator;
  readonly otpSubmitButton: Locator;
  readonly accountLink: Locator;
  readonly errorMessage: Locator;
  readonly validationMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.signInLink = page.getByRole('link', { name: /sign in|hello.*account/i }).first();
    this.emailInput = page
      .locator('#ap_email')
      .or(page.getByRole('textbox', { name: /enter mobile number or email/i }));
    this.continueButton = page
      .locator('#continue input.a-button-input')
      .or(page.getByRole('button', { name: /^continue$/i }))
      .first();
    this.passwordInput = page.locator('#ap_password');
    this.signInSubmitButton = page.locator('#signInSubmit');
    this.otpInput = page.locator('#auth-mfa-otpcode, input[name="otpCode"], input[name="code"]');
    this.otpSubmitButton = page.locator('#auth-signin-button, input[type="submit"]');
    this.accountLink = page.locator('#nav-link-accountList');
    this.errorMessage = page.locator(
      '#auth-error-message-box, .a-alert-content, [class*="auth-error"]'
    );
    this.validationMessage = page.getByText(
      /valid email|valid mobile|enter a valid|incorrect password|problem/i
    );
  }

  async hasValidationFeedback(): Promise<boolean> {
    return (
      (await this.errorMessage.isVisible().catch(() => false)) ||
      (await this.validationMessage.isVisible().catch(() => false)) ||
      (await this.isSignInPromptVisible())
    );
  }

  async openLoginPage(): Promise<void> {
    await this.goto('/');
    await this.waitForReady();
    await this.openSignIn();
    await this.emailInput
      .or(this.page.getByRole('heading', { name: /sign in/i }))
      .first()
      .waitFor({ state: 'visible', timeout: 30_000 });
  }

  async isSignInPromptVisible(): Promise<boolean> {
    return (
      (await this.emailInput.isVisible().catch(() => false)) ||
      (await this.page
        .getByRole('heading', { name: /sign in/i })
        .isVisible()
        .catch(() => false))
    );
  }

  async attemptInvalidLogin(email: string, password: string): Promise<void> {
    await this.enterEmail(email);
    await this.page.waitForLoadState('domcontentloaded');

    if (await this.passwordInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await this.enterPassword(password);
      await this.page.waitForLoadState('domcontentloaded');
    }
  }

  async openSignIn(): Promise<void> {
    await this.signInLink.click();
  }

  async enterEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.continueButton.click();
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
    await this.signInSubmitButton.click();
  }

  async isOtpScreenVisible(): Promise<boolean> {
    return this.otpInput.isVisible().catch(() => false);
  }

  /** OTP is provided manually by the user at runtime — never from env or files */
  async enterOtp(otp: string): Promise<void> {
    await this.otpInput.fill(otp);
    await this.otpSubmitButton.click();
  }

  async loginWithCredentials(email: string, password: string): Promise<void> {
    await this.openSignIn();
    await this.enterEmail(email);
    await this.enterPassword(password);
  }

  async isLoggedIn(): Promise<boolean> {
    const accountVisible = await this.accountLink.isVisible().catch(() => false);
    const signInHidden = !(await this.signInLink.isVisible().catch(() => true));
    return accountVisible || signInHidden;
  }

  async saveAuthState(path: string): Promise<void> {
    await this.page.context().storageState({ path });
  }
}
