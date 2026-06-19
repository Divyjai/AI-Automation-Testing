---
name: qa-pipeline
description: End-to-end QA pipeline — ingests test case documents, converts to human-readable test cases, logs into Amazon.in with manual OTP, executes via Playwright, generates POM automation, heals failures, reviews, and reports with Allure. Use when user provides a test document or asks to run the full pipeline.
---

# QA Pipeline (Document → Automation)

**Canonical workflow:** `.cursor/system-context/SDLC-WORKFLOW.md`

This skill triggers the pipeline. All stage definitions, gates, handoffs, execution channels, and reporting live in that document.

## Trigger

User provides a test case document OR asks to "run the pipeline", "automate my test cases", "execute and automate".

## Prerequisites

- `.env` configured (`AMAZON_EMAIL`, `AMAZON_PASSWORD` for login scenarios)
- Playwright MCP server running (stages 2–4)
- User available for OTP input during login (stage 2)

## Pipeline checklist

```
- [ ] Stage 1: Plan — plan-tests skill
- [ ] Stage 2: Login — MCP headed (if requires_login)
- [ ] Stage 3: Execute — MCP browser_*
- [ ] Stage 4: Generate — generate-tests skill
- [ ] Stage 5: Verify — CLI npx playwright test
- [ ] Stage 6: Heal — heal-tests skill (if failures)
- [ ] Stage 7: Review — review-tests skill (gate)
- [ ] Stage 8: Report — allure:generate + summary
```

## Agent delegation

| Stage | Delegate |
|-------|----------|
| 1 Plan | `@test-planner` |
| 4 Generate | `@test-generator` |
| 6 Heal | `@test-healer` |
| 7 Review | `review-tests` (orchestrated by `@qa-pipeline`) |
| All | `@qa-pipeline` orchestrates |

## Input / output paths

```
docs/input/           # User-provided test case documents
specs/amazon-in/      # Human-readable test cases (stage 1 output)
tests/amazon-in/      # Automation (stage 4 output)
allure-results/       # Stage 5 output
allure-report/        # Stage 8 output
playwright/.auth/     # Stage 2 output (gitignored)
```
