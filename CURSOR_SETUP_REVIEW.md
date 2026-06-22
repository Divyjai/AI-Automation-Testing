# Cursor Setup Review — QA_Automation

**Reviewer role:** Senior Cursor AI Architect (25+ years software engineering; AI-assisted SDLC, Cursor rules architecture, QA automation, secure coding, token optimization)  
**Repository:** `QA_Automation` — Amazon.in Playwright QA automation  
**Review date:** June 10, 2026 (post-remediation re-audit)  
**Scope:** `.cursor/` folder, root `AGENTS.md`, and related governance references  
**Mode:** Review and recommendations only — **no changes made to existing setup**

---

## Executive Summary

This repository implements a **purpose-built, QA-centric Cursor configuration** with a consolidated 4-agent SDLC pipeline. Compared to the prior audit, **critical structural defects have been resolved**:

| Prior issue | Current status |
|-------------|----------------|
| Missing `LOGIN.md` | **Fixed** — `system-context/LOGIN.md` (56 lines) |
| `500-guardrils.mdc` / broken guard-rules refs | **Fixed** — `rules/guard-rules.mdc` (60 lines) |
| `SDLC-WORKFLOW.md` in wrong folder | **Fixed** — moved to `workflows/SDLC-WORKFLOW.md` (327 lines) |
| `qa-pipeline.md` token bloat (362 lines) | **Fixed** — slimmed to 67 lines |
| Stale 5-step `docs/input/README.md` | **Fixed** — 8-stage + SDLC link |
| `review-tests` restating full guard checklists | **Fixed** — rule-reference audit table (39 lines) |
| Triple entry-point duplication | **Mostly fixed** — `.cursor/README.md` → pointer to `AGENTS.md` |

The setup now **passes the primary reliability test**: Cursor can resolve canonical files, follow a documented precedence chain, and load the right context at the right time.

**Remaining gaps** are optimization-level: POM/security guidance still appears in 4–5 places (acceptable with precedence), `workflows/` sits outside the strict 4-pillar model (justified), and several enterprise template files (database-context, api-testing skill, BA agent) are correctly **absent** for this UI-only QA project.

**Current setup quality score: 8.6 / 10**

---

## 1. Complete Inventory

### Files inside `.cursor/` (24 files) + root governance

| File Name | Current Location | Type | Approx Purpose | Keep / Merge / Move / Delete |
| --------- | ---------------- | ---- | -------------- | ---------------------------- |
| `PROJECT.md` | `system-context/` | system-context | Project identity, tech stack, conventions | **Keep as-is** — agent table removed; links to AGENTS |
| `APPLICATION.md` | `system-context/` | system-context | Amazon.in feature scope, test matrix, stable data | **Keep as-is** |
| `ARCHITECTURE.md` | `system-context/` | system-context | Layered test architecture, fixture chain, Allure | **Keep as-is** |
| `QA-PERSONA.md` | `system-context/` | system-context | QA mindset, design techniques, communication | **Keep as-is** — SDLC subordination added |
| `LOGIN.md` | `system-context/` | system-context | OTP/login procedure, recovery, auth prerequisites | **Keep as-is** |
| `SDLC-WORKFLOW.md` | `workflows/` | workflow | Canonical 8-stage pipeline, gates, handoffs, Allure | **Keep as-is** |
| `sdlc-core.mdc` | `rules/` | rule (alwaysApply) | Routing, precedence, partial invocation | **Keep as-is** |
| `guard-rules.mdc` | `rules/` | rule (alwaysApply) | Security + POM + env hard constraints | **Keep as-is** |
| `playwright-tests.mdc` | `rules/` | rule (glob: tests) | Spec authoring standards | **Keep as-is** |
| `test-plans.mdc` | `rules/` | rule (glob: specs) | Manual plan format + ID schemes | **Keep as-is** |
| `page-object-model.mdc` | `rules/` | rule (glob: tests/pages/fixtures) | POM patterns, fixture chain examples | **Keep as-is** |
| `environment-config.mdc` | `rules/` | rule (glob: config/playwright) | Env loading, `.env` management | **Keep as-is** |
| `qa-pipeline.md` | `agents/` | agent | Pipeline orchestrator persona (67 lines) | **Keep as-is** |
| `test-planner.md` | `agents/` | agent | Stage 1 planner persona (39 lines) | **Keep as-is** |
| `test-generator.md` | `agents/` | agent | Stages 3–4 automation persona (39 lines) | **Keep as-is** — model thin agent |
| `test-healer.md` | `agents/` | agent | Stage 6 healer persona (56 lines) | **Keep as-is** |
| `qa-pipeline/SKILL.md` | `skills/qa-pipeline/` | skill | Pipeline trigger checklist (54 lines) | **Keep as-is** |
| `plan-tests/SKILL.md` | `skills/plan-tests/` | skill | Stage 1 planning procedure (50 lines) | **Keep as-is** |
| `generate-tests/SKILL.md` | `skills/generate-tests/` | skill | Stage 4 automation procedure (62 lines) | **Keep as-is** |
| `heal-tests/SKILL.md` | `skills/heal-tests/` | skill | Stage 6 debug/heal procedure (61 lines) | **Keep as-is** |
| `run-tests/SKILL.md` | `skills/run-tests/` | skill | Stages 5+8 execution + Allure (115 lines) | **Keep but shorten** — move command blocks to SDLC appendix |
| `review-tests/SKILL.md` | `skills/review-tests/` | skill | Stage 7 audit via rule references (39 lines) | **Keep as-is** |
| `README.md` | `.cursor/` | entry pointer | Points to root `AGENTS.md` | **Keep as-is** |
| `mcp.json` | `.cursor/` | MCP config | Playwright test MCP server | **Keep as-is** |
| `AGENTS.md` | repository root | entry / routing | Human onboarding, agent table, quick start | **Keep as-is** — minor dedup with PROJECT possible |
| `docs/input/README.md` | `docs/input/` | task-specific | Input doc guide + 8-stage pipeline | **Keep as-is** |

### Classification summary

| Action | Count |
|--------|-------|
| Keep as-is | 22 |
| Keep but shorten | 1 (`run-tests/SKILL.md`) |
| Move | 0 |
| Merge | 0 (optional minor merges) |
| Delete later | 0 whole files |
| Needs review | 0 critical |

**Total instruction surface:** ~1,750 lines across governance files (down from ~2,100 pre-fix).

---

## 2. Folder Structure Review

### Current structure

```text
.cursor/
├── system-context/     (5 files — stable project knowledge)
├── workflows/          (1 file — procedural pipeline)
├── rules/              (6 .mdc files — flat, numbered)
├── skills/             (7 skills — stage-aligned)
├── agents/             (4 agents — thin personas)
├── README.md           (pointer to AGENTS.md)
└── mcp.json            (MCP config)
```

### Assessment table

| Current Folder | Issue Found | Recommended Action | Reason |
| -------------- | ----------- | ------------------ | ------ |
| `system-context/` | Clean; no workflow file anymore | **Keep** | Matches folder contract |
| `workflows/` | Outside strict 4-pillar model (`system-context`, `rules`, `skills`, `agents`) | **Keep** — optional 5th bucket | Procedural SDLC correctly separated from stable context |
| `rules/` | Flat numbered files; no `guardrails/` subfolder | **Keep** — optional subfolders later | Numbered precedence works; globs correct |
| `skills/` | Stage-based, not domain-based (`ui-testing`, `api-testing`) | **Keep** | Correct for single-purpose QA pipeline project |
| `agents/` | 4 consolidated agents — no BA/developer/security agents | **Keep** | Scope-appropriate; no bloat |
| `commands/` | **Does not exist** | **Do not create** unless repeatable shortcuts needed | Routing via `@agent` + skills is sufficient |
| `.cursor/README.md` | Thin pointer only | **Keep** | Correct dedup pattern |
| `mcp.json` at `.cursor/` root | Not in 4 pillars | **Keep** | Standard Cursor MCP placement |

### Structure verdict

**Clean and logical.** The `workflows/` folder is a justified extension — it prevents mixing procedural pipeline logic with stable `system-context/`. Do not force SDLC back into `system-context/`.

---

## 3. Files Recommended for Deletion Later

No whole files warrant deletion. Prior critical candidates (`LOGIN.md` gap, bloated `qa-pipeline.md`, misnamed guard file) have been remediated.

| File | Current Location | Why It Should Be Deleted | Replace With / Merge Into | Deletion Priority |
| ---- | ---------------- | ------------------------ | ------------------------- | ----------------- |
| — | — | No file meets deletion threshold post-fix | — | — |

### Optional consolidation (not deletion)

| Content block | Location | Recommendation | Priority |
|---------------|----------|----------------|----------|
| Setup commands (`npm install`, etc.) | `AGENTS.md` + `PROJECT.md` | Keep in `PROJECT.md` only; AGENTS links to PROJECT | **Low** |
| 4-agent table | `SDLC-WORKFLOW.md` + `AGENTS.md` + `sdlc-core.mdc` | Keep in `000` (routing) + `AGENTS.md` (human); remove from SDLC header | **Low** |
| Partial invocation table | `sdlc-core.mdc` + `SDLC-WORKFLOW.md` | Keep in SDLC (workflow); `000` keeps abbreviated version | **Low** |

---

## 4. Duplicate Content Review

### Principle applied

```text
One concept → one source of truth.
Lower-priority files reference; they do not restate.
```

| Duplicate Topic | Files Involved | Problem | Recommended Source of Truth | Action |
| --------------- | -------------- | ------- | --------------------------- | ------ |
| Agent routing (exclusive) | `sdlc-core.mdc`, `SDLC-WORKFLOW.md` (now links to 000) | Was duplicated; now mostly fixed | `sdlc-core.mdc` | **Done** — SDLC defers to 000 |
| 8-stage pipeline | `SDLC-WORKFLOW.md`, `AGENTS.md`, `qa-pipeline/SKILL.md` | Summary duplication (~15%) | `SDLC-WORKFLOW.md` | Acceptable — entry docs need one-liner |
| 4-agent registry | `000`, `AGENTS.md`, `SDLC-WORKFLOW.md` header | ~20% overlap | `000` (machine) + `AGENTS.md` (human) | Optional: remove agent table from SDLC lines 7–16 |
| POM / fixture chain | `guard-rules`, `page-object-model`, `playwright-tests`, `ARCHITECTURE.md`, `generate-tests` | ~25% overlap | `guard-rules` = bans; `page-object-model` = patterns; `playwright-tests` = spec format | Reference-only in ARCHITECTURE/skills |
| Security / OTP policy | `guard-rules`, `LOGIN.md`, `AGENTS.md` summary | ~15% overlap | `guard-rules` = enforcement; `LOGIN.md` = procedure | Acceptable split |
| Scenario ID schemes | `test-plans.mdc`, `PROJECT.md`, agents | ~15% overlap | `test-plans.mdc` | Others reference `200` only |
| Tech stack + directory | `PROJECT.md`, `ARCHITECTURE.md` | ~20% overlap | `ARCHITECTURE.md` = technical depth; `PROJECT.md` = overview | Optional: PROJECT links to ARCHITECTURE for layout |
| QA lifecycle | `QA-PERSONA.md`, `SDLC-WORKFLOW.md` | Was conflicting; now subordinated | `SDLC-WORKFLOW.md` | **Done** — QA-PERSONA line 8 defers to SDLC |
| Setup commands | `AGENTS.md`, `PROJECT.md` | ~10% overlap | `PROJECT.md` | AGENTS can link instead of repeat |
| Review audit checklist | `review-tests`, rules | Was ~40%; now rule-reference table | `600`, `300`, `400`, `200` | **Done** |
| Orchestrator workflow body | `qa-pipeline.md`, `SDLC-WORKFLOW.md` | Was ~50%; now ~5% | `SDLC-WORKFLOW.md` | **Done** |

---

## 5. Token Optimization Plan

### Standards applied

```text
Always-loaded rules: short, strict, < 100–150 lines
System context: detailed, not repeated elsewhere
Agents: workflow boundaries, not full project knowledge
Skills: capability procedures, not business context
Commands: optional and minimal
```

| File | Token Issue | Recommendation | Priority |
| ---- | ----------- | -------------- | -------- |
| `workflows/SDLC-WORKFLOW.md` (327 lines) | Large but sole workflow authority | Keep; load on pipeline tasks only — not alwaysApply | **Low** (necessary) |
| `run-tests/SKILL.md` (115 lines) | Command blocks + report template | Move npm command reference to SDLC appendix; skill keeps gate + "read SDLC" | **Medium** |
| `APPLICATION.md` (150 lines) | Detailed feature matrix | Keep — load on planning only | **Low** |
| `ARCHITECTURE.md` (165 lines) | Detailed layout | Keep — load on codegen/heal only | **Low** |
| `sdlc-core.mdc` (67 lines) | alwaysApply — appropriate | Keep | **None** |
| `guard-rules.mdc` (60 lines) | alwaysApply — appropriate | Keep | **None** |
| `agents/qa-pipeline.md` (67 lines) | Was 362 lines | **Fixed** — model thin agent | **Done** |
| `AGENTS.md` (79 lines) | Minor overlap with PROJECT | Link to PROJECT for setup | **Low** |
| `page-object-model.mdc` (115 lines) | Examples add tokens on glob match | Keep examples — high value when editing tests | **Low** |

**Estimated recoverable token reduction (remaining):** 5–10% — mostly from `run-tests` shortening and optional SDLC header trim.

**Estimated reduction already achieved:** ~25–30% from prior remediation.

---

## 6. Always-Considered Rule Files

### Mapping to recommended always-rules

| Recommended Always Rule | Existing File Mapping | Keep / Rewrite / Merge / Delete | Reason |
| ----------------------- | --------------------- | ------------------------------- | ------ |
| `global-rules.md` | `sdlc-core.mdc` | **Keep** | Routing, precedence, partial invocation — 67 lines |
| `security-guardrails.md` | `guard-rules.mdc` (Security Guards section) | **Keep** | OTP, credentials, `.env` — alwaysApply |
| `testing-guardrails.md` | `guard-rules.mdc` (Architecture + Test Spec sections) | **Keep** | POM, fixtures, tags — alwaysApply |
| `coding-standards.md` | `100` + `300` (glob-scoped) | **Keep split** | Load only when editing tests/pages — correct |
| `folder-structure-rules.md` | Partially in `ARCHITECTURE.md` + `600` | **Keep as context + guards** | No separate file needed |
| `documentation-rules.md` | `test-plans.mdc` (glob: specs) | **Keep** | Plan format — task-specific glob |

### Files that should NOT be always loaded

| File | Why |
|------|-----|
| `workflows/SDLC-WORKFLOW.md` | 327 lines — pipeline/multi-stage only |
| `APPLICATION.md` | 150 lines — planning/coverage tasks |
| `ARCHITECTURE.md` | 165 lines — automation/architecture tasks |
| `QA-PERSONA.md` | 106 lines — planning/review persona |
| `100`, `200`, `300`, `400` | Glob-scoped — correct design |
| Stage skills | Load when stage invoked |

### Confirmed always-loaded (via Cursor `alwaysApply: true`)

1. `rules/guard-rules.mdc`
2. `rules/sdlc-core.mdc`

**Total always-loaded rule lines: ~127** — within the 100–150 line target per combined concern (split across two files is correct).

---

## 7. System Context Review

| Required Context | Existing File | Status | Recommendation |
| ---------------- | ------------- | ------ | -------------- |
| Project overview | `PROJECT.md` | **Present** | Keep — links to AGENTS for routing |
| Business purpose | `APPLICATION.md` (partial) + `PROJECT.md` | **Present** | Keep split — app vs project |
| Architecture | `ARCHITECTURE.md` | **Present** | Keep |
| Tech stack | `PROJECT.md` | **Present** | Keep |
| Database | N/A | **Not applicable** | Do not create — UI-only QA project |
| API structure | N/A | **Not applicable** | Do not create |
| Authentication | `LOGIN.md` | **Present** | Keep |
| Deployment / CI | `ARCHITECTURE.md` + `PROJECT.md` | **Partial** | CI noted; sufficient for QA scope |
| Integrations | `mcp.json` (Playwright MCP) | **Present** | Keep |
| Security context | `LOGIN.md` + `guard-rules` | **Present** | Enforcement in rules; procedure in LOGIN |
| Testing context | `APPLICATION.md` + `QA-PERSONA.md` | **Present** | Keep |
| Known constraints | `PROJECT.md` Boundaries + `600` | **Present** | Keep |
| Known risks | `APPLICATION.md` (dynamic DOM) | **Partial** | Sufficient |
| Workflow procedures | `workflows/SDLC-WORKFLOW.md` | **Correctly outside system-context** | Keep in `workflows/` |

**Verdict:** System context layer is complete for this project's scope. Do not add enterprise template files (`database-context.md`, `api-context.md`) unless project scope expands.

---

## 8. Rules and Guardrails Review

| Rule File | Current Problem | Should Be Always Loaded? | Recommendation |
| --------- | --------------- | ------------------------ | -------------- |
| `sdlc-core.mdc` | None critical | **Yes** | Keep — governance only, no workflow duplication |
| `guard-rules.mdc` | None critical | **Yes** | Keep — non-negotiable law |
| `playwright-tests.mdc` | ~25% overlap with `600`/`300` on POM | **No** (glob: tests) | Keep — precedence documented in `000` |
| `test-plans.mdc` | None | **No** (glob: specs) | Keep — authoritative ID governance |
| `page-object-model.mdc` | Examples overlap guards | **No** (glob) | Keep — patterns + examples for editors |
| `environment-config.mdc` | None | **No** (glob: config) | Keep |

### Mandatory rule coverage checklist

| Requirement | Covered? | Where |
|-------------|----------|-------|
| Follow existing architecture | Yes | `600`, `300`, `ARCHITECTURE.md` |
| Do not break existing functionality | Yes | `600`, partial invocation in `000` |
| Do not hardcode secrets | Yes | `600` Security Guards |
| Validate input / test data | Yes | `config/test-data.ts` rule in `600` |
| Follow security standards | Yes | `600`, `LOGIN.md` |
| Write tests for meaningful changes | Implicit | QA pipeline stages |
| Keep backward compatibility | Yes | `600` POM guards |
| Follow folder structure | Yes | `ARCHITECTURE.md`, `300` |
| No destructive changes without approval | Yes | `000` partial invocation; user rules |
| Readable, maintainable code | Yes | `100`, `300`, `QA-PERSONA.md` |

---

## 9. Skills Review

| Skill File | Useful? | Issue | Keep / Merge / Delete / Rewrite | Reason |
| ---------- | ------- | ----- | ------------------------------- | ------ |
| `qa-pipeline/SKILL.md` | Yes | Minor checklist overlap with agent | **Keep** | Correct trigger + checklist pattern |
| `plan-tests/SKILL.md` | Yes | None | **Keep** | Stage 1 procedure |
| `generate-tests/SKILL.md` | Yes | Minor fixture table overlap with `300` | **Keep** | Stage 4 procedure |
| `heal-tests/SKILL.md` | Yes | None | **Keep** | Stage 6 procedure |
| `run-tests/SKILL.md` | Yes | Longest skill (115 lines) | **Keep but shorten** | Commands could reference SDLC |
| `review-tests/SKILL.md` | Yes | None post-fix | **Keep** | Rule-reference audit — model pattern |

### vs enterprise template skills

| Template skill | This project | Verdict |
|--------------|--------------|---------|
| `backend-development.md` | N/A | Do not add |
| `frontend-development.md` | N/A | Do not add |
| `api-testing.md` | N/A | Do not add |
| `ui-testing.md` | Covered by `generate-tests` + `100` + `300` | Optional index skill only if team grows |
| `qa-automation.md` | Covered by stage skills | Do not add generic duplicate |
| `performance-testing.md` | Out of scope | Do not add |
| `security-testing.md` | Partially in `600` + stage 7 | Do not add unless scope expands |

---

## 10. Agents Review

| Agent File | Role Clarity | Duplication | Token Risk | Keep / Merge / Delete / Rewrite | Recommendation |
| ---------- | ------------ | ----------- | ---------- | ------------------------------- | -------------- |
| `qa-pipeline.md` | High | Low (~5% with SDLC) | **Low** (67 lines) | **Keep** | Model orchestrator — references SDLC only |
| `test-planner.md` | High | Low | Low (39 lines) | **Keep** | Defers coverage to `plan-tests` skill |
| `test-generator.md` | High | Low | Low (39 lines) | **Keep** | Model thin agent |
| `test-healer.md` | High | Low | Low (56 lines) | **Keep** | Clear stage 6 boundaries |

### vs enterprise template agents

| Template agent | This project equivalent | Verdict |
|----------------|------------------------|---------|
| `qa-automation-agent.md` | Split across 4 agents + 7 skills | **Better** — specialized |
| `code-review-agent.md` | `review-tests` skill (stage 7) | Correctly not a 5th agent |
| `developer-agent.md` | N/A | Do not add |
| `ba-agent.md` | `test-planner` (stage 1) | Covered |
| `security-review-agent.md` | `review-tests` + `600` | Covered |
| `debugging-agent.md` | `test-healer` | Covered |

---

## 11. Custom Commands Review

**No `commands/` folder exists.** No command files found.

| Command File | Useful? | Problem | Keep / Delete / Merge | Reason |
| ------------ | ------- | ------- | --------------------- | ------ |
| — | — | — | **Do not create** | `@qa-pipeline`, `@test-planner`, `@test-generator`, `@test-healer` + skills provide sufficient workflow triggers |

### Rule applied

```text
Do not keep custom commands just for the sake of having commands.
```

**Recommendation:** Custom commands are **not needed** for this setup. Agent mentions (`@qa-pipeline Run pipeline on docs/input/...`) are the natural entry points. Optional future commands (`/qa-pipeline`, `/heal-tests`) only if the team wants IDE slash-shortcuts — low value today.

---

## 12. QA Automation Best-Practice Review

| QA Capability | Guidance present? | Where |
|---------------|-------------------|-------|
| Manual test case generation | Yes | `test-planner`, `plan-tests`, `200`, `QA-PERSONA` |
| Automation test generation | Yes | `test-generator`, `generate-tests`, `100`, `300` |
| API testing | N/A (UI-only) | Correctly absent |
| UI testing | Yes | Playwright + POM across rules/skills |
| Regression testing | Yes | Tags `@regression`, `run-tests`, SDLC gates |
| Smoke testing | Yes | `@regression` grep in `run-tests` |
| Sanity testing | Partial | Covered by professional/juicer serial suites |
| Negative testing | Yes | `APPLICATION`, `200`, tags `@negative` |
| Edge case coverage | Yes | Tags `@edge`, `QA-PERSONA` techniques |
| Test data management | Yes | `config/test-data.ts`, `400`, `APPLICATION` stable terms |
| Bug reporting | Partial | `heal-tests` defect notes, `test.fixme()` |
| Traceability | Yes | Scenario IDs, `// spec:` / `// scenario:` headers |
| Test evidence | Yes | Allure attachments, `reporting/allure/` |
| CI/CD execution | Yes | `playwright-allure.yml`, `run-tests` CI section |
| Playwright usage | Yes | `100`, `300`, `600`, MCP in `mcp.json` |
| Performance testing | No | Out of scope — do not add unless requested |
| Security testing | Partial | `600`, `LOGIN`, stage 7 review |
| Accessibility testing | No | Out of scope — optional future skill |

### Minimum required QA setup (current vs suggested template)

| Suggested file | Current equivalent | Status |
|----------------|-------------------|--------|
| `skills/qa-automation.md` | Stage skills (`plan`, `generate`, `heal`, `run`, `review`) | **Adequate** — more precise than one generic file |
| `skills/ui-testing.md` | `generate-tests` + `100` + `300` | **Adequate** |
| `skills/api-testing.md` | Absent | **Correct** for UI-only |
| `rules/testing-guardrails.md` | `guard-rules.mdc` + globs | **Adequate** |
| `agents/qa-automation-agent.md` | 4-agent split | **Better** for pipeline clarity |

**Verdict:** QA automation guidance is **complete and appropriately scoped**. No merge into generic `qa-automation.md` — stage skills are superior for this pipeline.

---

## 13. Recommended Final `.cursor` Setup

Adapted from enterprise template to **this project's actual scope**. Only genuinely useful files included.

```text
.cursor/
├── system-context/
│   ├── PROJECT.md              ← project-overview equivalent
│   ├── APPLICATION.md          ← business-context + testing-context (app scope)
│   ├── ARCHITECTURE.md         ← architecture + tech-stack detail
│   ├── QA-PERSONA.md           ← testing mindset + design techniques
│   └── LOGIN.md                ← auth context
│
├── workflows/
│   └── SDLC-WORKFLOW.md        ← canonical 8-stage pipeline
│
├── rules/
│   ├── sdlc-core.mdc       ← global-rules + routing (alwaysApply)
│   ├── guard-rules.mdc     ← security + testing guardrails (alwaysApply)
│   ├── playwright-tests.mdc
│   ├── test-plans.mdc
│   ├── page-object-model.mdc
│   └── environment-config.mdc
│
├── skills/
│   ├── qa-pipeline/SKILL.md
│   ├── plan-tests/SKILL.md
│   ├── generate-tests/SKILL.md
│   ├── heal-tests/SKILL.md
│   ├── run-tests/SKILL.md
│   └── review-tests/SKILL.md
│
├── agents/
│   ├── qa-pipeline.md
│   ├── test-planner.md
│   ├── test-generator.md
│   └── test-healer.md
│
├── README.md                     ← pointer to root AGENTS.md
└── mcp.json
```

### File purpose table

| File | Purpose | Why Needed | Always Loaded or Task Specific |
| ---- | ------- | ---------- | ------------------------------ |
| `PROJECT.md` | Project identity, stack, conventions | First-read stable context | Task-specific (onboarding) |
| `APPLICATION.md` | Feature scope, test matrix | Planning coverage | Task-specific (plan/review) |
| `ARCHITECTURE.md` | Layers, fixtures, Allure, CI | Codegen/heal/review | Task-specific |
| `QA-PERSONA.md` | QA mindset, techniques | Planning, review tone | Task-specific |
| `LOGIN.md` | OTP procedure, recovery | Stage 2, auth tests | Task-specific |
| `SDLC-WORKFLOW.md` | Pipeline stages, gates, handoffs | Multi-stage QA work | Task-specific (pipeline) |
| `sdlc-core.mdc` | Routing, precedence | Every task | **Always loaded** |
| `guard-rules.mdc` | Security + POM law | Every task | **Always loaded** |
| `100–400` .mdc | File-type authoring rules | Editing matching files | Glob-loaded |
| Stage skills | Per-stage procedures | When stage runs | Task-specific |
| 4 agents | Role boundaries | When `@agent` invoked | Task-specific |
| `AGENTS.md` (root) | Human entry, quick start | Onboarding | Read first by humans |
| `mcp.json` | Playwright MCP | Browser automation stages | Config |

**Custom commands:** Not included — not justified.

---

## 14. Minimum Efficient Cursor Setup

The **leanest setup that still gives high-quality output** for this Amazon.in QA project:

```text
.cursor/
├── system-context/
│   ├── PROJECT.md
│   ├── ARCHITECTURE.md
│   └── LOGIN.md
│
├── workflows/
│   └── SDLC-WORKFLOW.md
│
├── rules/
│   ├── sdlc-core.mdc       (alwaysApply)
│   ├── guard-rules.mdc     (alwaysApply)
│   ├── test-plans.mdc      (glob: specs)
│   └── page-object-model.mdc (glob: tests/pages)
│
├── skills/
│   ├── plan-tests/SKILL.md
│   ├── generate-tests/SKILL.md
│   ├── heal-tests/SKILL.md
│   └── run-tests/SKILL.md
│
└── agents/
    ├── qa-pipeline.md
    ├── test-generator.md
    └── test-healer.md
```

### What the minimum setup drops

| Dropped | Trade-off |
|---------|-----------|
| `APPLICATION.md`, `QA-PERSONA.md` | Less rich scenario design guidance — acceptable for maintenance-only work |
| `playwright-tests.mdc` | `300` + `600` still enforce POM; lose spec header/tag examples |
| `environment-config.mdc` | `600` still bans hardcoding; lose env file detail |
| `test-planner` agent, `review-tests` skill | Manual planning and audit less guided |
| `qa-pipeline` skill | Agent alone still works |

### When minimum is better

- Small team doing **execute + heal + report** only on existing suites
- Token budget is tight and pipeline planning is rare
- Contributors already know Playwright POM conventions

### When full current setup is better (recommended)

- Document-to-automation pipeline (stages 1–8)
- Multiple contributors onboarding
- Strict guard/POM audit before Allure report (stage 7)
- Manual test plan authoring with ID governance

**Current full setup is the right default** for this repository's stated goals.

---

## 15. Recommended Deletion / Merge Roadmap

### Phase 1: Backup

- Backup `.cursor/` before any future changes.
- **Status:** Prior critical fixes already applied; backup before Phase 2 optional optimizations.

### Phase 2: Remove Duplicates

| # | Action | Status |
|---|--------|--------|
| 1 | Create `LOGIN.md` | **Done** |
| 2 | Rename guard file to `guard-rules.mdc` | **Done** |
| 3 | Slim `qa-pipeline.md` | **Done** |
| 4 | Dedup routing — SDLC defers to `000` | **Done** |
| 5 | `review-tests` → rule references | **Done** |
| 6 | Optional: remove 4-agent table from SDLC header (lines 7–16) | Pending — Low |
| 7 | Optional: `AGENTS.md` setup → link `PROJECT.md` only | Pending — Low |

### Phase 3: Restructure

| # | Action | Status |
|---|--------|--------|
| 1 | Move SDLC to `workflows/` | **Done** |
| 2 | `.cursor/README.md` → pointer to AGENTS | **Done** |
| 3 | Optional: lowercase hyphenated renames (`project-overview.md`) | **Not recommended** — breaks 15+ refs for cosmetic gain |

### Phase 4: Token Optimization

| # | Action | Priority |
|---|--------|----------|
| 1 | Shorten `run-tests/SKILL.md` command blocks | Medium |
| 2 | `PROJECT.md` → link ARCHITECTURE for directory detail | Low |

### Phase 5: QA Automation Improvement

| # | Action | Status |
|---|--------|--------|
| 1 | 8-stage pipeline in `docs/input/README.md` | **Done** |
| 2 | QA-PERSONA subordinate to SDLC | **Done** |
| 3 | Do not add generic `qa-automation.md` skill | Correct |

### Phase 6: Validate Cursor Output

Test with real tasks and confirm correct file usage:

| Task | Expected primary files | Pass? |
|------|------------------------|-------|
| New test from document | `000` → `@qa-pipeline` → SDLC → `plan-tests` | Expected yes |
| Automate existing spec | `000` → `@test-generator` → `generate-tests` | Expected yes |
| Bug fix / heal | `@test-healer` → `heal-tests` → `600`, `300` | Expected yes |
| Code/POM review | `review-tests` → rule files | Expected yes |
| Login + OTP | `@qa-pipeline` → `LOGIN.md` | Expected yes (was broken) |
| Run regression + Allure | `run-tests` → SDLC stage 5/8 | Expected yes |

---

## 16. Final Summary

### 1. Current setup quality score

**8.6 / 10** (up from 7.1 / 10 pre-remediation)

### 2. Biggest structural problem (remaining)

**Minor:** `workflows/` is outside the strict 4-pillar contract — but this is **correct design**, not a defect. Optional trim: 4-agent table still at top of `SDLC-WORKFLOW.md`.

### 3. Biggest duplication problem (remaining)

**POM/fixture guidance** across `600`, `300`, `100`, and `ARCHITECTURE.md` (~25% overlap). Mitigated by documented precedence in `000` — acceptable.

### 4. Biggest token-waste problem (remaining)

**`run-tests/SKILL.md`** (115 lines) — longest skill; command blocks could live only in SDLC.

### 5. Files to keep (all 24 `.cursor` files + `AGENTS.md`)

All current files — no whole-file deletion recommended.

### 6. Files to merge (optional, low priority)

| From | Into |
|------|------|
| `AGENTS.md` setup block | Link to `PROJECT.md` only |
| SDLC header agent table | `AGENTS.md` / `000` only |

### 7. Files to delete later

**None.**

### 8. Files to move

**None** — `SDLC-WORKFLOW.md` move to `workflows/` already done.

### 9. Missing files to create

**None critical.** Optional future files only if scope expands:

- `system-context/security-context.md` — if security testing grows beyond `600` + `LOGIN`
- `skills/ui-testing/SKILL.md` — thin index to `100` + `300` if team onboarding needs it

### 10. Always-considered rule files

1. `rules/guard-rules.mdc`
2. `rules/sdlc-core.mdc`

### 11. Task-specific files

- `workflows/SDLC-WORKFLOW.md` — pipeline work
- `system-context/*` — load by task type
- `rules/100–400` — glob by file being edited
- Stage skills — when stage invoked
- Agent `.md` files — when `@agent` invoked

### 12. Custom commands needed?

**No.** Agent mentions and skills are sufficient.

### 13. Recommended final structure

See **Section 13** — matches current setup with minor optional trims.

### 14. Minimum efficient structure

See **Section 14** — use only for maintenance-only, token-constrained scenarios.

### 15. Step-by-step cleanup priority

| Priority | Action | Effort | Impact |
|----------|--------|--------|--------|
| **Done** | LOGIN.md, guard rename, slim qa-pipeline, workflows move, review-tests dedup | — | Critical fixes |
| **P2 Low** | Shorten `run-tests/SKILL.md` | Small | 5% token savings |
| **P2 Low** | Remove agent table from SDLC header | Small | Clarity |
| **P3 Optional** | AGENTS setup → PROJECT link only | Small | Minor dedup |
| **Do not do** | Add enterprise template files (BA agent, api-testing, database-context) | — | Would add noise |

---

## Post-Remediation Change Log

| Item | Before | After |
|------|--------|-------|
| Guard rules file | `500-guardrils.mdc` (broken refs) | `guard-rules.mdc` |
| Login context | Missing | `system-context/LOGIN.md` |
| Workflow location | `system-context/SDLC-WORKFLOW.md` | `workflows/SDLC-WORKFLOW.md` |
| `qa-pipeline.md` | 362 lines | 67 lines |
| `review-tests/SKILL.md` | Full checklist restatement | Rule-reference audit table |
| `test-planner.md` | Coverage essay | Defers to `plan-tests` skill |
| `.cursor/README.md` | Duplicate onboarding | Pointer to `AGENTS.md` |
| `PROJECT.md` | Agent table duplicate | Links to `AGENTS.md` |
| `docs/input/README.md` | 5-step stale pipeline | 8-stage + SDLC link |
| `QA-PERSONA.md` | Alternate lifecycle | Subordinate to SDLC |
| SDLC routing | Duplicated in SDLC + 000 | SDLC defers to `000` |
| `qa-pipeline` skill trigger | Conflicted with routing | Fixed to pipeline-only phrases |

---

## Final Confirmation

```text
Review completed.
No existing .cursor files were modified.
No files were deleted.
No files were moved.
Only CURSOR_SETUP_REVIEW.md was created.
Deletion and cleanup items are recommendations only.
```
