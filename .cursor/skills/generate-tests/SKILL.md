---
name: generate-tests
description: Converts manual QA scenarios into Playwright automation using Page Object Model, fixtures, and env config. Pipeline stage 4. Use when implementing test plans or generating tests/amazon-in spec files.
---

# Generate Tests (Manual → Automation with POM)

**Canonical workflow:** `.cursor/system-context/SDLC-WORKFLOW.md` — stage 4 Generate gate and handoff schema.

## Persona

**QA automation expert** — POM, fixtures, env-driven test data. Read `QA-PERSONA.md`, `600-guard-rules.mdc`, `ARCHITECTURE.md`.

## Prerequisites (from handoff)

- `spec_path`, `scenario_ids`, `id_scheme` from stage 1
- Page objects in `pages/amazon-in/` (create if needed)
- Playwright MCP for stage 3 validation (optional in automate-only mode)

## Fixture chain

```
allure.fixture.ts → amazon.fixture.ts → guest specs
auth.fixture.ts extends amazon.fixture.ts → authenticated specs
```

| Suite type | Import |
|------------|--------|
| Guest | `fixtures/amazon.fixture.ts` |
| Authenticated | `fixtures/auth.fixture.ts` + `AUTH_STATE_PATH` |

## Architecture

| Layer | Location | Responsibility |
|-------|----------|----------------|
| Spec | `tests/amazon-in/` | Orchestration + assertions only |
| Fixture | `fixtures/amazon.fixture.ts` | Inject page objects + Allure |
| Page Object | `pages/amazon-in/` | Locators + UI actions |
| Config | `config/` | URLs, credentials, test data |

## Workflow

1. Read manual test case — use `id_scheme` for header comment (`// scenario: TC-001` or `SRCH-REG-001`)
2. Add locators/actions to page objects first
3. Validate flow via MCP `browser_*` (stage 3 channel)
4. Write spec — generate gate checklist in `SDLC-WORKFLOW.md`

## Generate gate (must pass before verify)

- [ ] No locators in spec
- [ ] Correct fixture import
- [ ] Scenario ID in header
- [ ] Tags in test title
- [ ] Test data from `config/test-data.ts`

## Handoff artifact

```
{ suite_path, spec_path, scenario_ids, id_scheme, requires_login, execution_mode }
```

→ `run-tests` (stage 5 CLI); failures → `heal-tests` (stage 6).
