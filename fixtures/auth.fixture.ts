import fs from 'fs';
import path from 'path';
import { test as amazonTest } from './amazon.fixture';

export const AUTH_STATE_PATH = path.resolve(__dirname, '../playwright/.auth/amazon-user.json');

/** Check if pipeline login has saved auth state */
export function hasAuthState(): boolean {
  return fs.existsSync(AUTH_STATE_PATH);
}

/**
 * Use for authenticated test suites:
 *
 * ```typescript
 * import { test, expect, AUTH_STATE_PATH, hasAuthState } from '../../../fixtures/auth.fixture';
 *
 * test.describe('Cart — Authenticated', () => {
 *   test.beforeAll(() => { test.skip(!hasAuthState(), 'Run qa-pipeline login first'); });
 *   test.use({ storageState: AUTH_STATE_PATH });
 *
 *   test('view cart when logged in @positive', async ({ cartPage }) => { ... });
 * });
 * ```
 */
export const test = amazonTest;
export { expect } from '@playwright/test';
