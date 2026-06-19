---
name: review-tests
description: Reviews test plans and automation for POM compliance, env config usage, guard rules, and manual QA completeness. Pipeline stage 7 — mandatory gate before report. Use for coverage audits, PR review, or post-heal quality check.
---

# Review Tests (QA + Architecture Audit)

**Canonical workflow:** `.cursor/system-context/SDLC-WORKFLOW.md` — stage 7 Review gate.

**Owner:** `@qa-pipeline` orchestrates this skill in full pipeline; can be invoked standalone for audit-only requests.

Read `QA-PERSONA.md`, `600-guard-rules.mdc`, `300-page-object-model.mdc`, `400-environment-config.mdc`, `ARCHITECTURE.md`.

## Gate behavior

- **Pass:** Zero **Critical** findings → proceed to stage 8 Report
- **Fail:** Any **Critical** finding → STOP; do not mark release-ready; route fixes to `@test-healer` or `@test-generator`

## A. Guard Rules Compliance (Critical)

- [ ] No locators in spec files
- [ ] No hardcoded URLs, credentials, pincodes, or search terms
- [ ] Specs import `test` from `amazon.fixture.ts` (guest) or `auth.fixture.ts` (auth) per `600-guard-rules.mdc`
- [ ] Page objects have no `expect()` assertions
- [ ] `.env` not committed; `.env.example` updated if new vars added
- [ ] No `test.only` in committed code

## B. Page Object Model

- [ ] Specs orchestrate only — act via page methods, assert in spec
- [ ] Locators defined once in page objects
- [ ] New pages extend `BasePage`, registered in fixtures
- [ ] Repeated actions extracted to page methods

## C. Environment & Config

- [ ] Configurable values in `config/env.config.ts` / `config/test-data.ts`
- [ ] Account tests skip or guard when credentials missing
- [ ] `playwright.config.ts` uses `env.baseUrl`

## D. Manual Scenario Quality

- [ ] Scenario IDs match spec file (`TC-NNN` or `SRCH-REG-001` per `id_scheme`)
- [ ] Four categories, step tables
- [ ] 1:1 manual-to-automation mapping

## E. Reporting & Fixtures

- [ ] Specs use fixture chain (`allure` → `amazon` → spec)
- [ ] Auth suites extend chain via `auth.fixture.ts`
- [ ] Allure results generated on verify run

## Feedback Format

- **Critical** — guard violation → blocks stage 8
- **Warning** — missing page object extraction, weak assertion
- **Suggestion** — naming, structure

## Handoff

On pass → stage 8 Report (`run-tests` + `npm run allure:generate`). Stage 8 **STOP** if stage 7 not passed — see SDLC Report gate.
