# Amazon.in — Example Test Case Document

> Place your test documents in `docs/input/` and run: `@qa-pipeline Run pipeline on docs/input/example-test-cases.md`

## Search Feature

### Valid Search
- Open Amazon.in homepage
- Enter "books" in search bar
- Press Enter
- Verify search results page shows products

### Empty Search
- Open Amazon.in homepage
- Submit search without entering text
- Verify appropriate behavior (no crash, stays on page or shows message)

### No Results Search
- Search for "xyznonexistentproduct12345"
- Verify no results message or empty results

## Cart Feature (Requires Login)

### Add to Cart
- Login to Amazon.in
- Search for "pen" and open first result
- Click Add to Cart
- Verify cart count increases

### View Cart
- Login to Amazon.in
- Open cart page
- Verify cart page loads

## Pincode

### Valid Pincode
- Open Amazon.in
- Set delivery pincode to 110001
- Verify delivery location updates
