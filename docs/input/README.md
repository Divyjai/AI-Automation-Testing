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

The pipeline will:
1. Convert this document → human-readable test cases in `specs/amazon-in/`
2. Login to Amazon.in (OTP provided by you in chat)
3. Execute scenarios via Playwright
4. Generate automated tests in `tests/amazon-in/`
5. Heal any failures

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

The planner converts this into full manual test cases with IDs and step tables.
