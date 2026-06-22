---
name: run-tests
description: Executes the QA automation suite and produces structured test reports with Allure. Use when running tests, executing regression, verifying pass/fail, or reporting test results (pipeline stages 5 and 8).
---

# Run Tests (Test Execution)

**Canonical workflow:** `.cursor/skills/qa-pipeline/SKILL.md` — [stages 5 (Verify)](../qa-pipeline/SKILL.md#stage-5--verify-gate) and [8 (Report)](../qa-pipeline/SKILL.md#stage-8--report-gate).

## Persona

**QA lead** executing a structured test cycle. Read `QA-PERSONA.md`.

## Execution channel

Stage 5 Verify uses **CLI only** — `npx playwright test`. MCP `test_list` is for inventory; MCP `test_run` is not authoritative for pass/fail.

## Test cycle commands

```bash
# Full suite
npx playwright test

# P0 smoke
npx playwright test --grep @regression

# By category
npx playwright test --grep @positive
npx playwright test --grep @negative
npx playwright test --grep @edge

# By suite (see [spec & suite inventory](../qa-pipeline/SKILL.md#spec--suite-inventory-authoritative))
npx playwright test tests/amazon-in/search/
npx playwright test tests/amazon-in/professional/ --workers=1
npx playwright test tests/amazon-in/juicer/ --workers=1

# Debug
npx playwright test --headed --debug tests/amazon-in/search/search-positive.spec.ts
```

## Allure reporting (primary)

```bash
# Run + generate (suite-specific)
npm run test:professional:allure
npm run test:juicer:allure
npm run test:allure

# Stage 8: prepare history + generate (allure:generate runs prepare first)
npm run allure:prepare   # copies allure-report/history → allure-results/history
npm run allure:generate
npm run allure:open
```

Artifacts: `allure-results/` (stage 5), `allure-report/` + `allure-report/history/` (stage 8).

Stage 8 gate requires stage 7 passed, successful generate, retry/flaky notes — see [stage 8 Report gate](../qa-pipeline/SKILL.md#stage-8--report-gate).

History/trends, CI artifacts, categories, retry analytics: see [Allure & Reporting Strategy](../qa-pipeline/SKILL.md#allure--reporting-strategy).

Playwright HTML (`npx playwright show-report`) is supplementary only.

## Scalability

| Suite | Workers | Mode |
|-------|---------|------|
| `professional/`, `juicer/` | `--workers=1` | Serial hooks |
| `search/` | default | Parallel |
| CI | `workers=1` (config) | See `playwright.config.ts` |

See [scalability policy](../qa-pipeline/SKILL.md#scalability-policy) for throttling guidance.

## Report format

After every run:

```markdown
## Test Execution Summary

| Metric | Count |
|--------|-------|
| Total | X |
| Passed | X |
| Failed | X |
| Skipped/Fixme | X |

### Failures
| Scenario ID | Test Name | Failure Reason |
|-------------|-----------|----------------|
| TC-001 or SRCH-REG-001 | ... | ... |

### Artifacts
- allure-results/
- allure-report/index.html (after allure:generate)

### Next steps
- Failures → `heal-tests` (stage 6)
- All @regression pass → `review-tests` (stage 7)
```

## CI parity

```bash
CI=true npx playwright test --grep @regression --workers=1
```

Workflow: `.github/workflows/playwright-allure.yml`

## Exit criteria (stage 5 gate)

| Gate | Criteria |
|------|----------|
| Smoke | 100% `@regression` pass |
| Feature complete | All P1 scenarios pass |
| Release ready | Zero P0/P1 failures, P2 documented, stage 7 review passed |
