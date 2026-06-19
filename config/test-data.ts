import { env } from './env.config';

/**
 * Stable test data for Amazon.in scenarios.
 * Values come from env.config — never hardcode in specs or page objects.
 */
export const testData = {
  search: {
    valid: env.searchTermValid,
    partial: env.searchTermPartial,
    juicer: env.searchTermJuicer,
    noResults: env.searchTermNoResults,
    empty: '',
    whitespace: '   ',
    specialChars: '!!!@@@',
  },
  login: {
    invalidEmail: 'not-a-valid-email',
    invalidPassword: 'WrongPassword123!',
  },
  checkout: {
    fullName: 'Test User QA',
    phone: '9876543210',
    pincode: env.defaultPincode,
    addressLine: '42 Test Automation Lane, Sector 18',
    city: 'New Delhi',
    state: 'DELHI',
  },
  pincode: {
    valid: env.defaultPincode,
    validMumbai: '400001',
    validBangalore: '560001',
    invalid: '000000',
    invalidAlpha: 'abcde',
  },
  paths: {
    home: '/',
    cart: '/gp/cart/view.html',
  },
} as const;
