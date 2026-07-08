# Nav bar visual polish + animations

## Goal

Make the SproutFund navigation "prettier" with bold, playful animations,
applied consistently across all four nav bars in the app:

- `Navbar.jsx` (global nav on Home, Auth, Tips, Glossary)
- The inline per-page nav in `InvestmentForm.jsx` (Dashboard)
- `ResultsNav` in `Results.jsx`
- The inline per-page nav in `Profile.jsx`

## Non-goals

- No changes to auth, Supabase, or backend behavior.
- No redesign of nav *content* (links, menu items) — this is purely visual/motion polish on the existing structure.
- No "hide navbar on scroll down" — for a finance app this reads as unstable rather than playful; a scroll shadow + slight shrink is enough.

## Dependency

Add **Motion** (the rebranded successor to Framer Motion), package name
`motion`, imported from `motion/react`. This is the only new frontend
dependency introduced by this work.

## Shared infrastructure

Two new files keep all four navs visually and behaviorally consistent
instead of each hand-tuning its own numbers:

- **`frontend/src/lib/motion.js`** — shared transition configs:
  - `bounceSpring`: `{ type: 'spring', stiffness: 400, damping: 25 }` — used for dropdown open and the active-link pill.
  - `quickFade`: `{ duration: 0.15, ease: 'easeIn' }` — used for dropdown close.
- **`frontend/src/hooks/useScrolled.js`** — returns `{ isScrolled: boolean }`,
  true once `window.scrollY` passes an ~8px threshold. Uses a passive,
  rAF-throttled scroll listener. Used by all four nav components to toggle
  a `.scrolled` class.

All four nav containers switch from their current positioning (`absolute`
for `Navbar.jsx`, static in-flow for the other three) to
`position: sticky; top: 0;` so the scroll-based effect is visible at all
(currently none of them stay put while scrolling).

Motion's `useReducedMotion()` hook is checked wherever an animation is
triggered; when true, transitions collapse to an instant/near-instant
change instead of the full animation, respecting the OS-level
accessibility preference.

## Per-element behavior

### Nav links + logo (`Navbar.jsx`)

- Links switch from `<Link>` to `<NavLink>` for built-in active-route
  detection.
- An absolutely-positioned `motion.div` "pill" sits behind the active link,
  sharing a `layoutId` across renders. When the active route changes,
  Motion animates the pill sliding to the new link's position (using
  `bounceSpring`) instead of snapping.
- The logo gets `whileHover={{ scale: 1.06 }}` (spring) plus a small wiggle
  on the accent-colored "Fund" text.

### Dropdowns (`UserMenu.jsx`, `Navbar.jsx`'s Settings menu)

- Both switch from conditional mount (`{open && <div>...}`, instant
  appear/disappear) to being wrapped in `AnimatePresence`.
- Open: fade + scale-up + slight downward settle, using `bounceSpring`
  (slight overshoot, matches "bold & playful").
- Close: fade only, using `quickFade` (snappier than the open, avoids
  lingering on screen).

### Theme toggle (`ThemeToggle.jsx`)

- The ☽/○ icon swap is wrapped in `AnimatePresence mode="wait"` with a
  rotate + fade cross-transition between the two icons, replacing the
  instant text swap.

### Scroll behavior (all four navs)

- Once `useScrolled().isScrolled` is true, the nav gains a `.scrolled`
  class: a subtle box-shadow appears and vertical padding reduces slightly
  (a gentle "shrink"). Implemented as a plain CSS transition (no Motion
  needed for a simple two-state toggle).

### Entrance animation (all four navs)

- Fade + slide-down on first mount, implemented as a plain CSS
  `@keyframes` animation applied once on mount — no Motion needed since
  it's a one-shot effect with no interactive state to manage.

## Files touched

**New:**
- `frontend/src/lib/motion.js`
- `frontend/src/hooks/useScrolled.js`

**Modified:**
- `frontend/src/components/Navbar.jsx` / `Navbar.css`
- `frontend/src/components/UserMenu.jsx` / `UserMenu.css`
- `frontend/src/components/ThemeToggle.jsx` / `ThemeToggle.css`
- `frontend/src/pages/InvestmentForm.jsx` / `InvestmentForm.css` (nav portion)
- `frontend/src/pages/Results.jsx` / `Results.css` (`ResultsNav` portion)
- `frontend/src/pages/Profile.jsx` / `Profile.css` (nav portion)
- `frontend/package.json` (new `motion` dependency)

## Data flow & error handling

No new data flow — `useScrolled` is local UI state, the active-link pill
reads from routing state already available via `NavLink`, and dropdown
open/close reuses the existing local `useState` in `UserMenu`/`Navbar`,
just animated on exit instead of disappearing instantly. Nothing here
touches auth, Supabase, or the backend, so there is no new failure mode
to handle beyond what already exists.

## Testing / verification plan

1. `npm run build` and `npm run lint` — must stay clean.
2. Manual click-through:
   - Toggle theme: icon animates (rotate/fade), not an instant swap.
   - Open/close `UserMenu` and the Settings dropdown: bounce open, quick
     fade close.
   - Navigate between Home/Tips/Glossary: pill slides to the new active
     link.
   - Scroll a tall page (Glossary or Tips): shadow/shrink appears past
     the threshold.
3. Emulate `prefers-reduced-motion: reduce` in DevTools and confirm
   transitions collapse to instant/near-instant rather than playing the
   full animation.
