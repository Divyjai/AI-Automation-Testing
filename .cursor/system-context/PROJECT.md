# Project Context

## Overview

**QA_Automation** is a **complete QA automation project** for **[Amazon.in](https://www.amazon.in)**. It covers the full testing lifecycle — from manual scenario design through Playwright automation, execution, debugging, review, and Allure reporting.

Every agent and skill operates as a **senior scenario-based QA engineer** with:
- **Manual testing mastery** — test design techniques, exploratory testing, executable test cases
- **QA automation expertise** — Playwright, reliable scripts, maintainable suites

QA persona and standards: [QA-PERSONA.md](QA-PERSONA.md)

**Canonical workflow:** [qa-pipeline/SKILL.md](../skills/qa-pipeline/SKILL.md)  
**Agents and routing:** [AGENTS.md](../../AGENTS.md) at repository root.

## Application Under Test

| Field | Value |
|-------|-------|
| Site | Amazon.in |
| Base URL | `https://www.amazon.in` |
| Type | Ecommerce (browse, search, cart, account) |
| Locale | India (INR, pincode-based delivery) |

Feature scope and test matrix: [APPLICATION.md](APPLICATION.md)

## Test Coverage Goals

Every feature area must include:

| Category | Purpose | Tag |
|----------|---------|-----|
| **Regression** | P0 smoke — must pass every release | `@regression` |
| **Positive** | Valid inputs, happy-path journeys | `@positive` |
| **Negative** | Invalid inputs, error handling | `@negative` |
| **Edge** | Boundaries, empty states, special chars | `@edge` |

### Scenario IDs

Three valid schemes (one per spec file — see `test-plans.mdc` and [qa-pipeline/SKILL.md](../skills/qa-pipeline/SKILL.md)):
- **Feature:** `SRCH-REG-001` (matrix coverage)
- **Document:** `TC-001` (imported test documents)
- **Flow:** `JUICER-001` (sequential end-to-end journeys)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Test framework | Playwright Test (`@playwright/test` ^1.60) |
| Reporting | Allure (`allure-playwright`, `reporting/allure/`) |
| Language | TypeScript |
| Runtime | Node.js |
| Browser automation MCP | `playwright run-test-mcp-server` |
| MCP config | `.cursor/mcp.json` |
| CI | GitHub Actions — `.github/workflows/playwright-allure.yml` |

## Directory Layout

```
QA_Automation/
├── config/
├── pages/amazon-in/
├── fixtures/                   # allure → amazon → auth chain
├── reporting/allure/
├── specs/amazon-in/
├── tests/amazon-in/
├── allure-results/             # gitignored
├── allure-report/              # gitignored
├── .env.example
└── playwright.config.ts
```

## Key Conventions

- **Page Object Model** — locators/actions in `pages/`, never in specs
- **Fixtures** — import `test` from `fixtures/amazon.fixture.ts` (or `auth.fixture.ts`)
- **Environment** — all config via `config/env.config.ts`; secrets in `.env`
- **Guard rules** — `guard-rules.mdc` (highest precedence)
- **Workflow** — [qa-pipeline/SKILL.md](../skills/qa-pipeline/SKILL.md) is canonical for stages and gates
- Tags: `@regression`, `@positive`, `@negative`, `@edge`

## Environment Setup

```bash
cp .env.example .env
npm install
npx playwright install
```

## Test Execution

```bash
npx playwright test --grep @regression
npx playwright test tests/amazon-in/professional/ --workers=1
npm run test:professional:allure
npm run allure:open
```

## Boundaries

- Do not complete real payments or place live orders
- Do not commit credentials — use `.env` for optional account tests
- Prefer guest-user flows for regression
- Dismiss location/sign-in overlays via `BasePage` before assertions
- Resilient locators — Amazon DOM changes frequently
