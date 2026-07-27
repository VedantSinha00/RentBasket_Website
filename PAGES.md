# RentBasket — Page List

Source of truth: [src/App.jsx](src/App.jsx). Update this doc whenever a route is added, removed, or renamed there.

Note: every route below (except `/` and the catch-all) is registered twice — with and without a trailing slash — via the `routePair()` helper, since GitHub Pages serves route folders as `/path/`.

## Marketing / public

| Route | Page file | Purpose |
|---|---|---|
| `/` | [Index.jsx](src/pages/Index.jsx) | Homepage — hero, renting carousel, "What makes different", myths/facts, testimonials, FAQ teaser |
| `/catalog` | [Catalog.jsx](src/pages/Catalog.jsx) | Browse Catalogue — full product listing/search/filter |
| `/product/:id` | [ProductDetails.jsx](src/pages/ProductDetails.jsx) | Single product detail page |
| `/about` | [About.jsx](src/pages/About.jsx) | About RentBasket |
| `/contact` | [Contact.jsx](src/pages/Contact.jsx) | Contact page |
| `/faqs` | [FAQs.jsx](src/pages/FAQs.jsx) | Full FAQ list |
| `/terms-n-conditions` | [TermsConditions.jsx](src/pages/TermsConditions.jsx) | Terms & Conditions |
| `/shipping-returns` | [ShippingReturns.jsx](src/pages/ShippingReturns.jsx) | Shipping & Returns policy |

## Shopping / checkout flow

| Route | Page file | Purpose |
|---|---|---|
| `/basket` | [Basket.jsx](src/pages/Basket.jsx) | Cart / basket page (`/cart` redirects here) |
| `/checkout` | [Checkout.jsx](src/pages/Checkout.jsx) | Checkout form |
| `/customer-validation` | [CustomerValidation.jsx](src/pages/CustomerValidation.jsx) | Customer identity/phone validation step |
| `/order-summary` | [OrderSummary.jsx](src/pages/OrderSummary.jsx) | Order summary before/after placing order |
| `/order-success` | [OrderSuccess.jsx](src/pages/OrderSuccess.jsx) | Order confirmation page |
| `/wishlist` | [Wishlist.jsx](src/pages/Wishlist.jsx) | Saved/wishlisted products |

## Account (protected routes require login — see `ProtectedRoute`)

| Route | Page file | Purpose |
|---|---|---|
| `/profile` | [Profile.jsx](src/pages/Profile.jsx) | Profile landing/menu page |
| `/account/details` 🔒 | [AccountDetails.jsx](src/pages/AccountDetails.jsx) | Edit account details |
| `/account/orders` 🔒 | [MyOrders.jsx](src/pages/MyOrders.jsx) | Order history |
| `/kyc` 🔒 | [Kyc.jsx](src/pages/Kyc.jsx) | KYC verification |

## Redirects (no page component)

| From | To |
|---|---|
| `/catalogue`, `/catalogue/` | `/catalog/` |
| `/cart`, `/cart/` | `/basket/` |

## Fallback

| Route | Page file | Purpose |
|---|---|---|
| `*` (any unmatched path) | [NotFound.jsx](src/pages/NotFound.jsx) | 404 page |

---

**Total: 18 distinct pages** (19 files minus `NotFound`, which is the catch-all rather than a routed page in its own right — plus `NotFound` itself = 19 files, 18 real destinations + 1 fallback).
