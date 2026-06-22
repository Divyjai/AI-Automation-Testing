---
name: heal-tests
description: Debugs failing tests using manual QA reproduction techniques then fixes automation. Pipeline stage 6. Use when tests fail, are flaky, or when validating whether a failure is a test bug or application defect.
---

# Heal Tests (Debug Like a Manual Tester)

**Canonical workflow:** `.cursor/skills/qa-pipeline/SKILL.md` — [stage 6 Heal gate](../qa-pipeline/SKILL.md#stage-6--heal-gate).

## Persona

**Senior QA engineer** — observe, isolate, confirm, fix. Read `QA-PERSONA.md`.

## Heal gate (pass/fail)

**Pass when:**
- Each failure triaged (test bug / app defect / environment / data)
- Max 3 heal iterations per scenario; then escalate to user
- No guard rule violations introduced
- Re-verify via **CLI** after each fix

**Stop when:** App defect confirmed → `test.fixme()` with defect note; do not loop indefinitely.

## Workflow

### 1. Triage

| Category | Meaning | Action |
|----------|---------|--------|
| Test bug | Script/locator/timing issue | Fix automation |
| App defect | Application behavior changed or broken | `test.fixme()` + defect note |
| Environment | Network, overlay, throttle/503 | Stabilize, `--workers=1`, or skip with reason |
| Data | Stale search term, out-of-stock product | Update test data |

### 2. Manual reproduction

1. `npx playwright test --headed --debug` or MCP `browser_*` at failure point
2. Compare actual UI vs manual expected result from spec
3. Capture snapshot at failure

### 3. Fix priority

1. Page objects (`pages/amazon-in/`)
2. Test data (`config/test-data.ts`)
3. Auth state — re-run `@qa-pipeline` stage 2 if session expired
4. Specs — assertions only, never add locators

### 4. Verify

Re-run failing scenario via CLI. One failure at a time.

### 5. Defect documentation

```typescript
// DEFECT: <description> — reported YYYY-MM-DD
test.fixme('...', async ({ ... }) => { ... });
```

## Handoff

On heal gate pass → stage 5 re-verify (CLI) → stage 7 `review-tests`.
