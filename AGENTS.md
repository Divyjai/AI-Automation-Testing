# QA_Automation — Agent Instructions

Complete QA automation for **[Amazon.in](https://www.amazon.in)** with a consolidated 4-agent pipeline.

**Canonical workflow:** [.cursor/skills/qa-pipeline/SKILL.md](.cursor/skills/qa-pipeline/SKILL.md)  
**Human entry:** this file. Routing authority: [.cursor/rules/sdlc-core.mdc](.cursor/rules/sdlc-core.mdc).

## Consolidated Agents (4 only)

| Agent | Role |
|-------|------|
| **`@qa-pipeline`** | **Start here** — orchestrates stages 1–8 |
| **`@test-planner`** | Stage 1 — convert documents to test cases |
| **`@test-generator`** | Stages 3–4 — execute + POM automation |
| **`@test-healer`** | Stage 6 — fix failing tests |

Stage 7 (Review): `review-tests` skill under `@qa-pipeline` — no fifth agent.

## Quick Start

```
@qa-pipeline Run pipeline on docs/input/my-test-cases.md
```

Pipeline: Plan → Login → Execute → Generate → Verify → Heal → Review → Report (Allure). Gate detail: [qa-pipeline skill](.cursor/skills/qa-pipeline/SKILL.md).

## Partial Invocation

| Task | Agent / skill |
|------|---------------|
| Full pipeline | `@qa-pipeline` |
| Only convert document | `@test-planner` |
| Automate existing specs / "automate my tests" | `@test-generator` |
| Only fix failures | `@test-healer` |
| Only run tests / Allure | `run-tests` skill |
| Only audit quality | `review-tests` skill |
| Login only | `@qa-pipeline` (stage 2) |

## Login & OTP

Summary: credentials in `.env`; OTP in chat only; session at `playwright/.auth/amazon-user.json`.

Details: [.cursor/system-context/LOGIN.md](.cursor/system-context/LOGIN.md)

## Architecture

- **Page Object Model** — `pages/amazon-in/`
- **Fixtures** — `allure.fixture.ts` → `amazon.fixture.ts` → `auth.fixture.ts`
- **Reporting** — Allure (`npm run allure:generate`)
- **Guard rules** — [.cursor/rules/guard-rules.mdc](.cursor/rules/guard-rules.mdc) (highest precedence)

## Setup

```bash
cp .env.example .env
npm install
npx playwright install
```

## Repository Layout

```
QA_Automation/
├── AGENTS.md                 ← you are here
├── docs/input/               ← place test case documents
├── specs/amazon-in/          ← manual test cases (stage 1 output)
├── tests/amazon-in/          ← automation (stage 4 output)
├── allure-report/            ← generated reports (stage 8)
├── playwright/.auth/         ← saved login session (gitignored)
└── .cursor/
    ├── system-context/       ← stable project knowledge
    ├── rules/                ← guard rules, POM, env
    ├── skills/               ← stage procedures (qa-pipeline/SKILL.md = canonical workflow)
    └── agents/               ← thin role boundaries
```

Place test documents in `docs/input/`, then run `@qa-pipeline` for end-to-end flow.
