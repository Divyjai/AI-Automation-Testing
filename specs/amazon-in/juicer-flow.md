# Amazon.in — Juicer Purchase Flow

## Overview

End-to-end juicer search and purchase flow for Amazon.in automation suite.

**Test data:** `config/test-data.ts` → `search.juicer`, `checkout.*`

## Scenarios

### JUICER-001 — Search Bar Visible
**Type:** Regression | **Tags:** `@regression @positive` | **File:** `01-search-bar.spec.ts`

| Step | Action | Expected |
|------|--------|----------|
| 1 | Open Amazon.in homepage | Page loads |
| 2 | Observe search bar | Search input visible and enabled |

---

### JUICER-002 — Search Juicer & Open Product
**Type:** Positive | **Tags:** `@positive` | **File:** `02-search-juicer.spec.ts`

| Step | Action | Expected |
|------|--------|----------|
| 1 | Open homepage | Page loads |
| 2 | Search "juicer" | SRP loads |
| 3 | Click first organic product (`/dp/`) | PDP opens |
| 4 | Verify product title | Title visible |

---

### JUICER-003 — Add to Cart
**Type:** Positive | **Tags:** `@positive` | **File:** `03-add-to-cart.spec.ts`

| Step | Action | Expected |
|------|--------|----------|
| 1 | Search juicer, open product | PDP loads |
| 2 | Click Add to Cart | Cart count increases or confirmation shown |

---

### JUICER-004 — View Cart
**Type:** Positive | **Tags:** `@positive` | **File:** `04-view-cart.spec.ts`

| Step | Action | Expected |
|------|--------|----------|
| 1 | Add juicer to cart | Item added |
| 2 | Navigate to cart page | Shopping cart heading visible |
| 3 | Verify items | At least 1 item in cart |

---

### JUICER-005 — Buy Now & Dummy Checkout Details
**Type:** Positive | **Tags:** `@positive` | **File:** `05-buy-now-checkout.spec.ts`

| Step | Action | Expected |
|------|--------|----------|
| 1 | Add juicer to cart | Item in cart |
| 2 | Open cart | Cart page loads |
| 3 | Click Proceed to Buy | Checkout or sign-in page |
| 4 | Fill dummy address fields | Name, phone, pincode populated |
| 5 | Stop | No payment submitted |

**Note:** Guest users may be redirected to sign-in before address form.

## Run Commands

```bash
npm run test:juicer              # Run all 5 tests
npm run test:juicer:allure       # Run + generate Allure report
npm run allure:open              # Open Allure report
```
