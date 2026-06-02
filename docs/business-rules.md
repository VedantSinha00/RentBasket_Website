# Business Rules — RentBasket Website

<!-- Read before touching pricing, duration logic, cart, or checkout. -->
<!-- Kept in sync with the code. If code and this doc disagree, fix the doc. -->

## What RentBasket Is

Furniture and appliance rental for young professionals relocating between Indian cities.
Target customer: 22–32, new city, doesn't want to buy furniture for a 6–18 month stay.
Core promise: "Premium home, zero ownership headache."

## ⚠️ Pricing model is under revision

The site currently runs on a **bundled mock catalog** (`src/data/products.js`). The **real
backend** has since been documented — see [`rentbasket-api-contract.md`](./rentbasket-api-contract.md)
and the sample response in [`../src/data/products-api-sample.json`](../src/data/products-api-sample.json).
The real model differs from the mock and will reshape the rules below:

- Monthly tiers `rent_3 / rent_6 / rent_9 / rent_12` and day tiers
  `rent_01d / rent_08d / rent_15d / rent_30d / rent_60d`.
- Deposit comes from `security_short_term` / `adv_security` / `security_multiple`
  (not a single `deposit` field).
- A per-product `percent_discount`, and per-cart-item coupons at confirm time.

**Open questions with the founder (gating the money math):** what is collected upfront at
checkout; which security field is the deposit; whether deposit is per-unit or per-line;
whether `percent_discount` is already baked into shown prices; and whether the "Brand New"
/ combo surcharges are real. Until answered, do **not** change pricing *behaviour* — only
structure.

## Data access

- All product data flows through one seam: `src/api/products.js`, consumed via the hooks in
  `src/hooks/useProducts.js`. Screens never import the raw product array directly.
- Today the seam serves the mock catalog. Setting `VITE_API_BASE_URL` (and, later, the real
  auth/identity/proxy work) is what swaps mock → live, ideally as a one-file change.
- Product constants that are configuration, not records — `DURATION_OPTIONS`, `CATEGORIES`,
  `SUBCATEGORIES`, `DEFAULT_FAQ` — may still be imported directly from `src/data/products.js`.

## Rental Durations

Canonical keys live in `src/data/products.js → DURATION_OPTIONS`
(`1_day, 3_days, 7_days, 15_days, 1_month, 3_months, 6_months, 11_months, 12_months,
24_months, 36_months`). **Rule:** never hardcode duration labels in components — derive them
from `DURATION_OPTIONS`. Add a new duration there first, then to each product's pricing map.

## Categories

Shown in the catalog: `All, Furniture, Appliances, Bestsellers, Short-Term Rental,
Complete Home Setup`. `Bestsellers`, `Short-Term Rental`, and `Complete Home Setup` are
**derived** views (by tag / `best_for`), not a product's literal `category` field.
`SUBCATEGORIES` currently defines Appliance subcategories (Washing Machines, Refrigerators, …).

## Cart Rules

- Cart state lives in `CartContext.jsx` and **persists to localStorage** (`rentbasket_cart`).
  It is normalised on load — malformed/legacy items are dropped so the pricing math can't crash.
- An anonymous cart id (`rentbasket_cart_id`, see `src/lib/cartId.js`) identifies the cart for a
  future backend sync. There is no login yet, so there is no `lead_id`/`user_id` — see the
  identity open question in the API contract doc.
- A cart line item is flat:
  `{ cartItemId, productId, name, category, image, duration, durationLabel, price, quantity,
  deposit, startDate, isBrandNew?, isRecommendation? }`.
- The same product can be added with different durations — they stack as separate lines.
- Same product + same duration merges (quantities add).

## Money math (current state)

- Totals are being **consolidated into one pricing module** so every screen agrees. Until that
  lands, treat the cart-page Order Summary as the reference calculation.
- Coupon `RENTBASKET10` = 10% off the rental subtotal, applied on the **cart page only**.
  Known gap (scheduled fix): it does **not** yet carry through to checkout / the final order.
- "Brand New" (+₹65/mo) and combo/bundle fees are **provisional** placeholders pending founder
  confirmation — do not treat as final.
- Deposit is currently summed per line (not × quantity). Per-unit vs per-line is unconfirmed.
- No GST/tax computed on the frontend (prices shown are treated as final for now).

## Checkout Rules (MVP)

- Single page: address + schedule + payment-method selection, then "Place Order".
- **No real payment processing** — order placement is simulated, then routes to
  `/order-success` with the order payload passed via router state.
- Never collect card numbers in the frontend — defer to a payment gateway later.

## Products (mock)

- Mock product data lives in `src/data/products.js`. Product IDs are kebab-case slugs
  (e.g. `sofa-3seat-01`), used as the `/product/:id` route param.
- Any new mock product must also be added to the `staticRoutes` / productIds loop in
  `scripts/copy-spa-404.js`, or its page will 404 on GitHub Pages.

## Copy & Tone Rules

- Premium · warm · editorial. Not SaaS-bootstrap, not big-box-retail.
- Ku the turtle mascot appears in hero/marketing sections — keep him out of transactional UI
  (cart, checkout, forms).
- Price display: always `₹` prefix, no decimals for whole numbers (₹499, not ₹499.00).
