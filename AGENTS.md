# QA_Automation — Agent Instructions

Complete QA automation for **[Amazon.in](https://www.amazon.in)** with a consolidated 4-agent pipeline.

**Canonical workflow:** [.cursor/system-context/SDLC-WORKFLOW.md](.cursor/system-context/SDLC-WORKFLOW.md)

## Consolidated Agents

| Agent | Role |
|-------|------|
| **`@qa-pipeline`** | **Start here** — orchestrates stages 1–8 |
| **`@test-planner`** | Stage 1 — convert documents to test cases |
| **`@test-generator`** | Stages 3–4 — execute + POM automation |
| **`@test-healer`** | Stage 6 — fix failing tests |

Stage 7 (Review): `review-tests` skill under `@qa-pipeline`.

## QA Pipeline

```
Plan → Login → Execute → Generate → Verify → Heal → Review → Report (Allure)
```

```
@qa-pipeline Run pipeline on docs/input/my-test-cases.md
```

## Login & OTP

- Credentials: `AMAZON_EMAIL`, `AMAZON_PASSWORD` in `.env`
- OTP: **you provide in chat** when the agent asks — never stored in files
- Session saved to `playwright/.auth/amazon-user.json`

Details: [.cursor/system-context/LOGIN.md](.cursor/system-context/LOGIN.md)

## Architecture

- **Page Object Model** — `pages/amazon-in/`
- **Fixtures** — `allure.fixture.ts` → `amazon.fixture.ts` → `auth.fixture.ts`
- **Reporting** — Allure (`npm run allure:generate`)
- **Guard rules** — `.cursor/rules/600-guard-rules.mdc` (highest precedence)

## Setup

```bash
cp .env.example .env
npm install
npx playwright install
```

| Intent | Agent |
|--------|-------|
| Full pipeline from document | `@qa-pipeline` |
| Automate existing specs | `@test-generator` |

Routing: exclusive priority table in `000-sdlc-core.mdc` and `SDLC-WORKFLOW.md`.

Place test documents in `docs/input/`, then run `@qa-pipeline` for end-to-end flow.
