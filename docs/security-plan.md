# Security Hardening — Implementation Plan

Last updated: 2026-06-08
Source: `/vibe-security` audit (2026-06-08).
Related: `docs/proxy-vs-publishable-decision.md` (the A/B decision — with the founder),
`docs/shivam-pending.md` → Security section (backend-owned items).

---

## Operating principle

- **Nothing here blocks frontend work**, and nothing forces us to wait on the founder's A/B decision
  to make real progress. We start with everything that is **common to both Option A and Option B**,
  and hold only the parts that genuinely differ between them.
- Two ownership tracks run in parallel: **our work** (frontend/infra) and **Shivam's work** (backend
  hardening). The backend work changes nothing about the requests we send — the backend just starts
  *validating* what it already receives — so it never blocks us.
- **Rotation ordering rule:** the API key is rotated *only after* it's out of the bundle (or
  downgraded). Rotating earlier just bakes a fresh key into the next build.

---

## The three workstreams

| Workstream | Depends on A/B decision? | Owner | Can start now? |
|---|---|---|---|
| **1 — Common foundation (frontend)** | No | Us | ✅ Yes |
| **2 — Common foundation (backend)** | No | Shivam | ✅ Request now; he implements in parallel |
| **3 — Key handling + cookie + rotation** | **Yes** | Us + Shivam | ⛔ Held for the founder's A/B call |

Workstreams 1 and 2 are the "common to both" work the founder review does **not** gate. Only
Workstream 3 waits on the decision.

---

## Workstream 1 — Common foundation, frontend  *(start now; no decision, no Shivam)*

Everything here is identical under Option A and Option B, and is ours to do today.

### 1a. Consolidate the API seam *(option-agnostic prep — shrinks the eventual A/B change to one file)*

Today each file in `src/api/` defines its own base URL and several re-implement the same
"fetch + 401-retry + error" logic:

- `auth.js`, `products.js`, `otp.js`, `kyc.js`, `profile.js`, `proposal.js`, `cart.js` each declare
  their own `const BASE = import.meta.env.DEV ? "/api" : import.meta.env.VITE_API_BASE_URL...`.
- `products.js`, `kyc.js`, `proposal.js` each hand-roll the Bearer + 401-retry fetch.

**Change (behaviour-preserving refactor):**
- Add `src/api/config.js` — the *single* place that resolves `API_BASE`, `JWT_BASE`, `AWS_BASE`, and
  how the key/headers are attached. Every `src/api/*.js` imports from here instead of reading
  `import.meta.env` itself.
- Add one shared `apiFetch` helper (Bearer + single 401-retry + JSON/error handling) and route
  `products`, `kyc`, `proposal`, `otp`, `profile` through it.

**Why this is the right "common" first step:** under *either* option, the eventual change is then
localized to `config.js` — Option A repoints `API_BASE` at the proxy and drops the inline keys;
Option B swaps in the split read-only key. One file changes instead of seven.

**Verify:** existing tests pass; manual smoke of catalog / OTP / KYC / profile / proposal against the
current testapi is unchanged (pure refactor — no behaviour change).

### 1b. CSP + security headers

Add at the hosting layer:

- `Content-Security-Policy: default-src 'self'; connect-src 'self' https://*.rentbasket.com; img-src 'self' data: https:; frame-ancestors 'none'; object-src 'none'` (tighten `script-src`/`style-src` after testing against the built app).
- `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`.

**Host note:** the live site is served via the Bitbucket pipeline to a static host; how response
headers are set depends on that host. If it doesn't support custom headers easily, we add a
`<meta http-equiv="Content-Security-Policy" ...>` fallback in `index.html` now (covers CSP; the other
headers follow once we confirm the host mechanism). **Open item: confirm how the current host sets
response headers.**

**Verify:** site loads with no CSP violations in console; all API calls still succeed.

---

## Workstream 2 — Common foundation, backend  *(send to Shivam now; he implements in parallel)*

Identical requirement under both options. Already written up in `docs/shivam-pending.md` → Security
(items 10–13, 15). Nothing here changes our request shapes, so it never blocks us:

- **#11** — re-price orders server-side; ignore client `rent`/`security`.
- **#12** — derive `user_id`/`lead_id` from the auth token, not the request body.
- **#13** — scope KYC + profile reads/writes to the authenticated owner.
- **#15** — rate-limit OTP and other expensive endpoints.
- **#10** — confirm whether testapi OTP sends *real* SMS (the one possible cost issue before launch).

### 2a. Client defense-in-depth trim *(ours, common to both — do *after* Shivam confirms #11/#12)*

Once the backend computes price and identity itself, trim the client so it can't even imply it's
authoritative: stop sending `rent`/`security` (and ideally `user_id`/`lead_id`) from
`src/api/proposal.js`. This is common to both options; it just waits on Shivam's confirmation so we
don't remove fields the backend still depends on.

---

## Workstream 3 — Key handling + cookie + rotation  *(HELD for the founder's A/B decision)*

This is the *only* part the founder review gates. Spelled out per branch so it's ready the moment
they decide:

### If Option A (proxy — recommended, deploy via subdomain per the decision doc §3):
1. Build the proxy (small function) holding the key server-side; point it at the existing
   testapi/testaws first — testable by us, no Shivam needed.
2. In `config.js` (from 1a), repoint `API_BASE` at the proxy and remove the inline keys; the proxy
   adds `Authorization-Key`/app-key and mints the JWT.
3. Deploy: Netlify Function on `api.rentbasket.com` + one CNAME in Wix (founder-owned account).
4. Move the login token to an `httpOnly; Secure; SameSite=Lax` cookie scoped to `.rentbasket.com`;
   client stops storing the token (replaces the `localStorage` blob in `src/lib/auth.js`).
5. **Rotate** the key (Shivam) → swap the proxy secret → invalidate old. No frontend release.

### If Option B (publishable key):
1. Confirm with Shivam that a scoped **read-only catalog key** can be issued (shivam #14).
2. In `config.js`, keep the read-only catalog key; route privileged ops (OTP/KYC/orders) through the
   backend's per-user login once it exists.
3. CSP (1b) remains the main defense for the token, which stays in browser storage.
4. **Rotate** the old all-powerful key once the privileged paths no longer depend on it.

---

## Sequencing summary

```
NOW, common to both (no decision):
  Workstream 1a — consolidate the API seam (ours)        ← green-light candidate
  Workstream 1b — CSP + security headers (ours)
  Workstream 2  — send Security asks to Shivam; he hardens in parallel
THEN (after Shivam confirms #11/#12):
  Workstream 2a — trim client (ours, common to both)
HELD for founder's A/B call:
  Workstream 3  — key handling (A: proxy / B: split key) → cookie (A) → rotate
```

**Launch gate:** Workstream 1 + Shivam #11/#12/#13 done, and the key either hidden (A) or downgraded
(B). The cookie work (A) and rotation can trail launch slightly — **except** rotation should happen
as soon as the key is out of the bundle.

---

## What I'd start first, on your green light

Workstream **1a** (consolidate the API seam) and **1b** (security headers) — both common to A and B,
both ours, both safe to do against the current backend. 1a is a behaviour-preserving refactor that
makes whichever option you later pick a one-file change. Nothing here is executed until you confirm.
