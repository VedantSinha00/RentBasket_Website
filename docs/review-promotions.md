# Review Promotions — RentBasket Website

<!-- Every time a human (or independent evaluator) catches a class of mistake
     that verify.sh did NOT catch, promote it to an automated check here.
     Then add the check to scripts/verify.sh Layer 1 or the appropriate test.
     Reference: Lecture 10 — review feedback promotion. -->

## How to use this file

1. Review finds a mistake that `make check` didn't catch.
2. Identify the *class* of mistake (not the one-off instance).
3. Write an automated check (grep, ESLint rule, Playwright assertion) that would have caught it.
4. Add the check to `scripts/verify.sh` (Layer 1 for static checks, Layer 3 for behaviour).
5. Append a row to the table below.
6. Add a one-liner to `docs/harness-changelog.md`.

## Promotion Log

| Date | Class of mistake | How it was caught | Automated check added | In verify.sh? |
|---|---|---|---|---|
| (none yet — first promotions happen after the first design sprint review) | | | | |

## Candidate promotions (not yet implemented)

These are known patterns that should be checked but aren't yet automated:

| Pattern | Why it matters | Candidate check |
|---|---|---|
| Raw hex (#abc123) in JSX/CSS files | Breaks token-based theming | `grep -rE '#[0-9a-fA-F]{3,6}' src/ --include="*.jsx" --include="*.css"` |
| `console.log` left in src/ | Performance + info leak | `grep -rn 'console\.log' src/ --include="*.jsx" --include="*.js"` |
| Missing `alt` on `<img>` | Accessibility | ESLint jsx-a11y plugin (`jsx-a11y/alt-text`) |
| New product not added to copy-spa-404.js | 404 on GitHub Pages for new product page | grep productIds list vs products.js ids |
| Framer Motion animation with no `once: true` on `whileInView` | Re-animates on scroll-up, feels broken | `grep -rn "whileInView" src/ --include="*.jsx"` paired with `grep "once"` |
