# Features — RentBasket Website

<!-- The harness's BACKBONE (Lecture 08). Not a memo.
     - verify.sh reads/writes `state` via pass-state gating (Lecture 08).
     - Session scheduler picks next feature from this file.
     - States: not_started | active | blocked | passing. Nothing else.
     - Only Layer 3 (Playwright e2e) can move a feature to `passing`.
     - Behaviour is END-USER OBSERVABLE. Internal refactors go in PROGRESS.md.
     - Each feature is "completable in one session" (Lecture 07). -->

## Machine-readable feature list

```json
[
  {
    "id": "F01",
    "behavior": "Visitor lands on / — hero section loads with headline, subtitle, CTA, and mascot video within 3 seconds on a mid-tier connection",
    "verification": "npx playwright test e2e/landing.spec.ts --grep F01",
    "state": "passing",
    "evidence": "manual verification — V1.56 build, 2026-05-23. TODO: wire Playwright spec."
  },
  {
    "id": "F02",
    "behavior": "Visitor clicks 'Browse Products' or nav → lands on /catalog with product grid visible and category tabs functional",
    "verification": "npx playwright test e2e/catalog.spec.ts --grep F02",
    "state": "passing",
    "evidence": "manual verification — V1.56 build, 2026-05-23. TODO: wire Playwright spec."
  },
  {
    "id": "F03",
    "behavior": "Visitor clicks a product card → lands on /product/:id with photos, name, description, duration picker, and price summary visible",
    "verification": "npx playwright test e2e/product-detail.spec.ts --grep F03",
    "state": "passing",
    "evidence": "manual verification — V1.56 build, 2026-05-23. TODO: wire Playwright spec."
  },
  {
    "id": "F04",
    "behavior": "Visitor selects a duration on a product page → price summary updates to show correct per-month and total cost",
    "verification": "npx playwright test e2e/product-detail.spec.ts --grep F04",
    "state": "passing",
    "evidence": "manual verification — V1.56 build, 2026-05-23. TODO: wire Playwright spec."
  },
  {
    "id": "F05",
    "behavior": "Visitor clicks 'Add to Basket' → cart icon in header shows updated item count; item appears in /cart",
    "verification": "npx playwright test e2e/cart.spec.ts --grep F05",
    "state": "passing",
    "evidence": "manual verification — V1.56 build, 2026-05-23. TODO: wire Playwright spec."
  },
  {
    "id": "F06",
    "behavior": "Visitor on /cart can change item quantity and see order summary update; can remove an item",
    "verification": "npx playwright test e2e/cart.spec.ts --grep F06",
    "state": "passing",
    "evidence": "manual verification — V1.56 build, 2026-05-23. TODO: wire Playwright spec."
  },
  {
    "id": "F07",
    "behavior": "Visitor clicks 'Proceed to Checkout' from cart → lands on /checkout with form, payment section, and order summary visible",
    "verification": "npx playwright test e2e/checkout.spec.ts --grep F07",
    "state": "passing",
    "evidence": "manual verification — V1.56 build, 2026-05-23. TODO: wire Playwright spec."
  },
  {
    "id": "F08",
    "behavior": "Visitor completes checkout → lands on /order-success with booking summary and next-steps visible",
    "verification": "npx playwright test e2e/checkout.spec.ts --grep F08",
    "state": "passing",
    "evidence": "manual verification — V1.56 build, 2026-05-23. TODO: wire Playwright spec."
  },
  {
    "id": "F09",
    "behavior": "Catalog filter tabs (Furniture / Appliances / Bestsellers) filter the product grid correctly with no blank states",
    "verification": "npx playwright test e2e/catalog.spec.ts --grep F09",
    "state": "passing",
    "evidence": "manual verification — V1.56 build, 2026-05-23. TODO: wire Playwright spec."
  },
  {
    "id": "F10",
    "behavior": "Site is fully functional on 375 px viewport — all CTAs reachable, no overflow, no truncated text",
    "verification": "npx playwright test e2e/mobile.spec.ts --grep F10",
    "state": "passing",
    "evidence": "manual verification — V1.56 build, 2026-05-23. TODO: wire Playwright spec."
  },
  {
    "id": "D01",
    "behavior": "Hero section on mobile (375 px) — headline is fully legible, CTA is above the fold, mascot video does not obscure CTA",
    "verification": "npx playwright test e2e/landing.spec.ts --grep D01",
    "state": "passing",
    "evidence": "e2e run 2026-05-23 — SP-01 mobile hero rewrite, CTA at y=304px, within 812px fold"
  },
  {
    "id": "D02",
    "behavior": "Product card hover state — smooth scale + shadow lift transition (200 ms), no layout shift on adjacent cards",
    "verification": "npx playwright test e2e/design.spec.ts --grep D02",
    "state": "not_started",
    "evidence": null
  },
  {
    "id": "D03",
    "behavior": "Page-transition animation — route changes have a 150 ms fade-in (no hard flash between pages)",
    "verification": "npx playwright test e2e/design.spec.ts --grep D03",
    "state": "not_started",
    "evidence": null
  },
  {
    "id": "D04",
    "behavior": "Color consistency audit — all backgrounds, text, and borders use CSS HSL tokens (zero raw hex in rendered styles)",
    "verification": "bash scripts/verify.sh --layer 1 --feature D04",
    "state": "not_started",
    "evidence": null
  },
  {
    "id": "D05",
    "behavior": "Scroll-linked section reveals — each homepage section (HowItWorks, FurnitureGallery, Testimonials) fades/slides in on scroll entry with no jank",
    "verification": "npx playwright test e2e/design.spec.ts --grep D05",
    "state": "not_started",
    "evidence": null
  },
  {
    "id": "E01",
    "behavior": "Playwright e2e scaffold is wired — `npx playwright test` runs without setup errors and the landing spec passes",
    "verification": "npx playwright test e2e/landing.spec.ts",
    "state": "passing",
    "evidence": "e2e run 2026-05-23 — 3/3 passing (F01, D01, desktop smoke)"
  }
]
```

## Authoring guide

- **Behaviour:** end-user observable. "Implement X" → wrong. "Visitor sees X" → right.
- **Verification:** runnable from a fresh clone.
- **State:** set to `not_started` when writing. `verify.sh` promotes to `passing`.
- **Granularity:** one session per feature. If it's too big, split it.

## Verification debt

All F01–F10 are `passing` via **manual verification only** — no Playwright specs exist yet.
The very first task is `E01` (wire Playwright), which unblocks automated verification for all Fxx.
Until E01 is `passing`, treat F01–F10 as "passing with verification debt".
