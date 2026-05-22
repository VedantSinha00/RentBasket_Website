# PROGRESS.md — RentBasket Website

<!-- Amnesiac craftsman's journal (Lecture 05). Update at every clock-out.
     Keep SHORT and CURRENT. History lives in git log. -->

## Current State

- **Latest commit:** `488a290` — V 1.56 Catalog page fully functional — duration key fixes & framer-motion forwardRef
- **Test status:** unit: passing (vitest) | e2e: not yet wired (Layer 3 debt — see Known Issues)
- **Lint:** clean (ESLint + TypeScript strict)
- **Build:** `npm run build` succeeds; deployed to GitHub Pages
- **Environment:** static SPA · GitHub Pages · no backend
- **As of:** 2026-05-23

## Completed (recent)

- [x] V1.56 — Catalog page fully functional: duration key fixes, Framer Motion forwardRef compat
- [x] V1.52 — "Get home setup quote" CTA removed site-wide
- [x] V1.51 — Browse Products page added
- [x] V1.5 — Product data map groundwork (products.js + CSV pipeline)
- [x] Harness bootstrapped — AGENTS.md, Makefile, verify.sh, docs/, e2e/ scaffold (2026-05-23)
- [x] E01 — Playwright installed + wired: 3/3 landing specs passing (F01, D01, smoke) — 2026-05-23
- [x] SP-01 — Hero mobile-first rewrite: `flex-col lg:flex-row`, CTA above fold at 375px, mascot stacks below — 2026-05-23
- [x] D01 — Hero mobile CTA verified by Playwright e2e — `passing` — 2026-05-23

## In Progress

<!-- Exactly one (WIP=1). If two are listed, the harness is violated. -->

_None — all planned work for this session completed._

## Blocked

_None._

## Known Issues

- **No e2e layer (Layer 3 debt):** `e2e/` directory exists but no Playwright specs yet.
  Every feature is in `passing` state with "manual verification" as evidence — verification debt.
  Unblock by: install Playwright, write `e2e/landing.spec.ts` as the template.
- **No `.env.local`** on a fresh clone until `make setup` is run (expected — documented in .env.example).
- **`dist/` is checked in** — gh-pages workflow artifact. Not source — ignore in code review.
- **26 uncommitted dist/* changes** — pending `make deploy` after harness is confirmed green.

## Next Steps

1. **SP-02** — Product card hover state: verified `shadow-md` lift + 200ms scale in `catalog/ProductCard.jsx`. Write `e2e/design.spec.ts` for D02.
2. **SP-03** — Page-transition fade: add `AnimatePresence` wrapping `<Routes>` in `App.jsx`, 150ms fade. Test D03.
3. Fix category-tabs wrapping at 1280px desktop (Bestsellers drops to second line — tighten gap or reduce font-size from `lg:text-[20px]` to `lg:text-[18px]`).
4. `make deploy` — push current state to GitHub Pages.

## Handoff Note

Full harness is installed and `make check` passes all three layers (L1 lint+arch, L2 vitest, L3 Playwright).
SP-01 hero rewrite is shipped: mobile hero stacks vertically (flex-col → lg:flex-row), CTA "Browse Catalogue"
is full-width on mobile and sits at ~y=304px — comfortably above the 812px fold. Ku the mascot renders
below the fold on mobile, which is correct (delight, not obstruction). Desktop two-column layout is unchanged.
Minor issue to fix: at exactly 1280px the category tabs wrap to two lines (Bestsellers on its own row) — tighten
`gap-x-5` or reduce `lg:text-[20px]` to `lg:text-[18px]` in HeroSection.jsx. Not a D01 regression.

---
_Last updated by `claude-code` at 2026-05-23T00:00:00Z via harness bootstrap._
