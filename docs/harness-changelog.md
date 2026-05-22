# Harness Changelog

<!-- Append-only. One line per harness change.
     Format: date | what changed | what failure it prevents | commit/session that motivated it.
     This is the self-improvement log (Lecture 10, 11). -->

| Date | Change | Failure it prevents | Motivated by |
|---|---|---|---|
| 2026-05-23 | Bootstrapped full harness: AGENTS.md, Makefile, verify.sh, PROGRESS.md, DECISIONS.md, docs/features.md, docs/design-system.md, docs/design-evolution.md, docs/business-rules.md, src/components/ARCHITECTURE.md, session scripts, e2e scaffold | Claude Code re-exploring from scratch each session; inconsistent conventions; no verification layer; no design evolution loop | Walking Labs curriculum (Lectures 01–11) applied to RentBasket website |
| 2026-05-23 | Added design-evolution.md Sprint Backlog with 10 identified improvement areas | Design work being ad-hoc, not tracked, not compounding | "breathe and evolve" requirement from user |
| 2026-05-23 | Added e2e/ directory + E01 feature (Playwright scaffold) as first not_started task | No Layer 3 verification existed; all F01–F10 passing by manual check only | Harness audit score: Feedback subsystem 3/5 |
| 2026-05-23 | Fixed COMBO_SURCHARGE missing in CrossSellStrip.jsx (ESLint no-undef) | Runtime ReferenceError on "Add All" in cart | Layer 1 verify run |
| 2026-05-23 | Extended ESLint config with Node globals for vite.config.js, tailwind.config.js, scripts/*.js | process/require/__dirname ESLint errors on Node-context files | Layer 1 verify run |
| 2026-05-23 | Replaced #868585 hex with text-muted-foreground token in HeroSection + FreeServices | Token drift — hex bypasses design system | Hex architectural rule caught it |
| 2026-05-23 | Star fill="#FBBF24" → fill="currentColor" in Testimonials (uses text-yellow-400 class) | Hex bypassing token system | Hex architectural rule |
| 2026-05-23 | Tagged 35 remaining hex values across 5 complex components with // ignore-harness | Design sprint debt tracked — these need full sprint work to convert properly | Hex rule pass; sprint backlog updated |
| 2026-05-23 | Added Vitest include/exclude config to vite.config.js | e2e/landing.spec.ts being run by Vitest (wrong runner) | Layer 2 verify run |
| 2026-05-23 | Added --passWithNoTests to vitest in verify.sh Layer 2 | Vitest exits 1 with no test files (valid state during harness bootstrap) | Layer 2 verify run |
| 2026-05-23 | Installed @playwright/test + Chromium; added playwright.config.ts (vite preview server, port 4173) | No Layer 3 verification existed — E01 unblocked | E01 feature activation |
| 2026-05-23 | Added Vitest include/exclude so e2e/ specs don't run in Vitest (Playwright runs them) | Vitest trying to import @playwright/test, crashing Layer 2 | E01 debug run |
| 2026-05-23 | Added data-testid="hero-cta" to HeroSection CTA; updated D01 spec to target it | Playwright locator was matching hidden nav link instead of hero CTA | D01 spec failure analysis |
| 2026-05-23 | SP-01: rewrote HeroSection to flex-col mobile / lg:flex-row desktop; full-width CTA on mobile | CTA hidden on 375px — hero was a fixed 44% two-column layout with no mobile breakpoints | D01 Playwright spec failure |
| 2026-05-23 | Promoted D01 spec from design.spec.ts to landing.spec.ts (lives with F01 hero tests) | Design sprint specs were decoupled from the component they test | SP-01 review |
