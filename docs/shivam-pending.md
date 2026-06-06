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
| Related products endpoint (`/get-product-recommendations`) | Shivam building — share when ready |
| Product descriptions / content | Hardik writing — share when ready |
| Coupon validation endpoint | Shivam building — share when ready |
