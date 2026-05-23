# Design Evolution — RentBasket Website

<!-- The "breathe and evolve" framework.
     Read this before any visual redesign, polish sprint, or design improvement.
     This file turns design work from "random touches" into a trackable, compounding loop. -->

## The Core Idea

RentBasket's design must feel alive — premium but warm, editorial but functional. Static designs rot.
This file governs the **Design Evolution Loop**: a repeating sprint cycle where the site is
continuously improved in small, verified increments. Each sprint targets ONE element, improves it,
verifies it visually and behaviorally, and ships it. Over time, the sprints compound.

**The loop:**
```
Audit → Pick → Sprint → Verify → Ship → Log → (repeat)
```

---

## Design Quality Rubric

Before/after every design sprint, score the site against this rubric:

| Dimension | Questions to ask | Score (1–5) |
|---|---|---|
| **Hierarchy** | Is the most important element obvious at a glance? Does the eye flow naturally? | |
| **Breathing room** | Is there enough whitespace? Do sections feel cramped or airy? | |
| **Motion** | Does animation guide attention without distraction? Is reduced-motion respected? | |
| **Type** | Are Playfair Display and Inter used purposefully? Is the type scale consistent? | |
| **Colour coherence** | Are tokens used consistently? Any raw hex leaked into components? | |
| **Mobile delight** | At 375 px, does it feel premium — not just "responsive"? | |
| **Mascot integration** | Does Ku appear in the right places? Does he feel earned, not forced? | |
| **CTA clarity** | Is the primary action obvious on every page? Is the button hierarchy clear? | |

Run this rubric at the start of a design sprint (as-is score) and at the end (after score).
Log both in the Sprint Log below.

---

## Sprint Framework

Each design sprint follows this structure. Complete one sprint per session (WIP=1).

### 1. Scope the sprint (5 min)
Write a Sprint Contract (see `templates/sprint-contract.md`):
- **Target element:** e.g. "Hero section on mobile"
- **Current problem:** e.g. "Headline wraps awkwardly at 375px; mascot video overlaps CTA"
- **Desired outcome:** e.g. "Headline is 2 lines max on 375px; CTA is always above the fold"
- **Exclusions:** what you're NOT touching this sprint
- **Verification:** which feature ID(s) in `docs/features.md` this sprint targets

### 2. Implement (30–90 min)
- Work in exactly one component subtree
- Use tokens from `docs/design-system.md` — no new raw values without adding them to `src/index.css` first
- Add or update Framer Motion animations within the Animation Budget
- Test at 375 px in devtools before calling it done

### 3. Verify
```
make design-check
```
This runs Layer 1 (lint + architectural rules) + a visual snapshot comparison.
If Playwright is wired: `npx playwright test e2e/design.spec.ts --grep <feature-id>`

### 4. Screenshot
Take a before/after screenshot at 375 px and 1280 px. Save to `docs/design-sprints/<sprint-id>/`.

### 5. Log the sprint
Append to the Sprint Log below. Score the rubric dimensions you changed.

---

## Sprint Backlog (proposed improvements)

Priority order. Pick the top item at sprint start.

| ID | Element | Problem | Design tokens involved | Effort |
|---|---|---|---|---|
| SP-01 | Hero — mobile (375 px) | Headline may wrap past 2 lines; CTA position untested | `font-display`, `btn-gradient-coral` | S |
| SP-02 | Product card hover | No verified hover state (scale + shadow lift, 200 ms) | `shadow-md`, `transition` | S |
| SP-03 | Page transitions | Hard flash between routes — no AnimatePresence fade | `AnimatePresence`, 150 ms | M |
| SP-04 | Scroll-reveal audit | Inconsistent entry animations across sections | `whileInView`, `easeOut` | M |
| SP-05 | Catalog filter UX | Active tab not clearly highlighted at 375 px | `bg-primary`, `text-primary` | S |
| SP-06 | Checkout progress indicator | Step labels truncate on 375 px | `CheckoutProgress.jsx` | S |
| SP-07 | Footer breathing room | Footer feels dense — needs whitespace audit | `py-*`, `gap-*` | S |
| SP-08 | Mascot presence | Ku only appears in hero — consider one more editorial placement | `mascot-sofa.png`, `mascot-peek.png` | M |
| SP-09 | Dark mode foundation | Tokens are HSL — dark mode is easy to add. Add `dark:` variants. | `src/index.css :root` | L |
| SP-10 | Typography scale audit | Heading sizes not verified across all pages consistently | `font-display`, Tailwind `text-*` | M |

**Size key:** S = 1–2 hrs · M = 3–5 hrs · L = half-day+

---

## Sprint Log

<!-- Append one entry per completed sprint. Keep entries short. -->

| Date | Sprint ID | Element | Before score (avg) | After score (avg) | Shipped in commit |
|---|---|---|---|---|---|
| 2026-05-23 | — | (Harness bootstrap — no design sprint this session) | — | — | 488a290 |
| 2026-05-23 | SP-01 | Hero section — mobile (375 px) | Mobile: 1/5 (CTA hidden) | Mobile: 5/5 (CTA above fold, readable headline, mascot below) | next commit |
| 2026-05-23 | Tab fix | Category tabs wrapping at 1280px+ | Hierarchy: 2/5 (Bestsellers on row 2) | Hierarchy: 5/5 (all 4 tabs on one line) | next commit |
| 2026-05-23 | SP-02 | Product card hover state | Motion: 1/5 (no hover feedback) | Motion: 5/5 (4px lift + shadow-elevated, 200ms easeOut) | next commit |
| 2026-05-23 | SP-03 | Page-transition fade (AnimatePresence) | Motion: 1/5 (hard flash on route change) | Motion: 4/5 (150ms opacity fade, mode=wait) | next commit |
| 2026-05-23 | D04-partial | Testimonials raw colours → tokens | Colour coherence: 2/5 | Colour coherence: 4/5 | next commit |
| 2026-05-23 | SP-07 | Footer breathing room + copyright year | Breathing room: 2/5, year stale | Breathing room: 4/5, inline styles removed | next commit |
| 2026-05-23 | SP-04-partial | Scroll-reveal on FreeServices + Testimonials heading | Motion: 2/5 (no entrance animation) | Motion: 4/5 (whileInView fadeUp, once) | next commit |
| 2026-05-23 | Whitespace pass | Trim desktop padding across 5 sections (FreeServices, MythOrFact, Testimonials, DownloadSection, WhatMakesDifferent) | Breathing: scattered, total main 5776px | Breathing: harmonious, total main 5284px (−492px / ~9%) | next commit |
| 2026-05-23 | MythOrFact REALITY | REALITY card: text overflowed ("REALIT"), red glow border, `font-serif` | Hierarchy: 2/5, off-brand | Hierarchy: 5/5: Playfair font-display, opacity-50, 40px fits 163/205px, subtle white/25 border, text-white/90, 15px reality copy | next commit |

---

## The Breathing Principle

"Breathe" means the site has **rhythm** — sections are spacious, animations are deliberate,
whitespace is generous. To test: stand back from the screen and squint. If it looks cluttered,
it's not breathing. Common fixes:
- Increase `py-` on sections
- Reduce text density (break paragraphs, use subheads)
- Remove redundant decorative elements
- Ensure Framer Motion entrance animations have noticeable but brief delays between staggered children

"Evolve" means the site is **never static** — every major session should leave at least one
design improvement in the Sprint Log. The harness makes this visible and accountable.

---

## Evaluator Rubric for Design Work

When an independent evaluator (or the agent itself in a separate evaluation pass) reviews a design sprint:

1. Load the before screenshot.
2. Load the after screenshot.
3. Score each changed rubric dimension.
4. Does the after score beat the before on every targeted dimension? If not, the sprint is incomplete.
5. Does any previously 5/5 dimension regress? If yes, the sprint shipped a regression.

**Rule (Lecture 09):** Never let the generator grade itself. After a design sprint, run a separate
evaluation pass using only the screenshots and the rubric above, ignoring the intent behind the change.
