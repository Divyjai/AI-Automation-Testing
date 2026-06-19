---
name: plan-tests
description: Consolidated planner — converts test case documents into human-readable manual test cases, designs scenarios with QA techniques. Pipeline stage 1. Use when user provides a test document or needs specs/amazon-in plans.
---

# Plan Tests (Consolidated Planner)

**Canonical workflow:** `.cursor/system-context/SDLC-WORKFLOW.md` — stage 1 Plan gate and handoff schema.

## Persona

Senior **manual QA expert** + scenario designer. Read `QA-PERSONA.md`, `LOGIN.md`, `200-test-plans.mdc`.

## Mode A: Document ingestion

1. Read document from `docs/input/` or user-provided path/content
2. Extract features, requirements, test ideas
3. Choose `id_scheme`:
   - **document** → `TC-NNN` (imported docs)
   - **feature** → `SRCH-REG-001` (matrix coverage)
   - **flow** → `JUICER-001` (sequential journeys)
4. Convert to manual test cases per `200-test-plans.mdc`
5. Save to `specs/amazon-in/<feature>.md`
6. Present summary; confirm with user before stage 2 (pipeline)

## Mode B: Explore & plan

1. `planner_setup_page` → explore with `browser_*` tools
2. Design scenarios for discovered features
3. Save via `planner_save_plan`

## Output checklist (plan gate)

- [ ] Human-readable — junior tester can execute without help
- [ ] Scenario IDs and `id_scheme` declared in overview
- [ ] Tags on every case
- [ ] Four categories per feature
- [ ] Login flag set where needed
- [ ] Stable test data documented
- [ ] Automation notes for generator

## Handoff artifact

Pass to `@qa-pipeline` or `@test-generator`:

```
{ feature, spec_path, scenario_ids, id_scheme, requires_login, tags }
```

See `SDLC-WORKFLOW.md` artifact handoff schema.
