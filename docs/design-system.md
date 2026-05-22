# Design System — RentBasket Website

<!-- Read before touching any colour, type, spacing, shadow, or animation.
     This is the single source of design truth that lives next to the code. -->

## Type

| Role | Font | Weight | Where defined |
|---|---|---|---|
| Display / headings | Playfair Display | 400–700 | `font-display` class, `src/index.css` |
| Body / UI | Inter | 400–600 | base font, `src/index.css` |

**Rule:** Never specify `font-family` inline in a component. Use `font-display` for editorial headings,
`font-sans` (Inter via Tailwind) for UI. Page-section headings: Playfair Display. CTA labels: Inter.

## Colour Tokens

All tokens are HSL CSS variables in `src/index.css :root`. Use semantic Tailwind classes:

| Token class | Typical use |
|---|---|
| `bg-primary` / `text-primary` | Brand primary |
| `bg-cream` / `bg-cream/50` | Warm off-white backgrounds |
| `text-muted-foreground` | Secondary labels |
| `text-success` | Confirmation / green |
| `btn-gradient-coral` | Primary CTA gradient |
| `gradient-coral` | Hero/accent gradient fills |
| `section-container` | Max-width centred section wrapper |

**Rule:** Never use raw hex (#abc123) in JSX or CSS. If the token doesn't exist, add it to
`src/index.css :root` first. This is a hard constraint (see AGENTS.md #1).

## Spacing

- 4 px base unit. Use Tailwind's default scale (4 = 1rem = 16 px).
- Section vertical padding: `py-16` (mobile) / `py-24` (desktop) minimum.
- Component internal padding: `p-4` to `p-6`. Cards: `p-6`.
- Grid gaps: `gap-6` (cards), `gap-4` (form fields).

## Component Utilities

Shared utility classes defined in `src/index.css`:

| Class | What it does |
|---|---|
| `btn-primary` | Filled primary button with hover + active scale |
| `btn-outline` | Outlined button |
| `btn-gradient-coral` | Coral gradient CTA button |
| `section-container` | Centred, max-w-7xl, responsive horizontal padding |
| `gradient-coral` | Coral gradient used in decorative/accent elements |

**Rule:** Always prefer these utilities over one-off inline Tailwind chains. If a pattern repeats
across ≥2 components, extract it to `src/index.css`.

## Shadow & Depth

- Cards at rest: `shadow-sm` (subtle lift)
- Cards on hover: `shadow-md` (noticeable lift, 200 ms transition)
- Modals / overlays: `shadow-xl`
- Never use `drop-shadow` filter on images without measuring perf impact.

## Animation Budget (Framer Motion)

Every animation must serve ONE of these purposes:
1. **Guide attention** — hero entrance, section reveals on scroll
2. **Signal state** — loading, success, error, hover
3. **Provide delight** — mascot, micro-interactions (sparingly)

### Standard durations

| Purpose | Duration | Easing |
|---|---|---|
| Micro-interaction (hover, tap) | 150–200 ms | `easeOut` |
| UI state change (tab switch, filter) | 200–250 ms | `easeInOut` |
| Page entrance / scroll reveal | 400–600 ms | `easeOut` |
| Mascot / delight animation | 600–1200 ms | Spring |

### Rules
- All scroll-reveal components: use `whileInView` with `once: true` (don't re-animate on scroll up).
- `AnimatePresence` for route transitions — 150 ms fade-in/out.
- Never block interaction during animation. Use `pointer-events: auto` on animated elements.
- Reduce motion: respect `prefers-reduced-motion`. Use `useReducedMotion()` from Framer Motion.

## Responsive Breakpoints

Tailwind defaults — mobile-first:

| Breakpoint | Width | Notes |
|---|---|---|
| (base) | 0–639 px | 375 px is the design target for mobile |
| `sm` | 640 px | Phablet |
| `md` | 768 px | Tablet |
| `lg` | 1024 px | Desktop |
| `xl` | 1280 px | Wide |
| `2xl` | 1536 px | Max layout width |

**Rule:** Design at 375 px (base) first. Test every new component at 375 px before calling it done.

## Copy Guidelines

- Headlines: Playfair Display, sentence case, no full caps (except acronyms).
- CTAs: short, action-oriented, warm. "Explore furniture" not "Browse products now!"
- Price display: ₹ prefix, no decimals for whole amounts.
- Error messages: human, not technical. "We couldn't process your request — try again." not "500 Internal Server Error."
- Mascot Ku: appears in marketing/editorial sections. Never in transactional UI.

## Icon System

Use `lucide-react` icons. Match stroke width to context:
- UI controls (close, arrow): strokeWidth 1.5–2
- Decorative/large icons: strokeWidth 1–1.5
- Never mix icon families (no mixing Lucide with heroicons).
