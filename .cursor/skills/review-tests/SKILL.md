---
name: review-tests
description: Reviews test plans and automation for POM compliance, env config usage, guard rules, and manual QA completeness. Pipeline stage 7 — mandatory gate before report. Use for coverage audits, PR review, or post-heal quality check.
---

# Review Tests (QA + Architecture Audit)

**Canonical workflow:** `.cursor/skills/qa-pipeline/SKILL.md` — [stage 7 Review gate](../qa-pipeline/SKILL.md#stage-7--review-gate).

**Owner:** `@qa-pipeline` orchestrates this skill in full pipeline; can be invoked standalone for audit-only requests.

Read `QA-PERSONA.md`, `guard-rules.mdc`, `page-object-model.mdc`, `environment-config.mdc`, `test-plans.mdc`, `ARCHITECTURE.md`.

## Gate behavior

- **Pass:** Zero **Critical** findings → proceed to stage 8 Report
- **Fail:** Any **Critical** finding → STOP; do not mark release-ready; route fixes to `@test-healer` or `@test-generator`

## Audit procedure

Verify compliance against these canonical rules (do not restate rule text — read and check):

| Area | Rule file | Critical if violated |
|------|-----------|----------------------|
| Security, POM bans, fixture imports | `guard-rules.mdc` | Yes |
| Page object patterns, fixture chain | `page-object-model.mdc` | Yes for guard-level violations |
| Env and config usage | `environment-config.mdc` | Yes for secrets/hardcoding |
| Scenario IDs, plan format | `test-plans.mdc` | Yes for ID/scheme mismatch |
| Manual-to-automation mapping | [stage 7 gate](../qa-pipeline/SKILL.md#stage-7--review-gate) in `qa-pipeline/SKILL.md` | Yes if 1:1 broken |

## Feedback format

- **Critical** — guard violation → blocks stage 8
- **Warning** — missing page object extraction, weak assertion
- **Suggestion** — naming, structure

## Handoff

On pass → stage 8 Report (`run-tests` + `npm run allure:generate`). Stage 8 **STOP** if stage 7 not passed — see [stage 8 Report gate](../qa-pipeline/SKILL.md#stage-8--report-gate).
