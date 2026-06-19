// spec: specs/amazon-in/professional-test-cases.md
// scenario: TC-010

import './professional.hooks';
import { test, expect } from '../../../fixtures/amazon.fixture';
import { testData } from '../../../config/test-data';

test.describe('TC-010 — Invalid Login', () => {
  test('invalid credentials show validation message @negative', async ({ loginPage }) => {
    // Step 1: Open login page
    await loginPage.openLoginPage();
    await expect(loginPage.emailInput).toBeVisible();

    // Step 2: Enter invalid email/phone and submit
    await loginPage.attemptInvalidLogin(
      testData.login.invalidEmail,
      testData.login.invalidPassword
    );

    // Step 3: Verify appropriate validation message is shown
    expect(await loginPage.hasValidationFeedback()).toBeTruthy();
  });
});
