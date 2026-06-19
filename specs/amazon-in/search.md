# Amazon.in — Search Test Cases

## Overview

**id_scheme:** feature

Scope: search bar, results page, negative/empty states.  
Test data: `config/test-data.ts` → `search.valid`, `search.noResults`.

**Overlays:** Dismiss via `BasePage` before steps.

---

#### SRCH-REG-001 — Valid search returns results

**Type:** Regression | **Tags:** @regression @positive | **Priority:** P0  
**File:** `tests/amazon-in/search/search-positive.spec.ts`

**Objective:** Verify search with a common term returns product results

**Preconditions:** Guest user on homepage; overlays dismissed

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open Amazon.in | Homepage loads |
| 2 | Search valid term from test data | SRP loads |
| 3 | Observe results | At least one product visible |

**Automation notes:** Assert result exists, not exact title.

---

#### SRCH-NEG-001 — Search with no results term

**Type:** Negative | **Tags:** @negative | **Priority:** P1  
**File:** `tests/amazon-in/search/search-negative.spec.ts`

**Objective:** Verify gibberish term shows empty state or zero results

**Preconditions:** Guest user on homepage

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open homepage | Page loads |
| 2 | Search no-results term from test data | SRP or empty state |
| 3 | Observe | Zero results or no-results message |

**Automation notes:** Use `testData.search.noResults`; accept count 0 or message visible.
