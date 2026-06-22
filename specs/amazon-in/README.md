# Amazon.in Test Plans

Human-readable test cases for Amazon.in E2E automation.

**Authoritative inventory:** [.cursor/skills/qa-pipeline/SKILL.md](../../.cursor/skills/qa-pipeline/SKILL.md#spec--suite-inventory-authoritative) (Spec & Suite Inventory).

## Current Specs

| File | Automated suite | `id_scheme` | ID format |
|------|-----------------|-------------|-----------|
| `professional-test-cases.md` | `tests/amazon-in/professional/` | `document` | `TC-NNN` |
| `juicer-flow.md` | `tests/amazon-in/juicer/` | `flow` | `JUICER-NNN` |
| `search.md` | `tests/amazon-in/search/` | `feature` | `SRCH-REG-001`, `SRCH-NEG-001` |

## Creating new plans

| Use case | Scheme | Example |
|----------|--------|---------|
| Imported document | `document` | `TC-001` |
| Matrix coverage (reg/pos/neg/edge) | `feature` | `SRCH-REG-001` |
| Ordered end-to-end journey | `flow` | `JUICER-001` |

See `test-plans.mdc` and [qa-pipeline skill](../../.cursor/skills/qa-pipeline/SKILL.md).
