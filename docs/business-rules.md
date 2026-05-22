# Business Rules — RentBasket Website

<!-- Read before touching pricing, duration logic, cart, or checkout. -->

## What RentBasket Is

Furniture and appliance rental for young professionals relocating between Indian cities.
Target customer: 22–32, new city, doesn't want to buy furniture for a 6–18 month stay.
Core promise: "Premium home, zero ownership headache."

## Rental Duration Keys

The canonical duration keys are defined in `src/data/products.js → DURATION_OPTIONS`:

| Key | Label | Typical use case |
|---|---|---|
| `1_day` | 1 Day | Events, shoots |
| `3_days` | 3 Days | Short trial |
| `7_days` | 7 Days | Week trial |
| `15_days` | 15 Days | Half-month |
| `1_month` | 1 Month | Standard rental |
| `3_months` | 3 Months | Medium stay |
| `6_months` | 6 Months | Standard relocation |
| `12_months` | 12 Months | Long stay |

**Rule:** Never hardcode duration labels in components. Always derive from `DURATION_OPTIONS`
or a product's `pricing` map. If a new duration is added, add it to `DURATION_OPTIONS` first,
then update the pricing maps in `products.js`.

## Pricing Model (current MVP)

- Prices are per-duration-key, defined in each product's `pricing: { "1_month": 499, ... }` map.
- No GST computation on frontend (MVP: prices shown are final customer prices).
- No deposit shown on frontend yet (MVP gap — add when backend is ready).
- If a duration key is missing from a product's pricing map, the UI should show "Contact us" — never show ₹0 or NaN.

## Cart Rules

- Cart state lives in `CartContext.jsx`. No persistence (refreshing clears cart — MVP).
- A cart item is: `{ product, selectedDuration, quantity }`.
- Same product can be added multiple times with different durations (they stack as separate line items).
- Cart total = Σ (price[selectedDuration] × quantity) for each line item.
- There is no minimum order value in the MVP.

## Checkout Rules (MVP)

- Checkout is a multi-step form: Address → Schedule → Payment.
- No real payment processing (MVP): checkout submits to a form endpoint (see .env.example `VITE_FORM_ENDPOINT`).
- On submission, route to `/order-success` with a booking summary.
- Never collect card numbers in the frontend form — defer to the payment gateway link.

## Products

- All product data lives in `src/data/products.js` — the single source of truth.
- Product IDs are kebab-case slugs (e.g. `sofa-3seat-01`). Used as URL params in `/product/:id`.
- Any new product added to `products.js` must also be added to the `staticRoutes` / productIds loop in `scripts/copy-spa-404.js` or its page will 404 on GitHub Pages.
- Product categories: `Furniture`, `Appliances`, `Bestsellers`. Category membership is the `category` field on each product.

## Copy & Tone Rules

- Premium · warm · editorial. Not SaaS-bootstrap, not big-box-retail.
- Avoid: "Buy now", "Add to cart" (say "Add to Basket"), corporate speak, exclamation overuse.
- Ku the turtle mascot appears in hero/marketing sections. Don't put him in transactional UI (cart, checkout, forms).
- Price display: always use `₹` prefix, no decimals for whole numbers (₹499 not ₹499.00).
