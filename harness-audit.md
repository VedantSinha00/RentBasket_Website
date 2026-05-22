# Harness Audit — RentBasket_Website

Generated: 2026-05-22T19:26:47Z

## 1. Detected stack

- **JavaScript/TypeScript** — `package.json` present
  - package manager: npm (lockfile present)
  - framework hint: React

## 2. Existing harness files

- ❌ `AGENTS.md` missing — agent routing instructions (Lecture 02/04)
- ✅ `CLAUDE.md` (28 lines) — Claude-specific routing instructions (alternative to AGENTS.md)
- ✅ `README.md` (16 lines) — human-oriented project intro
- ❌ `PROGRESS.md` missing — cross-session journal (Lecture 05)
- ❌ `DECISIONS.md` missing — design decision log (Lecture 05)
- ❌ `Makefile` missing — standardised commands (setup/dev/test/check)
- ❌ `docs/features.md` missing — feature list as harness primitive (Lecture 08)
- ❌ `scripts/verify.sh` missing — three-layer verification (Lecture 09/10)
- ❌ `.env.example` missing — environment variables template

## 3. Verification infrastructure

- Test files found: 196 (js: 4, ts: 187, .spec.js: 1, .spec.ts: 4, py: 0)
- ❌ no `e2e/` directory — Layer 3 verification (Lecture 10) is missing
- ❌ no dedicated tests directory
- ✅ ESLint configured
- ✅ TypeScript configured
- ⚠️  no pre-commit hooks detected

## 4. Environment reproducibility

- ⚠️  no `Dockerfile`
- ⚠️  no docker-compose
- ⚠️  no devcontainer
- ⚠️  no `.nvmrc`
- ❌ no `.env.example` — new contributors will guess at env vars

## 5. State management

- ✅ git repo, branch=`main`, commits=27
- ⚠️  26 uncommitted files — start the harness install on a clean tree

## 6. Knowledge visibility (rough heuristic)

- Markdown docs: 8
- Source files: 9
- docs/source ratio: 88% (rule of thumb: under 5% is a red flag)

## 7. Five-subsystem score (1=missing, 5=excellent)

| Subsystem | Score | Notes |
|---|---|---|
| Instructions (Lecture 02/04) | 4/5 | AGENTS.md present? size? topic docs? |
| Tools | 3/5 | assumed reasonable; verify shell access |
| Environment (Lecture 02) | 1/5 | Makefile + lockfiles + .env.example + container |
| State (Lecture 05/08) | 2/5 | git + PROGRESS.md + DECISIONS.md + features.md |
| Feedback (Lecture 09/10) | 3/5 | tests + e2e + verify.sh 3-layer |

**Lowest-scoring subsystem: `env` (1/5).** Per Lecture 02, fix this first for the largest marginal gain.

## 8. Cold-start gaps (Lecture 03)

Read only the contents of this repo and try to answer:

1. What is this system, in one sentence?
2. How is it organised (top-level structure)?
3. How do I run it locally?
4. How do I verify it works end-to-end?
5. What is the current progress / known issues?

For each question you cannot answer from repo contents alone, that is a blank spot on the map. Record them below and use them to drive Step 1 (AGENTS.md) and Step 2 (topic docs).

_Cold-start gaps (fill in by hand after running this audit):_
- [ ] Q1:
- [ ] Q2:
- [ ] Q3:
- [ ] Q4:
- [ ] Q5:

## 9. Recommended next steps (in order)

Follow the canonical SKILL.md workflow. Start at the lowest-scoring subsystem (`env`) if you want the largest marginal gain, otherwise follow steps 1–8 in order.

