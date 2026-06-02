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

---

## Next up
1. **Feed the module real-shaped data.** Decide how the catalog carries the live fields (`rent_3/6/9/12`, `percent_discount`, `security_multiple`) — the current mock uses an older shape. (See the data-shape decision under discussion.)
2. **Point the cart / order summary at the module** so the site shows the full proposal breakdown (list→discounted, savings, GST, security, net first month, 50% split).
3. Align durations to 3/6/9/12 months on the main site; sub-month tiers + the cross-link "RentBasket Mini" cards come with the Mini build.
4. Remove the placeholder "Brand New" / "Combo" surcharges.
5. Later: "RentBasket Mini" page (short-term rentals with delivery/installation charges); restore full self-serve checkout.
