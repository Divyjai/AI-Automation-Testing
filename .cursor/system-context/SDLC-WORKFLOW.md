# AI SDLC Workflow — Amazon.in

> **Canonical source of truth** for pipeline stages, quality gates, handoffs, execution channels, and reporting.  
> Agents, skills, rules, and README files **must align with this document** — they reference it; they do not redefine workflow logic.

## Consolidated Agents (4 only — no duplicates)

| Agent | Role |
|-------|------|
| **`qa-pipeline`** | Orchestrator — stages 1–8 end-to-end |
| **`test-planner`** | Stage 1 only (plan) — partial invocation |
| **`test-generator`** | Stages 3–4 (execute + generate) — partial invocation |
| **`test-healer`** | Stage 6 (heal) — partial invocation |

**Review (stage 7)** is owned by `@qa-pipeline` using the `review-tests` skill — no fifth agent.

## Pipeline Stages

```
User Document (docs/input/)
        ↓
  @qa-pipeline
        ↓
┌────────────────────────────────────────────────────────────┐
│ 1. PLAN      — document → specs/amazon-in/*.md             │
│ 2. LOGIN     — .env credentials + OTP from user (MCP)      │
│ 3. EXECUTE   — manual QA via Playwright MCP browser_*      │
│ 4. GENERATE  — tests/amazon-in/**/*.spec.ts (POM)          │
│ 5. VERIFY    — npx playwright test (CLI — authoritative)   │
│ 6. HEAL      — fix failures (page objects first)             │
│ 7. REVIEW    — review-tests skill (guard/POM audit gate)     │
│ 8. REPORT    — summary + Allure artifacts                    │
└────────────────────────────────────────────────────────────┘
```

| Stage | Owner | Skill | Channel | Output artifact |
|-------|-------|-------|---------|-----------------|
| 1. Plan | `@test-planner` | `plan-tests` | Document + optional MCP explore | `specs/amazon-in/<feature>.md` |
| 2. Login | `@qa-pipeline` | — | MCP `browser_*` (headed) | `playwright/.auth/amazon-user.json` |
| 3. Execute | `@qa-pipeline` | — | MCP `browser_*` (headed) | Execution evidence per scenario |
| 4. Generate | `@test-generator` | `generate-tests` | MCP validate + file edit | `tests/amazon-in/<suite>/*.spec.ts` |
| 5. Verify | `@qa-pipeline` | `run-tests` | **CLI only** (`npx playwright test`) | Pass/fail + `allure-results/` |
| 6. Heal | `@test-healer` | `heal-tests` | CLI debug + MCP reproduce | Fixed specs/pages |
| 7. Review | `@qa-pipeline` | `review-tests` | Checklist audit | Review pass/fail |
| 8. Report | `@qa-pipeline` | `run-tests` | CLI + Allure scripts | Summary + `allure-report/` |

### Execution channel rules

| Channel | Allowed stages | Forbidden stages |
|---------|----------------|------------------|
| **MCP `browser_*`** | 2 Login, 3 Execute, 4 validation, 6 reproduction | 5 Verify, 8 Report |
| **CLI `npx playwright test`** | 5 Verify, 6 Heal verify loop, 8 Report prep | 2 Login (use MCP headed) |
| **MCP `test_run`** | Inventory only (`test_list`) | Authoritative pass/fail — use CLI for stage 5 |

## Agent Routing (exclusive — one primary agent)

Evaluate **top to bottom**; **first match wins**. Full table also in `000-sdlc-core.mdc`.

| Priority | User intent | Primary agent |
|----------|-------------|---------------|
| 1 | Full pipeline, end-to-end, test document + automate/heal/report | `@qa-pipeline` |
| 2 | Plan / convert document only (no automate) | `@test-planner` |
| 3 | Automate / generate / implement **existing** specs or plans | `@test-generator` |
| 4 | Fix / heal / debug failures | `@test-healer` |
| 5 | Login / OTP only | `@qa-pipeline` (stage 2) |
| 6 | Review / audit | `review-tests` skill |
| 7 | Run tests / regression / verify / Allure (no generate) | `run-tests` skill |

**Disambiguation:** *"Automate my tests"* → `@test-generator`. *"Run pipeline on my document"* → `@qa-pipeline`.

## Partial Agent Invocation Boundaries

| User intent | Start with | Runs | Must NOT run unless user asks |
|-------------|------------|------|-------------------------------|
| Full pipeline | `@qa-pipeline` | Stages 1–8 | — |
| Plan / convert document only | `@test-planner` | Stage 1 | Login, execute, generate, verify |
| Automate existing specs | `@test-generator` | Stages 3–4 (3 optional) | Full pipeline, login (unless auth scenarios) |
| Run tests / regression | `run-tests` skill | Stage 5 | Plan, generate, heal |
| Fix failures | `@test-healer` | Stage 6 | Plan, generate |
| Review / audit | `review-tests` skill | Stage 7 | — |
| Login only | `@qa-pipeline` | Stage 2 | Generate, verify |
| Report / Allure | `run-tests` + Allure scripts | Stage 8 | — |

**Orchestrator rule:** `@qa-pipeline` runs stages in order. Skip a stage only when the user explicitly requests partial execution.

## Skills Map

| Skill | Stage | Used by |
|-------|-------|---------|
| `qa-pipeline` | All | `@qa-pipeline` |
| `plan-tests` | 1 | `@test-planner`, pipeline |
| `generate-tests` | 4 | `@test-generator`, pipeline |
| `run-tests` | 5, 8 | Pipeline verify + report |
| `heal-tests` | 6 | `@test-healer`, pipeline |
| `review-tests` | 7 | `@qa-pipeline` (mandatory gate before report) |

## Artifact Handoff Schema

Every stage transition must pass these fields (explicit or inferable from paths):

| Field | Required | Example |
|-------|----------|---------|
| `feature` | Yes | `search`, `professional`, `juicer` |
| `spec_path` | Yes | `specs/amazon-in/professional-test-cases.md` |
| `suite_path` | After stage 4 | `tests/amazon-in/professional/` |
| `scenario_ids` | Yes | `TC-001` or `SRCH-REG-001` |
| `id_scheme` | Yes | `document`, `feature`, or `flow` (see Scenario ID Governance) |
| `requires_login` | Yes | `true` / `false` |
| `tags` | Yes | `@regression @positive` |
| `auth_state_path` | If login | `playwright/.auth/amazon-user.json` |
| `execution_mode` | For stage 5+ | `serial` or `parallel` (see scalability) |
| `verify_command` | Stage 5 | `npx playwright test tests/amazon-in/professional --workers=1` |

### Handoff chain

```
Plan   → { spec_path, scenario_ids, id_scheme, requires_login, tags }
Login  → { auth_state_path } (if requires_login)
Execute→ { execution evidence per scenario_id }
Generate → { suite_path, spec_path, scenario_ids }
Verify → { pass/fail counts, failure list, allure-results/ }
Heal   → { fixes applied, remaining failures }
Review → { critical/warning counts, gate pass/fail }
Report → { summary markdown, allure-report/ path }
```

## Scenario ID Governance

Three schemes — pick **one per spec file** and stay consistent:

| Scheme | `id_scheme` value | Format | When to use | Live example |
|--------|-------------------|--------|-------------|--------------|
| **Feature** (typed) | `feature` | `<FEATURE>-<TYPE>-<NNN>` | Greenfield matrix coverage (reg/pos/neg/edge) | `SRCH-REG-001` in `search/` |
| **Document** (imported) | `document` | `TC-NNN` | External test documents (Word, Excel) | `TC-001` in `professional/` |
| **Flow** (sequential) | `flow` | `<FLOWKEY>-<NNN>` | End-to-end user journeys, ordered steps | `JUICER-001` in `juicer/` |

**TYPE codes** (feature scheme only): `REG`, `POS`, `NEG`, `EDGE`  
**FLOWKEY** (flow scheme): short uppercase feature key e.g. `JUICER`, `CHECKOUT`

**Rules:**
- Spec overview declares `id_scheme: document | feature | flow`
- Spec file comment must match: `// scenario: TC-001`, `SRCH-REG-001`, or `JUICER-003`
- Do not mix schemes within a single spec file
- Handoff must include `id_scheme` so verify/heal/review map failures correctly

## Spec & Suite Inventory (authoritative)

### Manual specs (`specs/amazon-in/`)

| File | Suite | ID scheme |
|------|-------|-----------|
| `professional-test-cases.md` | `tests/amazon-in/professional/` | `document` (`TC-NNN`) |
| `juicer-flow.md` | `tests/amazon-in/juicer/` | `flow` (`JUICER-NNN`) |
| `search.md` | `tests/amazon-in/search/` | `feature` (`SRCH-REG-001`, etc.) |

### Automated suites (`tests/amazon-in/`)

| Folder | Mode | Hooks |
|--------|------|-------|
| `professional/` | Serial | `professional.hooks.ts` |
| `juicer/` | Serial | `juicer.hooks.ts` |
| `search/` | Parallel (default) | — |

## Quality Gates (pass/fail blockers)

### Stage 1 — Plan gate

**Pass when all true; otherwise STOP — do not proceed to login.**

- [ ] Human-readable test cases with scenario IDs
- [ ] `id_scheme` declared in spec overview
- [ ] Login flag on authenticated scenarios
- [ ] Four categories per feature (`@regression`, `@positive`, `@negative`, `@edge`)
- [ ] User confirmed plan (pipeline only)

### Stage 2 — Login gate

**Pass when all true; otherwise STOP — do not execute authenticated scenarios.**

- [ ] Login required only when `requires_login: true` on any scenario (else skip stage)
- [ ] `AMAZON_EMAIL` and `AMAZON_PASSWORD` present in `.env` when login required
- [ ] Headed MCP login completed OR user explicitly skips auth scenarios per `LOGIN.md`
- [ ] Auth state saved to `playwright/.auth/amazon-user.json` when login succeeds
- [ ] OTP handled manually — never stored in env/code

**STOP when:** login required but credentials missing, OTP failed twice without approved skip, or user aborts.

### Stage 3 — Execute gate

**Pass when all true; otherwise STOP — do not generate automation.**

- [ ] Every planned scenario executed via MCP `browser_*` (headed)
- [ ] Pass/fail recorded per `scenario_id` with execution evidence
- [ ] App defects noted separately from execution failures
- [ ] Auth state loaded for scenarios with `requires_login: true`

**STOP when:** unexecuted scenarios remain without user-approved skip, or blocking app defect prevents all remaining scenarios.

### Stage 4 — Generate gate

**Pass when all true; otherwise STOP — do not verify.**

- [ ] POM compliance (no locators in specs)
- [ ] Imports from `fixtures/amazon.fixture.ts` (or `auth.fixture.ts` for auth suites)
- [ ] Scenario ID in spec header comment
- [ ] Page objects exist for all interactions

### Stage 5 — Verify gate

**Pass when all true; otherwise proceed to stage 6 (heal).**

- [ ] Target suite passes at 100% OR failures are triaged
- [ ] `@regression` scenarios pass for release readiness
- [ ] Auth state valid or re-login performed
- [ ] `allure-results/` generated (Allure reporter in `playwright.config.ts`)

### Stage 6 — Heal gate

**Pass when all true; otherwise STOP at fixme with defect notes.**

- [ ] Each failure triaged (test bug / app defect / environment / data)
- [ ] Max 3 heal iterations per scenario; then escalate to user
- [ ] No guard rule violations introduced
- [ ] Re-verify via CLI after each fix

### Stage 7 — Review gate

**Pass when zero Critical findings; otherwise STOP — do not report as release-ready.**

Run `review-tests` skill checklist. **Critical** = guard violation (locator in spec, hardcoded secret, wrong fixture import).

- [ ] Guard rules compliance
- [ ] POM structure
- [ ] Env/config usage
- [ ] Manual-to-automation 1:1 mapping

### Stage 8 — Report gate

**Pass when all true; otherwise STOP — report is not release-ready.**

- [ ] **Stage 7 Review gate passed** (zero Critical findings)
- [ ] `npm run allure:generate` completed successfully (includes `allure:prepare`)
- [ ] `allure-report/index.html` exists and opens without error
- [ ] `allure-results/` contains result JSON from stage 5 verify run
- [ ] Summary delivered with: stage status table, pass/fail/skip counts, **retry count**, review outcome
- [ ] Failure list maps each failure to `scenario_id` (per `id_scheme`)
- [ ] Artifacts paths listed: specs, tests, auth (if used), `allure-report/`, `allure-report/history/`
- [ ] Flaky or retried tests called out when retries > 0 (CI `retries: 2` or local re-runs)

**STOP when:** stage 7 not passed, `allure:generate` failed, verify produced zero results for a non-empty suite, or unresolved Critical review findings.

## Allure & Reporting Strategy

Reporting is part of the SDLC — not optional HTML-only output.

| Step | Command | When |
|------|---------|------|
| Run with results | `npx playwright test <suite> --workers=1` | Stage 5 |
| Prepare history | `npm run allure:prepare` | Before generate (auto in `allure:generate`) |
| Generate report | `npm run allure:generate` | Stage 8 |
| Open report | `npm run allure:open` | User request |
| Suite + report | `npm run test:professional:allure` / `test:juicer:allure` / `test:allure` | Stage 5+8 combined |
| CI | `.github/workflows/playwright-allure.yml` | CI parity |

### History preservation & trends

- `scripts/allure-prepare.mjs` copies `allure-report/history/` → `allure-results/history/` before generate
- Enables **trend charts** and cross-run comparisons in `allure-report/`
- First local run seeds history; subsequent runs build trends
- **CI:** workflow downloads `allure-history` artifact → `allure-report/history/` before tests, uploads updated `allure-history` after generate (retention 30 days)

### CI artifacts (`.github/workflows/playwright-allure.yml`)

| Artifact | Path | Purpose |
|----------|------|---------|
| `allure-report` | `allure-report/` | Full HTML report for stakeholders |
| `allure-history` | `allure-report/history/` | Trend data for next CI run |
| `playwright-report` | `playwright-report/` | Supplementary HTML (14-day retention) |

CI writes `allure-results/executor.json` with build URL via `allure:prepare` when `CI=true`.

### Retry analytics & flaky visibility

- **Retries:** `playwright.config.ts` sets `retries: 2` in CI — Allure shows retry attempts per test
- **Categories:** `reporting/allure/categories.json` classifies failures (product defect, test defect, infrastructure, auth)
- **Flaky detection:** tests that pass after retry appear in Allure with retry history; stage 8 summary must note any test that failed on first attempt
- **Environment metadata:** `reporting/allure/` builds environment info (browser, base URL, project) into report header

**Fixture chain for reporting:** `allure.fixture.ts` → `amazon.fixture.ts` → specs. Auth suites: `auth.fixture.ts` extends `amazon.fixture.ts` (Allure metadata preserved).

**Stage 8 summary must reference:** `allure-results/`, `allure-report/index.html`, `allure-report/history/`, retry/flaky notes, and CI artifact names when applicable.

Playwright HTML report (`npx playwright show-report`) is supplementary — not the primary stakeholder report.

## Scalability Policy

| Setting | Value | Source |
|---------|-------|--------|
| `fullyParallel` | `true` | `playwright.config.ts` — default for independent suites |
| `workers` (local) | undefined (Playwright default) | Use `--workers=1` for Amazon-sensitive suites |
| `workers` (CI) | `1` | `playwright.config.ts` |
| `timeout` | 90s | `playwright.config.ts` |
| `retries` (CI) | 2 | `playwright.config.ts` |

### When to run serial (`test.describe.configure({ mode: 'serial' })`)

- Suite shares cart/session state (`professional/`, `juicer/`)
- Amazon rate-limit or 503 errors observed
- User runs full feature flow end-to-end in one session

### Throttling mitigation

- Prefer `--workers=1` for `professional/` and `juicer/`
- Use suite-level hooks (`*.hooks.ts`) for serial mode
- Add backoff in page objects only when throttling is confirmed — not preemptively in every test
- Document throttle skips in heal stage as **environment** category

## Login & OTP

See [LOGIN.md](LOGIN.md). OTP is **never** automated — user provides in chat during stage 2.

## Quick Commands

| User Intent | Start With |
|-------------|------------|
| Run pipeline on test doc (end-to-end) | `@qa-pipeline` |
| Convert document to test cases only | `@test-planner` |
| Automate existing scenarios / "automate my tests" | `@test-generator` |
| Fix failing tests | `@test-healer` |
| Run regression / Allure | `run-tests` skill |
| Audit automation quality | `review-tests` skill (stage 7) |
| Login to Amazon | `@qa-pipeline` (stage 2 only) |

## Coverage Requirements

Every feature: `@regression`, `@positive`, `@negative`, `@edge` per [APPLICATION.md](APPLICATION.md).
