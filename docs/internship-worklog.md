# RentBasket Website — Work Log

> A running record of work done, decisions made, and findings — for internship review.
> Higher-level than `PROGRESS.md` (the terse technical clock-out journal): this captures
> **what was accomplished and why**. Newest entries at the bottom. Update each session.

## Project context
- **RentBasket** — furniture & appliance rental for young professionals relocating between Indian cities.
- **This phase** — harden the existing website foundation, then ship a **V1** = catalog browse + cart + **WhatsApp order handoff** (no accounts, no in-app payment yet). Full self-serve checkout returns in a later release.
- **Stack** — React 18 + Vite, Tailwind, React Router, TanStack Query, Framer Motion. Static SPA on GitHub Pages.
- **Repo** — fork `VedantSinha00/RentBasket_Website` (origin); upstream `hardik2704`. Work branch: `phase1-foundation`.

---

## 2026-06-02 — Foundation audit
Reviewed the whole codebase for weak foundations before building further. Key findings:
- **Cart/money math was duplicated across 5 screens** with divergent formulas, magic numbers (₹65/₹49/₹50), and two non-agreeing flags — already drifted (e.g. coupon silently dropped between cart and checkout).
- **Data-access "seam" only half-wired** — only the catalog used the data layer; product page, related items, and cart read static data directly, so a real API swap would leave half the app stale.
- No error boundary; no validation of the saved cart; stale `business-rules.md`; a dead duplicate toast system.

## 2026-06-02 — Captured the real backend contract
- Saved the live product catalog sample → `src/data/products-api-sample.json`.
- Documented the backend API (auth, catalog, server-side "proposal" cart) → `docs/rentbasket-api-contract.md`.

## 2026-06-02 — Phase 1: foundation hardening (no pricing changes)
Committed checkpoint `6b113de9` on branch `phase1-foundation`. Lint clean, production build passing, **no prices changed**:
- **A** — Mobile "Checkout" button now navigates correctly (was a dead "coming soon" toast).
- **B** — Cart-item IDs are now unique (`crypto.randomUUID`), fixing collisions when adding several items at once.
- **C** — Routed the product page, related items, cross-sell, and cart through the data-access layer (one "door" for the future API swap); added a product-page loading state.
- **D** — Added an app-wide error boundary (no more white-screen) + the cart now self-heals malformed/legacy items on load.
- **E** — Rewrote `business-rules.md` to match the code; removed the dead toast system.

## 2026-06-02 — V1 scope decisions
- **Checkout → WhatsApp handoff.** Clicking "Checkout" on the cart now opens a pop-up prompting the customer to finish on WhatsApp (`CheckoutContactModal`), pre-filled with their cart items. Template number `9999999999` (one-line swap when the real number arrives).
- **Removed all login/account UI** (the two `/account/orders` links) — V1 has no accounts.
- **Preserve** the `/checkout` and `/order-success` pages — orphaned for now but intentionally kept for a later release.

## 2026-06-02 — Pricing model confirmed (Hardik call + Proposal #2397)
Decoded the full pricing model from a real customer proposal and confirmed with Hardik. **Rent is per-month for the chosen duration.**

**Monthly rent build-up (all per month):**
1. **List rent** per item = catalog `rent_3/6/9/12` (shown struck-through).
2. **Discounted rent** per item = `list × (1 − percent_discount)`. Discount is **per-product** (varies item to item) and applies to the **base rent only** (before GST / security).
3. **Total Rent** = Σ list rents. **Base Rent** = Σ discounted rents. **Savings** = Total − Base (shown as a blended %).
4. **Coupon** (if any) = applied to the **whole-cart Base Rent total** (not per item), on the base price (excl. GST/security).
5. **GST = 18%** on the (discounted, post-coupon) Base Rent.
6. **Net Monthly Rent** = Base Rent + GST.

**One-time charges:**
- **Refundable Security (deposit)** = **list rent × `security_multiple`**, and the API returns it directly as a per-item `security` field. (Verified against the live cart — see the 2026-06-02 live-data entry below. The deposit comes straight out of the API.)
- **Transportation & Installation** = **free for monthly leases (1 month and up).** Short-term/day rentals go to a separate **"RentBasket Mini"** page (future) that does charge delivery + installation.

**Totals & payment:**
- **Net Payable (First Month)** = Net Monthly Rent + Security.
- Customer pays **50% upfront to confirm**, **50% after delivery**.

**Other decisions:**
- **No "Brand New" (+₹65) or "Combo" (₹49/₹50) surcharges** in the real model → remove from the site.
- **Quantity:** rent scales × count; deposit follows from rent so it scales too.
- **Show everything** on the V1 website — the cart should mirror this full proposal breakdown (list→discounted, savings, GST, security, 50% split).
- **Coupons:** in scope for V1. **KYC:** mandatory before delivery, likely via T&C acceptance — to be detailed.

**Discount data:** confirmed the **live API is the source of truth** for discounts. The sample file is stale (fridge shows 30% but the bill implies ~37%); we'll price off live data when wiring the API.

## 2026-06-02 — Duration scope & "RentBasket Mini" navigation (confirmed)
- **Coupon is deducted before GST** — no GST is charged on the discounted-away amount.
- **Main site shows durations 1 month and up.** Shorter (sub-month) durations live on a separate **"RentBasket Mini"** site/section.
- **Cross-navigation concept:** within the duration picker, the main site has a card *"Want to lease for less time?"* that sends the user to RentBasket Mini; Mini has a mirror card *"Want to lease for longer?"* that sends them back. Each site shows its own duration range. (Mini also carries delivery + installation charges, which the main site does not.)

## 2026-06-02 — Verified the model against the live cart
Opened a real personalised lead cart (`qr.rentbasket.com/lead-shopping`, lead 5383) in a browser and inspected its API responses (`api.rentbasket.com/get-proposal-cart-items-for-lead`). This confirmed the model on real data:
- Discount: item `rent: 769` (rent_6) → `rent_with_discount: 538` = 769 × (1 − 30%). ✓
- **Security comes straight from the API** as a per-item `security` field: `769 × security_multiple(2) = 1538`. So deposit = list rent × `security_multiple` — and we can read it directly rather than recompute.
- `cart_value` (₹1076) = Σ discounted monthly rents (538 + 538), i.e. monthly base rent before GST.
- Rent and Security are labelled **"/ Unit"** in the cart → both scale with quantity.
- Main cart durations are **3 / 6 / 9 / 12 months**.
- Production API hosts: `api2.rentbasket.com` (JWT) and `api.rentbasket.com` (cart/catalog) — matches the contract doc.

This corrected an earlier guess (deposit is `list rent × multiple`, not `multiple × net-monthly`; the shared bill used older discount settings — the live API is authoritative).

## 2026-06-02 — Built the pricing module (Step 2)
Created `src/lib/pricing.js` — pure functions for the whole confirmed model (discounted rent, unit security, whole-cart coupon, 18% GST, net monthly rent, security, net first month, 50% upfront split). Plus `src/lib/pricing.test.js` — **8 tests, all passing**, that reproduce:
- the **live cart** (lead 5383): base ₹1076, security ₹3076, net monthly ₹1270, net first month ₹4346, upfront ₹2173;
- the **proposal bill's** monthly section: base ₹1114 → GST ₹201 → net monthly ₹1315;
- coupon-on-base-before-GST behaviour.

This is the single source of truth every cart/proposal screen will call. Lint clean.

## 2026-06-02 — Catalog migration, Phase 1 (durations, discount display, Mini stub)
- **Durations trimmed to monthly only** (1/3/6/12 months) — day/sub-month tiers removed from the picker (they belong to RentBasket Mini).
- **Products now carry `percent_discount` (30%) and `security_multiple` (2)** via a defaults map (live API overrides later).
- **All shown prices are now the DISCOUNTED price**, not the list price — across catalog cards (with the list struck through), the product page (duration picker, pricing summary, sticky CTA), and the cart line items / cross-sell. Prices added to the cart are discounted too, so product → cart is consistent.
- **RentBasket Mini stub added** — a "Need it for less than a month?" card in the duration picker with a "Coming soon" badge (taps show a coming-soon toast). Visible intent, no dead link.

Lint clean, build passing, pricing tests green. (Phase 2 — the full cart breakdown with GST/security/50% — is still pending the user's sign-off on Phase 1.)

## 2026-06-02 — Phase 2: Implementation & Wiring
Successfully completed Phase 2, wiring the new pricing breakdown engine across the app:
- **Pricing inputs on addToCart:** Product detail page, mobile CTAs, and cross-sell quick-add items now populate `rent`, `percent_discount`, and `security_multiple`.
- **Zero-Deposit Retention:** Hand-picked recommended items added via quick-add are configured with `security_multiple: 0` to preserve the ₹0 deposit promo even if lease durations are adjusted in the cart.
- **Surcharges Removed:** Eliminated all placeholder ₹65 "Brand New" and ₹49/₹50 "Combo" surcharges from cart context, cross-sell cards, summaries, and checkout flows.
- **Cart/Checkout Summary Upgrade:** Swapped manual price calculations with `cartBreakdown` from `src/lib/pricing.js`.
- **Coupon State:** Lifted the coupon state to `CartContext` to unify checkout totals and sync the calculated discounts across order summaries and WhatsApp.
- **WhatsApp Order Handoff:** Enriched the pre-filled text template with a complete rent breakdown (Base Rent, GST, Security, and 50% Upfront Split).
- **Orphaned Checkout Pages:** Integrated `/checkout` and `/order-success` views with `cartBreakdown` to prevent future code drift.

## 2026-06-02 — Trust Pages & Navigation Alignment
Wired up the static trust pages and unified office contacts across the application:
- **Created Pages:** Terms & Conditions (`/terms-n-conditions`), Shipping & Returns Policy (`/shipping-returns`), FAQs (`/faqs`), About Us (`/about` - rebuilt from SVG to responsive HTML/CSS), and Contact & Locations (`/contact`).
- **Footer Navigation:** Updated footer links to use SPA `<Link>` components instead of `#` placeholders, and redirected office location links to `/contact`.
- **Header Navigation:** Added a direct menu item for FAQs to improve discoverability.
- **About Us Alignment:** Refined centering and layout of founder cards and story section; improved responsiveness on mobile.
- **Build System Integration:** Registered paths in `scripts/copy-spa-404.js` to ensure clean folder setups and prevent 404s on GitHub Pages.
- **E2E Validation:** Created `e2e/trust-pages.spec.ts` in Playwright to verify relative navigation, accordion toggle behavior, and correct DOM rendering. All 9 tests passed.

## 2026-06-02 — UI Polish & UX Enhancements
Completed a series of UI polish tasks guided by design priorities:
- **Footer Centering**: Centered the brand logo/text block in the footer for cleaner balance above the two columns.
- **Catalog Navigation**: Swapped older external RentBasket catalog URLs with local SPA `<Link to="/catalog">` navigation in `WhatMakesDifferent.jsx`.

## 2026-06-02 — Foundation audit
Reviewed the whole codebase for weak foundations before building further. Key findings:
- **Cart/money math was duplicated across 5 screens** with divergent formulas, magic numbers (₹65/₹49/₹50), and two non-agreeing flags — already drifted (e.g. coupon silently dropped between cart and checkout).
- **Data-access "seam" only half-wired** — only the catalog used the data layer; product page, related items, and cart read static data directly, so a real API swap would leave half the app stale.
- No error boundary; no validation of the saved cart; stale `business-rules.md`; a dead duplicate toast system.

## 2026-06-02 — Captured the real backend contract
- Saved the live product catalog sample → `src/data/products-api-sample.json`.
- Documented the backend API (auth, catalog, server-side "proposal" cart) → `docs/rentbasket-api-contract.md`.

## 2026-06-02 — Phase 1: foundation hardening (no pricing changes)
Committed checkpoint `6b113de9` on branch `phase1-foundation`. Lint clean, production build passing, **no prices changed**:
- **A** — Mobile "Checkout" button now navigates correctly (was a dead "coming soon" toast).
- **B** — Cart-item IDs are now unique (`crypto.randomUUID`), fixing collisions when adding several items at once.
- **C** — Routed the product page, related items, cross-sell, and cart through the data-access layer (one "door" for the future API swap); added a product-page loading state.
- **D** — Added an app-wide error boundary (no more white-screen) + the cart now self-heals malformed/legacy items on load.
- **E** — Rewrote `business-rules.md` to match the code; removed the dead toast system.

## 2026-06-02 — V1 scope decisions
- **Checkout → WhatsApp handoff.** Clicking "Checkout" on the cart now opens a pop-up prompting the customer to finish on WhatsApp (`CheckoutContactModal`), pre-filled with their cart items. Template number `9999999999` (one-line swap when the real number arrives).
- **Removed all login/account UI** (the two `/account/orders` links) — V1 has no accounts.
- **Preserve** the `/checkout` and `/order-success` pages — orphaned for now but intentionally kept for a later release.

## 2026-06-02 — Pricing model confirmed (Hardik call + Proposal #2397)
Decoded the full pricing model from a real customer proposal and confirmed with Hardik. **Rent is per-month for the chosen duration.**

**Monthly rent build-up (all per month):**
1. **List rent** per item = catalog `rent_3/6/9/12` (shown struck-through).
2. **Discounted rent** per item = `list × (1 − percent_discount)`. Discount is **per-product** (varies item to item) and applies to the **base rent only** (before GST / security).
3. **Total Rent** = Σ list rents. **Base Rent** = Σ discounted rents. **Savings** = Total − Base (shown as a blended %).
4. **Coupon** (if any) = applied to the **whole-cart Base Rent total** (not per item), on the base price (excl. GST/security).
5. **GST = 18%** on the (discounted, post-coupon) Base Rent.
6. **Net Monthly Rent** = Base Rent + GST.

**One-time charges:**
- **Refundable Security (deposit)** = **list rent × `security_multiple`**, and the API returns it directly as a per-item `security` field. (Verified against the live cart — see the 2026-06-02 live-data entry below. The deposit comes straight out of the API.)
- **Transportation & Installation** = **free for monthly leases (1 month and up).** Short-term/day rentals go to a separate **"RentBasket Mini"** page (future) that does charge delivery + installation.

**Totals & payment:**
- **Net Payable (First Month)** = Net Monthly Rent + Security.
- Customer pays **50% upfront to confirm**, **50% after delivery**.

**Other decisions:**
- **No "Brand New" (+₹65) or "Combo" (₹49/₹50) surcharges** in the real model → remove from the site.
- **Quantity:** rent scales × count; deposit follows from rent so it scales too.
- **Show everything** on the V1 website — the cart should mirror this full proposal breakdown (list→discounted, savings, GST, security, 50% split).
- **Coupons:** in scope for V1. **KYC:** mandatory before delivery, likely via T&C acceptance — to be detailed.

**Discount data:** confirmed the **live API is the source of truth** for discounts. The sample file is stale (fridge shows 30% but the bill implies ~37%); we'll price off live data when wiring the API.

## 2026-06-02 — Duration scope & "RentBasket Mini" navigation (confirmed)
- **Coupon is deducted before GST** — no GST is charged on the discounted-away amount.
- **Main site shows durations 1 month and up.** Shorter (sub-month) durations live on a separate **"RentBasket Mini"** site/section.
- **Cross-navigation concept:** within the duration picker, the main site has a card *"Want to lease for less time?"* that sends the user to RentBasket Mini; Mini has a mirror card *"Want to lease for longer?"* that sends them back. Each site shows its own duration range. (Mini also carries delivery + installation charges, which the main site does not.)

## 2026-06-02 — Verified the model against the live cart
Opened a real personalised lead cart (`qr.rentbasket.com/lead-shopping`, lead 5383) in a browser and inspected its API responses (`api.rentbasket.com/get-proposal-cart-items-for-lead`). This confirmed the model on real data:
- Discount: item `rent: 769` (rent_6) → `rent_with_discount: 538` = 769 × (1 − 30%). ✓
- **Security comes straight from the API** as a per-item `security` field: `769 × security_multiple(2) = 1538`. So deposit = list rent × `security_multiple` — and we can read it directly rather than recompute.
- `cart_value` (₹1076) = Σ discounted monthly rents (538 + 538), i.e. monthly base rent before GST.
- Rent and Security are labelled **"/ Unit"** in the cart → both scale with quantity.
- Main cart durations are **3 / 6 / 9 / 12 months**.
- Production API hosts: `api2.rentbasket.com` (JWT) and `api.rentbasket.com` (cart/catalog) — matches the contract doc.

This corrected an earlier guess (deposit is `list rent × multiple`, not `multiple × net-monthly`; the shared bill used older discount settings — the live API is authoritative).

## 2026-06-02 — Built the pricing module (Step 2)
Created `src/lib/pricing.js` — pure functions for the whole confirmed model (discounted rent, unit security, whole-cart coupon, 18% GST, net monthly rent, security, net first month, 50% upfront split). Plus `src/lib/pricing.test.js` — **8 tests, all passing**, that reproduce:
- the **live cart** (lead 5383): base ₹1076, security ₹3076, net monthly ₹1270, net first month ₹4346, upfront ₹2173;
- the **proposal bill's** monthly section: base ₹1114 → GST ₹201 → net monthly ₹1315;
- coupon-on-base-before-GST behaviour.

This is the single source of truth every cart/proposal screen will call. Lint clean.

## 2026-06-02 — Catalog migration, Phase 1 (durations, discount display, Mini stub)
- **Durations trimmed to monthly only** (1/3/6/12 months) — day/sub-month tiers removed from the picker (they belong to RentBasket Mini).
- **Products now carry `percent_discount` (30%) and `security_multiple` (2)** via a defaults map (live API overrides later).
- **All shown prices are now the DISCOUNTED price**, not the list price — across catalog cards (with the list struck through), the product page (duration picker, pricing summary, sticky CTA), and the cart line items / cross-sell. Prices added to the cart are discounted too, so product → cart is consistent.
- **RentBasket Mini stub added** — a "Need it for less than a month?" card in the duration picker with a "Coming soon" badge (taps show a coming-soon toast). Visible intent, no dead link.

Lint clean, build passing, pricing tests green. (Phase 2 — the full cart breakdown with GST/security/50% — is still pending the user's sign-off on Phase 1.)

## 2026-06-02 — Phase 2: Implementation & Wiring
Successfully completed Phase 2, wiring the new pricing breakdown engine across the app:
- **Pricing inputs on addToCart:** Product detail page, mobile CTAs, and cross-sell quick-add items now populate `rent`, `percent_discount`, and `security_multiple`.
- **Zero-Deposit Retention:** Hand-picked recommended items added via quick-add are configured with `security_multiple: 0` to preserve the ₹0 deposit promo even if lease durations are adjusted in the cart.
- **Surcharges Removed:** Eliminated all placeholder ₹65 "Brand New" and ₹49/₹50 "Combo" surcharges from cart context, cross-sell cards, summaries, and checkout flows.
- **Cart/Checkout Summary Upgrade:** Swapped manual price calculations with `cartBreakdown` from `src/lib/pricing.js`.
- **Coupon State:** Lifted the coupon state to `CartContext` to unify checkout totals and sync the calculated discounts across order summaries and WhatsApp.
- **WhatsApp Order Handoff:** Enriched the pre-filled text template with a complete rent breakdown (Base Rent, GST, Security, and 50% Upfront Split).
- **Orphaned Checkout Pages:** Integrated `/checkout` and `/order-success` views with `cartBreakdown` to prevent future code drift.

## 2026-06-02 — Trust Pages & Navigation Alignment
Wired up the static trust pages and unified office contacts across the application:
- **Created Pages:** Terms & Conditions (`/terms-n-conditions`), Shipping & Returns Policy (`/shipping-returns`), FAQs (`/faqs`), About Us (`/about` - rebuilt from SVG to responsive HTML/CSS), and Contact & Locations (`/contact`).
- **Footer Navigation:** Updated footer links to use SPA `<Link>` components instead of `#` placeholders, and redirected office location links to `/contact`.
- **Header Navigation:** Added a direct menu item for FAQs to improve discoverability.
- **About Us Alignment:** Refined centering and layout of founder cards and story section; improved responsiveness on mobile.
- **Build System Integration:** Registered paths in `scripts/copy-spa-404.js` to ensure clean folder setups and prevent 404s on GitHub Pages.
- **E2E Validation:** Created `e2e/trust-pages.spec.ts` in Playwright to verify relative navigation, accordion toggle behavior, and correct DOM rendering. All 9 tests passed.

## 2026-06-02 — UI Polish & UX Enhancements
Completed a series of UI polish tasks guided by design priorities:
- **Footer Centering**: Centered the brand logo/text block in the footer for cleaner balance above the two columns.
- **Catalog Navigation**: Swapped older external RentBasket catalog URLs with local SPA `<Link to="/catalog">` navigation in `WhatMakesDifferent.jsx`.
- **Global Scroll-to-Top**: Integrated a `ScrollToTop` router-listener component in `App.jsx` to reset browser scroll position to (0, 0) upon navigating to any page.
- **Notification Improvements**: Changed Toast positioning to `bottom-right` with a `90px` upward shift so notifications do not cover the desktop action buttons or sticky mobile purchase bar.
- **Redirect on Purchase**: Configured both standard and mobile sticky "Add to Cart" buttons to immediately redirect users to the `/cart` page.
- Image Lightbox & Zoom Tuning: Reduced product hover zoom scale to `1.12` (subsequently removed the click-to-expand lightbox modal to keep the detail view clean).
- Simplified checkout inputs: Removed the "Start Date" selector from the product page to streamline ordering (defaulting to today's date).
- Product backgrounds: Swapped light gray `bg-gray-50` containers with `bg-white` in all product cards, detail galleries, and shopping summaries to improve transparent image display.
- **Horizontal Scrollable Related Products**: Replaced the related products ("You may also like") grid layout with a horizontal flex container and custom scrollbars to allow sliding through suggestions on all screen widths.
- **Removed Expandable Image View**: Completely removed the click-to-expand lightbox modal and body scroll-locking logic from `ProductGallery.jsx` to simplify interaction.
- **Mascot Video Placement**: Adjusted the flex layout order in [HeroSection.jsx](file:///g:/College/RentBasket/RentBasket_Website/src/components/HeroSection.jsx) to position the animated mascot video above the "Rent quality..." headline when in mobile/tablet views, keeping it next to the text on desktop.
- **Centered Office Chair Asset**: Replaced the off-center, right-aligned image for the Ergonomic Office Chair (`5.png`) with a perfectly centered version to balance the layout inside the card grids.
- **Download Section Overlap Fix**: Restructured [DownloadSection.jsx](file:///g:/College/RentBasket/RentBasket_Website/src/components/DownloadSection.jsx) to center all text elements and render the mobile phone mockup in-flow below the text on mobile/tablet viewports, resolving the text overlap and balancing the screen layout.
- **Simplification of "What Makes RentBasket Different" Scrolling**: Removed the custom parallax stacking card animation and scroll listeners in [WhatMakesDifferent.jsx](file:///g:/College/RentBasket/RentBasket_Website/src/components/WhatMakesDifferent.jsx) on mobile/tablet viewports, replacing it with a standard vertical scrolling list of feature cards to prevent page scroll overrides.
- **Clickable Product Cards, Hover Accordion CTA & Simplified Pricing**: Updated [ProductCard.jsx](file:///g:/College/RentBasket/RentBasket_Website/src/components/catalog/ProductCard.jsx) to make the entire card container clickable (`cursor-pointer` and `onClick` handler), while isolating child controls like the favorite heart. Additionally, simplified the card's pricing container to display the discounted monthly rate right-aligned side-by-side with the struck-through pre-discount list price (omitting the percentage off badge), dynamically filtered the duration chips based on availability, converted them to interactive buttons that update the displayed price on click, added a subtle red border/bg/text highlight to the active duration chip, and collapsed the "View Details" button by default so it transitions and extends open smoothly when the card is hovered. Also mapped default `percent_discount` (30%) and `security_multiple` (2) parameter mappings inside the mock data-access layer [products.js](file:///g:/College/RentBasket/RentBasket_Website/src/api/products.js) to ensure discounts and slashed prices render consistently for mock products.

---

## 2026-06-03 — Live API integration layer

Major rewrite of `src/api/products.js` to make the live Shivam API a first-class code path (rather than an afterthought stub). Still ships with mock data on by default — flipping `VITE_USE_MOCK_DATA=false` + providing the two env keys is all that's needed.

- **Auth module** (`src/api/auth.js` — new file): JWT token fetch with in-memory cache and a shared inflight promise, so N parallel calls at startup don't each fire a separate `POST /get-jwt-token`. Auto-retry on 401 via `clearToken()`. Dev mode routes through Vite's `/api` proxy (avoids CORS); prod uses the full `api2.rentbasket.com` URL.
- **Two catalog fetch paths in `products.js`**:
  - **Bulk path** (`loadAllProductsBulk`) — uses the new `GET /get-amenity-types` endpoint with a static `Authorization-Key` header (`VITE_CATALOG_API_KEY`). Fires 4 parallel requests: 1 bulk product fetch + 3 subcategory name lookups. Most efficient.
  - **Legacy path** (`loadAllProductsLegacy`) — 3-tier waterfall (categories → subcategories → products per subcategory). Fallback when `VITE_CATALOG_API_KEY` is not set.
  - The `loadAllProducts()` function picks between them automatically.
- **`normalizeProduct()` normaliser**: maps the raw API item shape (`amenity_type_id`, `rent_3/6/9/12`, `in_stock`, `is_trending`, etc.) onto the UI shape the rest of the app already understands (`id`, `pricing_by_duration`, `stock_status`, `is_trending`, `percent_discount`, `security_multiple`, etc.). `in_stock: 0` (DB error) is treated as in-stock. Durations with `rent = 0` are omitted from `pricing_by_duration` so they don't appear in the picker.
- **API contract doc** (`docs/api-contract.md` — new file): documents the auth, catalog, and cart endpoint shapes with real payload examples.
- **`.env.example` updated** with `VITE_API_APP_KEY`, `VITE_CATALOG_API_KEY`, and `VITE_API_BASE_URL` — everything needed to switch a dev environment from mock to live.

## 2026-06-03 — useProducts hook: cache-sharing & stale config

- `useProduct(id)` now reads `initialData` from the TanStack Query catalog cache (the `["products"]` key already populated by the catalog page). Navigating from catalog → product detail is now **instant** — no second network round-trip. Falls back to `fetchProductById` only on cold/direct URL loads.
- `useProducts()` now sets `staleTime: 10min`, `refetchOnWindowFocus: false`, `retry: false` — prevents redundant background refetches during a session.

## 2026-06-03 — Catalog UX improvements

- **Infinite scroll / pagination** (`ProductGrid.jsx`): `IntersectionObserver` sentinel at the bottom of the grid loads the next 12 products as the user scrolls. Page resets to 12 whenever the filter/sort changes. Prevents a long DOM at initial load.
- **Scroll-to-top button** (`Catalog.jsx`): Animated FAB (Framer Motion) appears after scrolling 400 px and returns the user to the top. Uses `AnimatePresence` for a smooth fade+slide in/out.
- **Filter robustness**: All array accesses on product fields (`tags`, `best_for`) now use optional chaining (`?.`). Live API products don't carry these mock-only fields, so the filter no longer throws on real data.
- **Sort fix**: Price sort now uses a `minPrice()` helper that picks the lowest available duration rent, instead of hardcoding `pricing_by_duration["1_month"]` — which doesn't exist for monthly-only (3/6/9/12) products.

## 2026-06-03 — Vite proxy config

Added a `/api` dev-proxy in `vite.config.js` that forwards requests to `https://api2.rentbasket.com`, rewriting the path. This means the auth module works in dev without CORS errors or needing a CORS-allowing backend header — no code change required when switching environments.

---

## Next up
1. Wire live API end-to-end: set env keys, remove mock flag, verify catalog renders with real data.
2. Later: restore full self-serve checkout (currently a WhatsApp handoff — `CheckoutContactModal`).
3. Investigate transparent image/SVG rendering issues on dark backgrounds.
