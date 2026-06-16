# RentBasket — Website

Furniture rental for young professionals relocating between cities. This is the
customer-facing storefront: browse the catalog, build a basket, check out, pay,
and complete KYC.

**Live site:** https://rentbasket.com
**Stack:** React 18 + Vite · React Router · Tailwind CSS + shadcn/ui-style
primitives · Framer Motion · TanStack Query
**Author:** Vedant Sinha (internship at RentBasket) · <sinha.vedant25@gmail.com>

> **About this repository**
> This is a public copy I keep as proof of the work I did during my internship at
> RentBasket. The product and brand belong to RentBasket; this repo is shared with
> the team's knowledge, as a portfolio record of my contribution. It is a frontend
> SPA — it contains **no secrets**. The Razorpay key used in the browser is a
> *publishable* key id (safe to ship, like a Stripe `pk_` key); the Razorpay
> **Key Secret** and all payment verification live server-side, never in this repo.
> See [Security](#security) below.

---

## What this project was when I picked it up

When the project was handed to me (late March 2026), the **design foundation was
solid** — the look, the components, and the browse flow all worked. The problems
were underneath:

- **Product decisions weren't pinned down.** Pricing, deposit, and lock-in rules
  were inconsistent across the site; product categories contradicted each other
  between the homepage, the catalog, and the data; the trust pages (terms, refund
  policy, FAQ) were dead links or missing; and there was no clear spec for
  self-serve checkout.
- **The build process aimed at the wrong target.** The rebuild was largely
  AI-agent-driven and optimized for visual polish over product progress. The agent
  docs described a stack that didn't exist, features were marked "done" on manual
  checks with no tests behind them, and there was no real backend — the catalog was
  a bundled mock.

In short: it *looked* productive, but "done" didn't reliably mean "works," and
there was no path from the static SPA to a real, transacting storefront.

## Where I took it

By mid-June 2026 the site was **live and taking real payments**, with the product
and build both grounded:

- **Grounded the build to reality.** Reconciled the AI-generated docs with the
  actual code, set up a real verification gate (Vitest unit tests + Playwright e2e),
  and fixed the structural bugs that were silently breaking layouts.
- **Pinned down the product decisions.** Wrote specs for pricing/deposit/GST and
  the post-checkout flow; built the missing trust pages (Terms, Shipping & Returns,
  FAQs, About, Contact); reconciled the product taxonomy across the site.
- **Connected a real backend.** Replaced the bundled mock with the live catalog,
  OTP signup, KYC document upload, order history, and an address book — wired
  against the team's API with JWT auth.
- **Shipped self-serve checkout + payments.** Built the full checkout → KYC flow,
  a duration-grouped basket (each rental tenure checks out as its own order), and
  integrated **Razorpay** end-to-end (order creation → payment → server-side
  verification, with full and 50%-upfront payment options).
- **Hardened for launch.** Made the checkout fail closed, hardened responsiveness
  across 375–2560px, fixed the live OTP signup flow, and moved the app off test
  infrastructure onto the live API and domain.

The two changes that don't belong to me are the original visual design and the
backend itself — those sit with the founder and the backend developer. My work was
the **product decisions, the frontend build, and the engineering process** that
turned the prototype into a launched product.

---

## Getting started

```bash
npm install
npm run dev      # Vite dev server on http://localhost:8080
```

Other scripts:

```bash
npm run build    # production build + SPA 404 routing for static hosting
npm run lint     # ESLint
npm run test     # Vitest unit tests
npx playwright test   # end-to-end tests
```

### Environment

Copy `.env.example` to `.env.local` and fill in the values you need. With no
`VITE_API_BASE_URL` set, the app falls back to a bundled mock catalog, so it runs
locally with zero backend. See `.env.example` for the full list (API base URLs,
the Razorpay **publishable** key id, WhatsApp contact, etc.).

## Project conventions

Design system, tokens, and the definition-of-done for new pages are documented in
[`CLAUDE.md`](./CLAUDE.md). Notable product/engineering decisions are recorded in
[`DECISIONS.md`](./DECISIONS.md), and the post-checkout flow is spec'd in
[`POST_CHECKOUT_FLOW.md`](./POST_CHECKOUT_FLOW.md).

## Security

This is a client-side SPA, so everything it ships is, by design, visible in the
browser — making the source public exposes nothing that the live site doesn't
already. The repository has been checked (working tree **and** git history) and
contains no secrets:

- The **Razorpay key id** used in the browser is a *publishable* key — it is meant
  to be public, like a Stripe `pk_` key.
- The Razorpay **Key Secret** and all payment **verification** are server-side only
  and are not in this repository.
- Payment success is verified on the backend after Razorpay returns, so the
  client-side code cannot be edited to fake a paid order.

If a real secret were ever committed, deleting it in a later commit would **not**
be enough — it would need to be purged from history and the key rotated.

---

## Author & attribution

The product-decision, frontend, and engineering-process work documented above was
done by **Vedant Sinha** during an internship at RentBasket
(<sinha.vedant25@gmail.com>). The RentBasket product, brand, and underlying
business belong to RentBasket; this public repository is kept, with the team's
knowledge, as a portfolio record of that contribution.

Please don't repackage this repository or its docs as your own work. If you'd like
to reference or build on it, an attribution back to this repo and to Vedant Sinha
is appreciated. (The original visual design and the backend service are the work of
the RentBasket team, not part of my contribution.)
