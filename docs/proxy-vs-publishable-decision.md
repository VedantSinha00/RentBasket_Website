# Decision Doc: How to protect the API key — Proxy vs. Publishable-key model

Last updated: 2026-06-08
Audience: founder + frontend. Goal: understand the problem, the two options, the costs, and the
ownership implications well enough to make a deliberate choice. Related: `docs/security-plan.md`,
`docs/shivam-pending.md` (Security section).

---

## 1. The problem in plain language

The RentBasket website is a "static" site: it's just HTML/JavaScript files served to the browser,
with **no server of our own** in between. To talk to the backend API, the website carries an
**app key**. That key is used to get a login token (JWT), and that token currently authorizes
*everything* the API can do — load products, send OTP texts, read/write KYC (ID documents), and
place rental orders.

Because the site is pure static, **that key is baked into the JavaScript that every visitor
downloads.** Anyone can open browser developer tools and copy it. We confirmed this: the key strings
are literally present in the built file (`dist/assets/index-*.js`).

> Today this is low-risk because it's a *test* key on a site that isn't public yet, with no payments.
> But before launch we have to deal with it, because a public version of this is a real problem:
> someone could script the API directly — spam OTP texts (costs money), or, if the backend trusts
> what the browser sends, manipulate prices or read other people's KYC documents.

### The foundation that's required either way

Whatever we decide about the key, the backend **must** stop trusting the browser for sensitive
decisions (this is Track B in the plan — Shivam's work):

- The backend must compute prices itself and ignore prices sent by the browser.
- The backend must figure out *who you are* from your login token, not from a user-id the browser
  sends — so you can't act as another customer.
- KYC and profile endpoints must only let you see/change *your own* records.
- OTP and login must be rate-limited so they can't be abused at scale.

**No key strategy is a substitute for this.** Even a perfectly hidden key is still used by the
real website, and if the backend trusts whatever the website sends, an attacker just sends their own
requests with their own (or the leaked) key. So the backend hardening is the non-negotiable base.
The decision in this doc is about what to do with the *key itself* on top of that base.

---

## 2. The two options

### Option A — Run a tiny proxy of our own ("edge function")

We deploy a very small piece of server code (an "edge function" or "worker") that sits between the
website and the backend API. The browser calls *our* proxy; the proxy adds the secret key and
forwards the request to the backend.

```
Browser  ─────►  Our proxy (holds the key)  ─────►  Backend API (testapi/testaws)
         no key                            adds key
```

What this gives us:

- **The key never reaches the browser.** It lives only in the proxy's server-side secret store.
- **Rotating the key becomes trivial** — change one secret in the proxy; no website rebuild.
- **It also fixes the CORS problem** (Shivam item #5): because the browser only ever talks to our own
  domain, the "cross-origin" blocking issue disappears. One less thing for Shivam to configure.
- **It unlocks secure login cookies** ("httpOnly"): the proxy can store the login token in a cookie
  that JavaScript *cannot* read, so even a website bug can't leak it. (Without a proxy, the token has
  to sit in browser storage where scripts can read it.)

The cost: it's a new piece of infrastructure we own and maintain (small, but real), and it needs an
account somewhere to run.

### Option B — Treat the key as "publishable" and lock down the backend instead

Some keys are *designed* to be public — for example, Stripe's "publishable key" is meant to ship in
the browser; it can only do harmless things. The idea here is to make our situation look like that:

- Split the one all-powerful key into **two**: a **read-only catalog key** (safe to ship in the
  browser, because it can only read the product list) and a **privileged path** for the dangerous
  operations (OTP / KYC / orders).
- The dangerous operations are then protected by **proper per-user login on the backend** — i.e. you
  can only act after you've logged in as yourself, and only on your own data — rather than by the
  mere possession of a shared key.

```
Browser  ──(read-only key, ok to be public)──►  Backend: catalog (read only)
Browser  ──(your personal login session)─────►  Backend: OTP / KYC / orders (per-user checks)
```

What this gives us:

- **No infrastructure for us to build or run** — the website stays purely static.
- The exposed key no longer matters, because it can only read public product data.

The cost: it leans **entirely on the backend** doing the per-user gating correctly (more work for
Shivam, and we're trusting it's done right), it **does not** fix CORS (#5 stays on Shivam's list),
and it **does not** give us the secure httpOnly login cookie — the login token still sits in
browser storage.

### How they relate (important)

These are **not** strictly either/or. Option B's backend hardening is the same Track B work that's
required no matter what. Option A is an **extra protective layer** we *add on top* — it also happens
to solve CORS and cookie storage. So the real question is:

> Given that the backend hardening has to happen anyway, **do we also invest in running our own
> proxy layer (A), or do we rely on the backend gating alone and just downgrade the public key (B)?**

---

## 3. Costs

### Option A — infrastructure cost (small, sometimes zero)

The proxy is a tiny function. Realistic hosting choices and their pricing (as of early 2026 —
**verify current pricing before committing**):

| Provider | Free tier | Paid | Commercial use on free tier? | Notes |
|---|---|---|---|---|
| **Cloudflare Workers** | 100,000 requests/**day** | "Workers Paid" **$5/month** → 10M requests/mo included, then ~$0.30/million | **Yes** | Best fit for us; free tier is generous; commercial use allowed |
| **Netlify Functions** | 125,000 requests/**month**, 100 hrs runtime | Pro **$19/user/month** + overage | Yes (with limits) | Convenient if we ever host the site here |
| **Vercel Functions** | Hobby plan, generous limits | Pro **$20/member/month** | **No** — Hobby is non-commercial; a company site needs Pro | More expensive for commercial use |

**Practical read:** for a furniture-rental site's traffic, **Cloudflare Workers' free tier
(100k requests/day) is almost certainly enough**, and even if we exceed it, it's **$5/month**. So the
direct money cost of Option A is **₹0 to ~₹450/month**. The *real* cost of A is **our time** — roughly
an afternoon to build and wire it up, plus owning a small piece of infra going forward.

**Deployment topology (DNS is on Wix — confirmed 2026-06-08).** This rules out the cheapest "clean"
path. Cloudflare Workers can only attach to a custom domain (`home.rentbasket.com/api/*` or
`api.rentbasket.com`) when the domain's DNS zone is **on Cloudflare** — a plain CNAME from external
DNS to a Worker does not route. With DNS staying on Wix, the two realistic sub-paths are:

- **Sub-path A-i — Proxy on a subdomain via one CNAME (least disruptive, recommended).** Run the
  proxy on `api.rentbasket.com`, hosted on **Netlify Functions** (or Vercel). Add a single CNAME
  record in Wix DNS pointing `api.rentbasket.com` at the proxy host; the host provisions the TLS cert.
  Nothing else about the current site, hosting pipeline, or Wix setup changes. Because the proxy is a
  different origin from the site, it must send CORS headers — but **we** control the proxy, so we set
  them ourselves. (Net effect: CORS item #5 leaves Shivam's plate — our proxy handles it, not the
  backend.) The secure httpOnly login cookie is still achievable by scoping it to `.rentbasket.com`.
  Provider fit: **Netlify free tier (125k function calls/month) supports external-DNS custom
  subdomains and is the cost winner here.** Cloudflare Workers is awkward in this sub-path because it
  wants the zone on Cloudflare.
- **Sub-path A-ii — Move DNS to Cloudflare (cleanest long-term, more invasive).** Free, and unlocks
  same-origin `home.rentbasket.com/api/*` on a $0–5/mo Worker. But it means changing nameservers at
  the registrar and recreating every existing Wix DNS record (including any email/MX), with care not
  to break the current Wix-connected setup. A bigger, founder-involved change — not worth it just for
  this.

**Recommendation: Sub-path A-i** (Netlify Functions on `api.rentbasket.com`, one CNAME in Wix). It's
the smallest change, touches nothing that's already working, and keeps DNS where it is.

### Option B — no infra cost, but a different kind of cost

- **₹0 infrastructure.**
- **Cost = Shivam's backend engineering time** to implement and verify proper per-user auth and the
  key split, plus the ongoing reliance on that being correct.
- **Hidden costs that remain:** CORS (#5) still needs solving, and the login token stays in
  browser-readable storage (weaker against website bugs).

---

## 4. Ownership & continuity (important for the founder)

Whichever option involves an account — and Option A does (Cloudflare/Netlify/Vercel) — **that account
should be created in the company's / founder's name, not an individual's.** This matters because:

- The person who sets it up may not be around long-term (e.g. an internship ending).
- The account holds production secrets (the API key) and controls a piece of live infrastructure.
- The founder should be able to see, rotate, and revoke everything without depending on anyone.

Recommended setup: a company email owns the account; access is granted to whoever operates it; the
founder retains the master login. This is a deliberate, founder-involved step — not something to spin
up on a personal login to move fast.

> Note: this ownership concern is itself a mild point **in favor of taking the decision slowly and
> deliberately** rather than rushing infrastructure into existence under the wrong account.

---

## 5. Does the Wix DNS detail decide this? No — refreshed comparison

Knowing DNS is on Wix changes only *how Option A would be deployed* (a proxy on a subdomain via
Netlify + one CNAME — see §3). It does **not** settle Option A vs Option B. If anything it makes A a
little more setup (a Netlify account + subdomain, instead of the cheap same-origin path), which
slightly raises the appeal of B's zero-infrastructure approach. Here is the honest side-by-side, with
Wix folded in. **Both options require the same backend hardening** (the backend must compute prices,
identify users from their login token, scope KYC to the owner, and rate-limit OTP) — that's the
foundation either way. The differences below are only about the *key* and *plumbing* on top:

| | **Option A — proxy (deployed via subdomain)** | **Option B — publishable key** |
|---|---|---|
| Infrastructure we own | Netlify account + `api.rentbasket.com` + one CNAME in Wix | None — site stays purely static |
| Money cost | ₹0 (Netlify free tier); maybe ~$5/mo later | ₹0 |
| Key in the browser bundle | None — fully hidden | A *read-only catalog* key (harmless), **only if the backend can issue a scoped read-only key** |
| Relies on an unconfirmed backend capability? | No | **Yes** — needs a split read-only key; if the backend can't issue one, B doesn't fully deliver |
| Secure login cookie (httpOnly) | Yes | No — login token stays in browser storage (mitigated by security headers) |
| CORS browser-blocking issue | Our proxy handles it (off the backend team's plate) | Still the backend team's job to add |
| Does the **website** work wait on the backend team? | **No** — proxy talks to the existing API; we can build and test independently | **Yes** — the website's secure paths can't be rewired until the backend's per-user login exists |

**What still tilts the recommendation toward A** (neither point changed by the Wix detail):

1. Under A the website team can build and verify the fix **without waiting on the backend team**;
   under B the website must wait for the backend's per-user login to exist first.
2. B has a hidden dependency — it only works if the backend can split the key into a safe read-only
   one. We have not confirmed that's possible.

And the decision is **reversible**: because both options share the same backend foundation, we could
start with B's posture and add A's proxy later with no rework to the backend.

---

## 6. Recommendation

**Long term: Option A** (the proxy), *layered on top of* the backend hardening that's required anyway.
It's cheap (likely free, at most $5/mo), it removes the key from the browser properly, and it throws
in two free wins (CORS fixed, secure login cookie). The downside — owning a small piece of infra — is
modest and manageable.

**But there's no need to rush it.** Because this is a test key on a not-yet-public site, the urgent,
high-value work is the **backend hardening (Track B)** — and that's identical under both options and
needs no decision. Doing it first **lowers the stakes of this very decision**: once the backend stops
trusting the browser, the exposed key can't be used to manipulate prices, impersonate users, or read
others' KYC. At that point the key-in-bundle issue drops from "serious" to "tidy this up before
public," and we can choose A vs B calmly, with the founder, and set up any account properly.

**Reversibility:** this decision is **not** one-way. We can start with B (downgrade the key + backend
gating) and add the Option A proxy later with no rework to the backend, because the proxy sits *in
front of* the same API. So even if we pick wrong, switching costs little.

---

## 7. Questions to settle with the founder

1. Are we comfortable owning a small piece of infrastructure (Option A), or do we want to stay purely
   static and push the work to the backend (Option B)?
2. If A: which provider, and **whose account** holds it? (Recommend Cloudflare, company-owned.)
3. ~~Where is `rentbasket.com` DNS hosted today?~~ **Answered: Wix.** → Recommended topology is
   Sub-path A-i: proxy on `api.rentbasket.com` via Netlify Functions + one CNAME in Wix DNS (see §3).
   Remaining sub-decision: A-i (subdomain proxy, recommended) vs. A-ii (move DNS to Cloudflare).
4. Timeline: do we want this done for the 15 June launch, or is launch acceptable on the backend
   hardening alone, with the proxy following shortly after?
