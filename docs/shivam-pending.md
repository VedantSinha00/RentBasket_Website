# Shivam — Pending Action Items

Last updated: 2026-06-07

---

## 🔴 Blocking (needed before any new API can be tested)

### 1. Auth header for new endpoints
All new endpoints (OTP, KYC, cities, profile) are returning 401. We don't know what auth header they expect. The catalog uses `Authorization-Key`, but that doesn't work on these.

**Question:** What header/key should we send to reach `/generate-otp4-new`, `/kyc`, `/get-kyc-doc-list`, `/get-ig-cities`, and `/update-user-profile`?

---

### 2. `testapi.rentbasket.com/get-jwt-token` returning 401
Our app key (`base64:/mIAk2D0P+xn5OHNwyvk1JjaR3uABCOmw5hBGxQGLTk=`) stopped working on this endpoint. The same endpoint on `testaws.rentbasket.com` works — but we don't know if that's intentional.

**Question:** Is the JWT endpoint broken on testapi, or was it intentionally moved? Which server should we be fetching JWT from?

---

## 🟡 API changes needed (delivery address)

### 3. Delivery address — consolidated asks
The current add/update/get endpoints tie addresses to a `proposal_id`. We need user-level address management. Specific requests:

- **New endpoint:** `GET /get-user-addresses?mobile=...` — returns all saved addresses for a user, without needing a proposal_id
- **New fields** on `add-delivery-address` and `update-delivery-address`: `address_line_2`, `landmark`, `state`, `contact_name`, `contact_phone`
- **lat/lng** — can these be optional? We're handling GPS on our side but want the submit to work without coordinates if GPS is denied
- **Delete endpoint** — we have a delete button in the Address Book; is there a delete endpoint or should one be added?
- **Default flag** — can `add-delivery-address` and `update-delivery-address` accept `is_default: 1` so the API remembers which address to pre-fill?

---

## 🟡 Missing APIs (needed to complete the flow)

### 4. My Orders page
There is no endpoint to fetch a user's order history. The `/account/orders` page is currently mocked.

**Needed:** `GET /get-user-orders?mobile=...` or equivalent — returning a list of the user's past and active orders with status.

---

## 🟢 Pre-launch (needed before home.rentbasket.com goes live)

### 5. CORS headers for production
API calls from `home.rentbasket.com` to `testapi.rentbasket.com` will be blocked by the browser without CORS headers. In dev we work around this with a Vite proxy, but in production the calls go direct.

**Needed:** Add `Access-Control-Allow-Origin: https://home.rentbasket.com` (or `*` for now) to all API responses on testapi.

---

## 🔵 Still in progress (from earlier)

| Item | Status |
|------|--------|
| Product descriptions / content | Hardik writing — share when ready |
| Coupon validation endpoint | Shivam building — share when ready |

---

## 🔴 Newly identified (2026-06-08)

### 6. `update-user-profile` — wrong HTTP method + unknown params
Our API sheet listed this as GET-but-with-a-body, so we implemented it as POST. The server returns 405 Method Not Allowed — it only accepts GET. Even when called as GET with query params (`user_id`, `first_name`, etc.) it returns "invalid Details".

**Questions:**
- Confirm: is this `GET` with query params, or `POST` with a JSON body?
- What are the correct parameter names? (We're using `user_id`, `first_name`, `last_name`, `email`)

### 7. `POST /update-kyc` on testaws — 500 Server Error
KYC document upload (`POST /update-kyc`) on `testaws.rentbasket.com` returns a 500. This blocks the KYC upload step entirely — users can view the doc list but can't submit documents.

**Question:** What's broken on the testaws `/update-kyc` endpoint?

### 9. Email — collected but never saved or verified

The app collects the user's email address in two places:
- **Account Details page** — editable email field; attempts to save via `update-user-profile` (blocked by item #6) so it only persists in localStorage, never reaches the server
- **Checkout form** — email field is shown to the user but is not included in any API payload (not sent with the order)

There is no email verification step anywhere in the flow, and no order confirmation email is sent after a successful order.

**Questions:**
- Will `update-user-profile` (once fixed per item #6) accept and persist the email field server-side?
- Is email verification (OTP or magic link) planned before launch, or is phone the only identity factor?
- Is order confirmation by email planned? If yes, what triggers it — the `confirm-proposal-for-tenant` call? We need to know so we can wire the email field into the right payload.

---

### 8. `GET /get-product-recommendations` — 500 when product has no recommendations
The endpoint works correctly when a product has recommendations (returns 200 + list). When a product has no recommendations, it returns 500 "Undefined variable $recommendations" instead of an empty array. This is a PHP variable initialization bug — `$recommendations` is never set to `[]` before the query, so if the query returns nothing, PHP crashes.

**Fix needed:** Initialize `$recommendations = []` before the database query so the endpoint returns `{"recommendations": []}` instead of 500.

---

## 🔒 Security (pre-launch hardening)

Context: the website is a backend-less SPA, so the app key it uses to mint JWTs ships to every
browser. We are moving that key behind a server-side proxy on our side (see `docs/security-plan.md`),
but the items below are **backend-only** and can only be done by you. None of them change the
request shapes we send — the backend just needs to start *validating* what it receives. We can keep
building and testing against `testapi` while these land in parallel.

### 10. Real SMS gateway on OTP? (quick confirm — possible cost issue even pre-launch)
`/generate-otp4-new` is reachable by anyone holding the (currently public) app key.

**Question:** Does the **testapi** OTP endpoint send real SMS through a live provider, or a test/mock
sink? If it's live, the public key means anyone can trigger real texts (SMS-bombing / cost) before
we even launch. This is the one security item that could cost money today.

### 11. Order/proposal API must re-price server-side
`add-to-proposal-for-lead` currently receives `rent` and `security` **from the client**. The browser
controls these values, so a tampered request can confirm a rental at any price (e.g. `rent: 1`).

**Needed:** The backend must look up the canonical rent and security for each `amenity_type_id` +
`duration` and **ignore** the `rent`/`security` fields in the request body. We'll stop sending them
once you confirm this is in place.

### 12. Bind `user_id` / `lead_id` to the authenticated token, not the request body
`add-to-proposal-for-lead`, `confirm-proposal-for-tenant`, and `update-user-profile` take `user_id`
(and `lead_id`) as request parameters. Since these come from client storage, a request can name
**another** customer's `user_id` and attach an order/profile change to them (IDOR).

**Needed:** Derive the acting user from the session/JWT and reject (or ignore) a `user_id`/`lead_id`
that doesn't match the token.

### 13. Scope KYC + profile reads/writes to the caller
These endpoints are keyed by a client-supplied `mobile` / `user_id`:
`/kyc?mobile=...`, `/get-kyc-doc-list?mobile=...`, `POST /update-kyc` (mobile in body),
`/update-user-profile` (user_id in body).

Because the only credential is the shared app-level JWT, whether one user can read or overwrite
**another user's KYC documents** (government-ID PII) depends entirely on backend authorization.

**Needed:** Confirm — and enforce — that each of these checks the `mobile`/`user_id` belongs to the
authenticated principal. This is the highest-impact item because it concerns ID-document PII.

### 14. App key: split + rotate (coordinate timing with us)
- **Split:** Can the app key be scoped so a low-privilege **read-only catalog key** (safe to ship in
  the bundle, like a publishable key) is separate from the privileged key used for OTP/KYC/orders?
  This lets us keep catalog fetching simple while protecting the dangerous operations.
- **Rotate:** Once we've moved the privileged key behind our proxy (we'll tell you when that's
  verified), please **rotate** the current app key and invalidate the old one. Rotating *before* that
  is pointless — the new key would just leak into the next build. After the proxy is live, rotation
  is a one-line env swap on our side with no frontend release.

### 15. Rate limiting / abuse prevention on auth + expensive endpoints
With the app key public, OTP send/verify and other endpoints can be scripted directly.

**Needed:** Rate-limit OTP generation per mobile/IP, cap OTP verification attempts (brute-force), and
expire OTPs quickly. Same consideration for any other write/expensive endpoints.
