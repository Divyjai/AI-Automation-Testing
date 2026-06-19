import { test as base } from './allure.fixture';
import {
  HomePage,
  SearchResultsPage,
  ProductPage,
  CartPage,
  PincodePage,
  LoginPage,
  CheckoutPage,
} from '../pages';

type AmazonPageFixtures = {
  homePage: HomePage;
  searchResultsPage: SearchResultsPage;
  productPage: ProductPage;
  cartPage: CartPage;
  pincodePage: PincodePage;
  loginPage: LoginPage;
  checkoutPage: CheckoutPage;
};

/**
 * Extended test with Amazon.in page objects injected as fixtures.
 * Import { test, expect } from '../../fixtures/amazon.fixture' in spec files.
 */
export const test = base.extend<AmazonPageFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  searchResultsPage: async ({ page }, use) => {
    await use(new SearchResultsPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  pincodePage: async ({ page }, use) => {
    await use(new PincodePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
});

export { expect } from './allure.fixture';
