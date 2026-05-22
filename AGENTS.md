# AGENTS.md — RentBasket Website

<!-- ROUTER, not an encyclopaedia (Lecture 04). Hard cap: 200 lines.
     Critical rules at TOP and BOTTOM (lost-in-the-middle effect).
     Each rule has: source / applicability / expiry. -->

## Project Overview

**RentBasket** is a React 18 + Vite SPA (deployed to GitHub Pages) where young professionals
browse furniture and appliances, pick a rental duration, and flow through cart → checkout → confirmation.
No backend: all data is static (`src/data/products.js`). Cart state lives in React context.

**Stack:** React 18, Vite, React Router, Tailwind CSS, Framer Motion, shadcn/ui primitives,
TanStack Query, Vitest. Deployed via `npm run deploy` (gh-pages).

**Design references:** Article.com, West Elm, Linear, Vercel. Premium · warm · editorial.
Mascot: Ku the turtle — appears across marketing sections.

## Quick Start

```
make setup     # npm ci + copy .env.example → .env.local
make dev       # vite dev server on :8080
make test      # vitest run (unit)
make check     # full 3-layer: lint → typecheck → vitest → e2e snapshot
```

If `make setup` fails: fix the Environment subsystem (Lecture 02), not the model.

## Hard Constraints

<!-- TOP = high-visibility slot (Lecture 04). Max 12 rules. -->

1. **No raw hex in JSX/CSS.** All colours via HSL tokens in `src/index.css`. Extend tokens
   there first. Source: CLAUDE.md, design-system integrity. Applies: every component. Expiry: never.
2. **No inline customer copy.** User-facing strings belong in the component where they render —
   but must use the brand voice in `docs/design-system.md §Copy`. Source: brand consistency.
   Applies: every new component. Expiry: never.
3. **Mobile-first at 375 px.** Every interactive element must be testable at 375 px width.
   Source: CLAUDE.md DoD. Applies: every page/component. Expiry: never.
4. **Framer Motion only for intentional motion.** Do not add animation for animation's sake.
   Every motion must serve a UX purpose (guide attention, signal state, provide delight).
   Source: design-evolution.md § Motion Budget. Applies: all animation. Expiry: never.
5. **WIP = 1.** One feature active at a time. No refactoring while implementing.
   Source: Lecture 07. Applies: every session. Expiry: never.
6. **Completion = e2e / snapshot verification passed**, not "looks fine in dev".
   Source: Lecture 09. Applies: every feature. Expiry: never.
7. **Design changes need a Design Sprint entry** in `docs/design-evolution.md` § Sprint Log.
   Source: breathe-and-evolve loop. Applies: any visual change touching >2 components. Expiry: never.
8. **`src/data/products.js` is the single source of truth** for product IDs, names, prices,
   and duration keys. Never duplicate product data in component files. Source: data-integrity.
   Applies: any component rendering product info. Expiry: until a real API is introduced.
9. **`make deploy` only after `make check` exits 0.** Source: avoid deploying broken builds.
   Applies: every deployment. Expiry: never.

## Bootstrap Contract

Before feature work begins, a fresh session must:

- [ ] Run `bash scripts/session_clockin.sh` — prints current state + next step
- [ ] Confirm `make check` exits 0 (or diagnose what's broken)
- [ ] Read `PROGRESS.md` (Current State → In Progress → Known Issues → Next Steps)
- [ ] Pick exactly one `not_started` or `active` feature from `docs/features.md`

If any condition fails → **initialisation mode** (Lecture 06). Fix harness first.

## Session Lifecycle

**Clock in:**
1. `bash scripts/session_clockin.sh`
2. Read PROGRESS.md, docs/features.md
3. Activate exactly one feature

**Clock out:**
1. Update PROGRESS.md (Completed / In Progress / Known Issues / Handoff Note)
2. If `verify.sh` caught it → great. If a human review caught it → add to `docs/review-promotions.md`
3. Append one line to `docs/harness-changelog.md` if anything in the harness changed
4. `bash scripts/session_clockout.sh` → prompts commit

## Topic Docs (read on demand — not all at once)

| File | When to read |
|---|---|
| `docs/features.md` | Every session — the harness backbone |
| `docs/design-system.md` | Before touching any colour, type, spacing, or animation |
| `docs/design-evolution.md` | Before any visual redesign or "breathe" improvement sprint |
| `docs/business-rules.md` | Before touching pricing, duration logic, or cart/checkout flow |
| `src/components/ARCHITECTURE.md` | Before adding a new component or page |

## Verification

```
make check   →   scripts/verify.sh
```

Three layers: **Layer 1** lint + typecheck + architectural rules → **Layer 2** Vitest unit →
**Layer 3** Playwright snapshot (real browser, real build). Only Layer 3 moves a feature
to `passing` in `docs/features.md`.

Failure messages are agent-oriented: WHAT → WHY → HOW TO FIX. If a failure message
doesn't say how to fix it, that is a harness bug — log it in `docs/harness-changelog.md`.

## Self-Improvement Loop

- Human review catches a class of mistake `verify.sh` missed → promote to automated check → log in `docs/review-promotions.md`
- Every harness change → one-liner in `docs/harness-changelog.md`
- Monthly: prune expired rules from this file (move to topic docs if still useful)

## Final Reminders

<!-- BOTTOM = second high-visibility slot (Lecture 04). -->

- When the agent fails → fix the **harness** first, then the code (Lecture 01).
- The website must **breathe and evolve** — see `docs/design-evolution.md` for the sprint loop.
- Write the next session's Handoff Note as if you have amnesia (Lecture 05).
- Quality > quantity. Shipping one pixel-perfect page beats three half-finished ones.
