import dotenv from 'dotenv';
import path from 'path';

/**
 * Load environment file based on ENV_FILE variable.
 * Examples: .env (default), .env.staging, .env.local
 */
const envFile = process.env.ENV_FILE ?? '.env';
dotenv.config({ path: path.resolve(__dirname, '..', envFile) });

function requireInCI(name: string, value: string | undefined): string {
  if (!value && process.env.CI) {
    throw new Error(`Missing required environment variable in CI: ${name}`);
  }
  return value ?? '';
}

export const env = {
  /** Target environment label: local | staging | production */
  environment: process.env.TEST_ENV ?? 'local',

  /** Application base URL — never hardcode in tests or page objects */
  baseUrl: process.env.BASE_URL ?? 'https://www.amazon.in',

  /** Optional account credentials — guest tests do not need these */
  amazonEmail: process.env.AMAZON_EMAIL ?? '',
  amazonPassword: process.env.AMAZON_PASSWORD ?? '',

  /** Default delivery pincode for location tests */
  defaultPincode: process.env.DEFAULT_PINCODE ?? '110001',

  /** Stable search terms — override via env if Amazon data changes */
  searchTermValid: process.env.SEARCH_TERM_VALID ?? 'books',
  searchTermPartial: process.env.SEARCH_TERM_PARTIAL ?? 'book',
  searchTermNoResults: process.env.SEARCH_TERM_NO_RESULTS ?? 'xyznonexistentproduct12345',
  searchTermJuicer: process.env.SEARCH_TERM_JUICER ?? 'juicer',

  /** Playwright execution */
  headless: process.env.HEADLESS !== 'false',
  slowMo: Number(process.env.SLOW_MO ?? '0'),
} as const;

/** Returns true when account credentials are configured */
export function hasAccountCredentials(): boolean {
  return Boolean(env.amazonEmail && env.amazonPassword);
}

/** Guard: ensure credentials exist before account tests */
export function requireAccountCredentials(): { email: string; password: string } {
  const email = requireInCI('AMAZON_EMAIL', env.amazonEmail);
  const password = requireInCI('AMAZON_PASSWORD', env.amazonPassword);
  if (!email || !password) {
    throw new Error(
      'Account credentials not configured. Set AMAZON_EMAIL and AMAZON_PASSWORD in .env'
    );
  }
  return { email, password };
}

export type EnvConfig = typeof env;
