# Architecture

## Layered Test Architecture

```
┌─────────────────────────────────────────────────────────┐
│  tests/amazon-in/          Specs — orchestrate + assert │
├─────────────────────────────────────────────────────────┤
│  fixtures/auth.fixture.ts  Auth suites (extends amazon) │
│  fixtures/amazon.fixture.ts   Page object injection     │
│  fixtures/allure.fixture.ts   Allure metadata layer     │
├─────────────────────────────────────────────────────────┤
│  pages/amazon-in/          Page Object Model (POM)      │
│  pages/base.page.ts        Shared navigation/overlays   │
├─────────────────────────────────────────────────────────┤
│  reporting/allure/         Allure config, categories    │
├─────────────────────────────────────────────────────────┤
│  config/env.config.ts      Environment variables        │
│  config/test-data.ts       Stable test data from env    │
├─────────────────────────────────────────────────────────┤
│  .env / .env.staging       Secrets (gitignored)         │
│  .env.example              Committed template           │
└─────────────────────────────────────────────────────────┘
```

## Fixture Chain

```
allure.fixture.ts  →  amazon.fixture.ts  →  specs (guest flows)
                         ↑
                   auth.fixture.ts  →  specs (authenticated flows)
```

- **Guest / standard specs:** `import { test, expect } from '../../../fixtures/amazon.fixture'`
- **Authenticated specs:** `import { test, expect, AUTH_STATE_PATH, hasAuthState } from '../../../fixtures/auth.fixture'`
- `auth.fixture.ts` extends `amazon.fixture.ts` — Allure reporting is preserved for auth suites
- `expect` may be re-exported from `@playwright/test` in `auth.fixture.ts`; `test` always comes from the fixture chain

## Directory Layout

```
QA_Automation/
├── config/
│   ├── env.config.ts
│   └── test-data.ts
├── pages/
│   ├── base.page.ts
│   ├── index.ts
│   └── amazon-in/
│       ├── home.page.ts
│       ├── search-results.page.ts
│       ├── product.page.ts
│       ├── cart.page.ts
│       ├── pincode.page.ts
│       ├── login.page.ts
│       └── checkout.page.ts
├── fixtures/
│   ├── allure.fixture.ts
│   ├── amazon.fixture.ts
│   └── auth.fixture.ts
├── reporting/allure/         # Allure helpers (config, categories, metadata)
├── scripts/
│   ├── allure-prepare.mjs
│   └── allure-generate.mjs
├── specs/amazon-in/
├── tests/amazon-in/
│   ├── professional/         # Serial suite (rate-limit sensitive)
│   ├── juicer/               # Serial suite
│   └── search/               # Parallel (default)
├── .github/workflows/
│   └── playwright-allure.yml
├── .env.example
└── playwright.config.ts
```

## Page Object Model Rules

| Layer | Allowed | Forbidden |
|-------|---------|-----------|
| **Spec** | `await homePage.search()`, `expect(...)` | `page.locator()`, `page.click()` |
| **Page Object** | Locators, `async` action methods | `expect()` assertions |
| **Config** | URLs, credentials, test data | UI logic |

Overlay dismissal: use `BasePage` methods — not a separate seed spec file.

## Environment Management

```bash
npx playwright test
ENV_FILE=.env.staging npx playwright test
BASE_URL=https://www.amazon.in npx playwright test
```

| Variable | Purpose | Default |
|----------|---------|---------|
| `BASE_URL` | Application URL | `https://www.amazon.in` |
| `AMAZON_EMAIL` | Account tests | empty (skip) |
| `AMAZON_PASSWORD` | Account tests | empty (skip) |
| `DEFAULT_PINCODE` | Location tests | `110001` |
| `SEARCH_TERM_VALID` | Positive search | `books` |
| `ENV_FILE` | Which .env to load | `.env` |

## Guard Rules

Enforced via `.cursor/rules/guard-rules.mdc` (always apply). Precedence: see `sdlc-core.mdc`.

## Test Spec Example

```typescript
import { test, expect } from '../../../fixtures/amazon.fixture';
import { testData } from '../../../config/test-data';

test('valid search @regression @positive', async ({ homePage, searchResultsPage }) => {
  await homePage.open();
  await homePage.search(testData.search.valid);
  await expect(searchResultsPage.firstResult()).toBeVisible();
});
```

## Test Suite Organization

Authoritative inventory: [qa-pipeline/SKILL.md](../skills/qa-pipeline/SKILL.md#spec--suite-inventory-authoritative)

```
specs/amazon-in/                         tests/amazon-in/
├── professional-test-cases.md           ├── professional/  (serial)
├── juicer-flow.md                       ├── juicer/        (serial)
└── (feature plans as created)           └── search/        (parallel)
```

Tags: `@regression`, `@positive`, `@negative`, `@edge`

## Playwright Configuration

| Setting | Value | Source |
|---------|-------|--------|
| `baseURL` | `env.baseUrl` | `playwright.config.ts` |
| `headless` | `env.headless` | `playwright.config.ts` |
| `timeout` | 90s | `playwright.config.ts` |
| `trace` | retain-on-failure | `playwright.config.ts` |
| `screenshot` | only-on-failure | `playwright.config.ts` |
| `video` | retain-on-failure | `playwright.config.ts` |
| `fullyParallel` | true | `playwright.config.ts` |
| `workers` (CI) | 1 | `playwright.config.ts` |
| `retries` (CI) | 2 | `playwright.config.ts` |
| Reporters | html, allure-playwright, list | `playwright.config.ts` |

## Scalability

See [qa-pipeline/SKILL.md](../skills/qa-pipeline/SKILL.md#scalability-policy) for worker, serial suite, and throttling rules.

## Reporting

| Command | Purpose |
|---------|---------|
| `npm run allure:prepare` | Copy `allure-report/history/` → `allure-results/history/` (trends) |
| `npm run allure:generate` | Prepare + generate `allure-report/` from `allure-results/` |
| `npm run allure:open` | Open report in browser |
| `npm run test:professional:allure` | Run professional suite + generate report |
| `npm run test:juicer:allure` | Run juicer suite + generate report |
| `npx playwright show-report` | Supplementary Playwright HTML report |

CI uploads `allure-report`, `allure-history`, and `playwright-report` artifacts. Failure categories in `reporting/allure/categories.json`. CI retries (`retries: 2`) visible in Allure retry analytics.

Full contract: [qa-pipeline/SKILL.md](../skills/qa-pipeline/SKILL.md#allure--reporting-strategy).
