# Amazon.in — Professional Test Cases

> Source: `Amazon_in_Test_Cases_Professional.docx`

## Overview

12 professional test cases covering regression, negative validation, and edge conditions for Amazon.in.

**Test data:** `config/test-data.ts`

## Scenarios

### TC-001 — Homepage Loads
**Type:** Regression | **Priority:** High | **File:** `tc-001-homepage.spec.ts`

| Step | Action | Expected |
|------|--------|----------|
| 1 | Open amazon.in | Homepage loads without error |
| 2 | Verify key UI | Logo, search bar, nav visible |

---

### TC-002 — Valid Search
**Type:** Regression | **Priority:** High | **File:** `tc-002-valid-search.spec.ts`

| Step | Action | Expected |
|------|--------|----------|
| 1 | Open homepage | Page loads |
| 2 | Enter valid product and submit | Relevant search results displayed |

---

### TC-003 — Search Suggestions
**Type:** Regression | **Priority:** Medium | **File:** `tc-003-search-suggestions.spec.ts`

| Step | Action | Expected |
|------|--------|----------|
| 1 | Open homepage | Page loads |
| 2 | Type partial keyword | Auto-suggestions appear and are relevant |

---

### TC-004 — Open Product from SRP
**Type:** Regression | **Priority:** High | **File:** `tc-004-open-product.spec.ts`

| Step | Action | Expected |
|------|--------|----------|
| 1 | Search valid product | SRP loads |
| 2 | Select product from results | Correct PDP opens |

---

### TC-005 — Product Information
**Type:** Regression | **Priority:** High | **File:** `tc-005-product-info.spec.ts`

| Step | Action | Expected |
|------|--------|----------|
| 1 | Open PDP | Product page loads |
| 2 | Review title, price, rating, images, delivery | All sections visible |

---

### TC-006 — Add to Cart
**Type:** Regression | **Priority:** High | **File:** `tc-006-add-to-cart.spec.ts`

| Step | Action | Expected |
|------|--------|----------|
| 1 | Open PDP | Product page loads |
| 2 | Click Add to Cart | Item added, cart count updates |

---

### TC-007 — Update Cart Quantity
**Type:** Regression | **Priority:** Medium | **File:** `tc-007-cart-quantity.spec.ts`

| Step | Action | Expected |
|------|--------|----------|
| 1 | Add item to cart | Item in cart |
| 2 | Increase quantity | Quantity and subtotal update |

---

### TC-008 — Remove Cart Item
**Type:** Regression | **Priority:** High | **File:** `tc-008-remove-cart-item.spec.ts`

| Step | Action | Expected |
|------|--------|----------|
| 1 | Add item to cart | Item in cart |
| 2 | Remove item | Cart reflects removal |

---

### TC-009 — Proceed to Checkout
**Type:** Regression | **Priority:** High | **File:** `tc-009-proceed-checkout.spec.ts`

| Step | Action | Expected |
|------|--------|----------|
| 1 | Add item, open cart | Cart has items |
| 2 | Click Proceed to Buy | Checkout flow starts |

---

### TC-010 — Invalid Login
**Type:** Negative | **Priority:** High | **File:** `tc-010-invalid-login.spec.ts`

| Step | Action | Expected |
|------|--------|----------|
| 1 | Open sign-in page | Login form visible |
| 2 | Enter invalid credentials | Validation error shown |

---

### TC-011 — Empty Search
**Type:** Edge | **Priority:** Medium | **File:** `tc-011-empty-search.spec.ts`

| Step | Action | Expected |
|------|--------|----------|
| 1 | Open homepage | Page loads |
| 2 | Submit blank or whitespace search | Handled gracefully, no crash |

---

### TC-012 — Session Refresh at Cart
**Type:** Edge | **Priority:** High | **File:** `tc-012-session-refresh.spec.ts`

| Step | Action | Expected |
|------|--------|----------|
| 1 | Add item, open cart | Cart active |
| 2 | Refresh page | State handled safely |

## Run Commands

```bash
npm run test:professional
npm run test:professional:allure
```
