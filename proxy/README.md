# RentBasket API proxy (Option A — pre-build)

A tiny server-side proxy that sits between the website and the RentBasket API so
the secret keys never ship in the browser bundle. This is the **Option A** approach
from [`docs/proxy-vs-publishable-decision.md`](../docs/proxy-vs-publishable-decision.md),
deployed via **Sub-path A-i** (a subdomain on Netlify reached by one CNAME in Wix).

> **Status: pre-build, NOT yet wired into the website.** This is a provisional bet
> on Option A (reversible). The client still talks to the API directly until the
> founder confirms A and we do the WS3 cut-over. Nothing here changes the live site.

## What it does

- Browser calls `https://api.rentbasket.com/<endpoint>` instead of the API directly.
- The proxy injects secrets **server-side**:
  - `/get-jwt-token` → adds the `app_key` (browser no longer holds it).
  - `/get-amenity-types` → adds the `Authorization-Key` (read-only catalog key).
- Routes `/get-jwt-token` and `/update-kyc` to `testaws`, everything else to `testapi`.
- Sets CORS for the site origin (so this works cross-subdomain, and CORS leaves
  Shivam's plate — see shivam-pending #5).

Files: [`lib/handler.js`](lib/handler.js) is the runtime-agnostic core;
[`netlify/functions/api.js`](netlify/functions/api.js) is the Netlify wrapper;
[`dev-server.js`](dev-server.js) runs the same handler locally with plain Node.

## Run + test locally (no Netlify CLI, no deploy)

```bash
# from the repo root — use the same keys currently in .env.local
API_APP_KEY='base64:...' CATALOG_API_KEY='...' node proxy/dev-server.js

# in another shell — the proxy injects the key server-side (no CORS server-to-server):
curl http://localhost:8787/get-amenity-types        # → real catalog JSON, no key in the client
```

## Deploy (when the founder approves Option A)

1. Create a **new Netlify site, owned by the company account** (not a personal login).
   Base directory = `proxy`. It auto-detects `netlify.toml`.
2. Set env vars on the site: `API_APP_KEY`, `CATALOG_API_KEY`, `UPSTREAM_API`,
   `UPSTREAM_AWS`, `ALLOWED_ORIGIN=https://home.rentbasket.com` (see `.env.example`).
3. Add the custom domain `api.rentbasket.com` in Netlify, then add the **one CNAME**
   it gives you in **Wix DNS**. Netlify provisions the TLS cert.

## Wiring the website to it (later — WS3, one file)

Because of the WS1 seam, this is a one-file change in
[`src/api/config.js`](../src/api/config.js):

- Set `API_BASE` to the proxy origin (`https://api.rentbasket.com` in prod).
- Remove `APP_KEY` / `CATALOG_API_KEY` from the client (the proxy holds them).
- In `auth.js`, stop sending `app_key` in the `/get-jwt-token` body (proxy adds it).
- In `products.js` `catalogFetch`, drop the `Authorization-Key` header (proxy adds it).

Then **rotate the old key** (it's out of the bundle) — a one-line swap of the proxy's
env var, no website release.

## Known gaps (pre-build)

- **Multipart upload** (`/update-kyc`, FormData) is not proxied yet — needs binary
  body passthrough. KYC upload is independently broken upstream (shivam-pending #7),
  so it isn't blocking. Add before relying on KYC uploads through the proxy.
- **httpOnly cookie** for the JWT is a later step (WS3/Phase 3); today the browser
  still holds the JWT (a session token, not the app-key secret).

## Reversibility

If the founder prefers Option B, delete `proxy/` and the one-line eslint entry — the
WS1 seam and the rest of the app are untouched.
