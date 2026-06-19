# AI SDLC Configuration

Complete QA automation for **Amazon.in** with a **consolidated 4-agent** architecture and end-to-end pipeline.

**Canonical workflow:** [system-context/SDLC-WORKFLOW.md](system-context/SDLC-WORKFLOW.md) — all stages, gates, handoffs, and reporting.

## Agents (4 only)

| Agent | Role |
|-------|------|
| **`qa-pipeline`** | **Primary** — orchestrates stages 1–8 |
| **`test-planner`** | Stage 1 — convert documents to manual test cases |
| **`test-generator`** | Stages 3–4 — execute + POM automation |
| **`test-healer`** | Stage 6 — debug and fix failures |

Stage 7 (Review) uses `review-tests` skill under `@qa-pipeline` — no fifth agent.

## Quick Start

```
@qa-pipeline Run the full pipeline on docs/input/my-test-cases.md
```

Pipeline stages (see SDLC-WORKFLOW.md for detail):

1. Plan → 2. Login → 3. Execute → 4. Generate → 5. Verify → 6. Heal → 7. Review → 8. Report (Allure)

## Structure

```
.cursor/
├── agents/                   ← 4 consolidated agents
├── skills/                   ← stage workflows (reference SDLC-WORKFLOW.md)
├── rules/                    ← guard rules, POM, env (precedence in 000-sdlc-core)
└── system-context/
    ├── SDLC-WORKFLOW.md      ← canonical pipeline (start here for workflow)
    └── ...
docs/input/                   ← place test case documents here
specs/amazon-in/              ← human-readable test cases (output)
tests/amazon-in/              ← automation (output)
allure-report/                ← generated reports (stage 8)
playwright/.auth/             ← saved login session (gitignored)
```

## Login + OTP

1. Set `AMAZON_EMAIL` and `AMAZON_PASSWORD` in `.env`
2. Pipeline opens headed browser (stage 2)
3. When OTP screen appears, agent asks you in chat
4. You reply with the OTP → agent completes login
5. Session saved for automated tests

See [LOGIN.md](system-context/LOGIN.md).

## Individual Agents (partial invocation)

| Task | Agent / skill |
|------|---------------|
| Full pipeline | `@qa-pipeline` |
| Only convert document | `@test-planner` |
| Automate existing specs / "automate my tests" | `@test-generator` |
| Only fix failures | `@test-healer` |
| Only run tests / Allure | `run-tests` skill |
| Only audit quality | `review-tests` skill |

Partial boundaries: [SDLC-WORKFLOW.md](system-context/SDLC-WORKFLOW.md#partial-agent-invocation-boundaries)
