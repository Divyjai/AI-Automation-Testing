# Test Case Input Documents

Place user-provided test case documents here for the QA pipeline.

## Supported Formats

- Markdown (`.md`)
- Plain text (`.txt`)
- CSV / Excel (describe columns: feature, steps, expected)
- Pasted content in chat

## Pipeline Usage

```
@qa-pipeline Run pipeline on docs/input/my-test-cases.md
```

**Canonical workflow:** [.cursor/skills/qa-pipeline/SKILL.md](../../.cursor/skills/qa-pipeline/SKILL.md)

The 8-stage pipeline:

1. **Plan** — document → `specs/amazon-in/`
2. **Login** — OTP from you in chat (if auth scenarios)
3. **Execute** — manual QA via Playwright MCP
4. **Generate** — `tests/amazon-in/` (POM)
5. **Verify** — `npx playwright test` (CLI)
6. **Heal** — fix failures (if any)
7. **Review** — guard/POM audit gate
8. **Report** — Allure summary

Login details: [.cursor/system-context/LOGIN.md](../../.cursor/system-context/LOGIN.md)

## Example Document Structure

```markdown
# Search Feature Tests

## Valid Search
- Open amazon.in
- Search for "books"
- Verify results appear

## Empty Search
- Open amazon.in
- Submit empty search
- Verify error or no navigation
```

The planner converts this into full manual test cases with IDs and step tables per `test-plans.mdc`.
