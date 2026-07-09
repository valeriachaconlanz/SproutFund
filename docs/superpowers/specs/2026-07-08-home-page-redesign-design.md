# Home page redesign: content, animation, and visual polish

## Goal

Turn the Home page from a bare hero (headline + one paragraph + one button)
into a page that explains what SproutFund does and the problem it solves,
with a stock-market-themed animation as a visual anchor and a color
treatment that's bold and distinctive rather than the current muted look —
while staying minimal (this is a small app, not a marketing site with a
sales team).

## Non-goals

- No real market data or API integration. The ticker/chart are purely
  decorative — a small hardcoded array of fake symbol/change pairs.
- No testimonials, pricing, logos, or other sections beyond the three
  defined below — deliberately kept lean.
- No changes to the nav bars — that's the separate, already-in-progress
  nav-animation plan (`docs/superpowers/plans/2026-07-08-nav-animations.md`).
  This spec only touches `Home.jsx` / `Home.css`.

## Page structure

`Home.jsx` grows from one `<section className="hero">` into three sections:

1. **Hero** — existing headline, subhead, and CTA button, unchanged in
   copy, plus the new ticker strip and trend chart (see Animation below)
   placed inside the hero, below the CTA.
2. **How it works** — a 3-step explainer:
   1. "Enter your budget" — tell us your budget, timeline, and risk comfort.
   2. "Get matched with strategies" — see personalized investment
      strategies that fit your numbers.
   3. "Start with confidence" — plain-language explanations, no jargon.

   Visually reuses the numbered-step pattern (`01`/`02`/`03` badge +
   heading + description) that `InvestmentForm.jsx` already uses for its
   budget/timeline/risk steps, so this section feels native to the app
   rather than an inconsistent, separately-designed addition.
3. **Why SproutFund** — 4 short value props, adapted from the existing
   "Why SproutFund?" bullet list on the Auth page's sidebar (real,
   already-approved copy, not new marketing text):
   - Personalized strategies based on your budget
   - Clear, jargon-free recommendations
   - Built for first-time investors
   - Free to use, no credit card required

The hero's CTA button (`Get Started` / `Go to Dashboard`, logic unchanged)
serves as the single call to action — no second/duplicate CTA is added
after "Why SproutFund."

## Animation

Two pieces, both continuous ambient motion with no user interaction driving
them, placed inside the hero below the CTA:

- **Ticker strip**: a single-line horizontal strip of fake stock
  symbol/change pairs (e.g. `AAPL +2.4%`, `TSLA -1.1%`), scrolling
  continuously left via a CSS `@keyframes` `translateX` marquee loop.
  Green/red text color signals up/down, matching the mockup shown during
  design.
- **Trend chart**: a small inline SVG line chart whose path draws itself
  left-to-right via `stroke-dasharray`/`stroke-dashoffset` animation,
  looping every ~2.2s, ending with a dot that fades in at the peak.

Both are implemented as **plain CSS**, not Motion — consistent with the
nav-animation plan's own rule of thumb (Motion for interactive/state-driven
animation like dropdowns and hover; CSS for continuous/ambient or one-shot
motion). This also means both already get `prefers-reduced-motion` handling
for free from the existing global rule in `frontend/src/index.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

No new dependency is needed for this — no Motion import in `Home.jsx`.

## Color treatment

Two directions, chosen during design and mapped to the site's existing
light/dark toggle (not a fixed-always-dark hero):

- **Light mode**: cream/off-white background, `--text-primary` (near-black)
  headline text, `--accent` (lime, `#ccff00`) used for chart line highlights
  and CTA accents, with the ticker strip rendered as a dark
  (near-black-background) inset bar for contrast — mirroring the site's own
  buttons/CTA-link treatment elsewhere.
- **Dark mode**: near-black background (matching the site's existing dark
  `--background`), same lime `--accent` highlights on chart/ticker.

Every color used is an existing token already defined in
`frontend/src/index.css` (`--accent`, `--text-primary`, `--background`,
`--surface`, `--border`) — no new colors are introduced. The existing
`.home-page` / `html[data-theme="dark"] .home-page` variable-override
pattern already in `Home.css` is the mechanism for this — it's extended,
not replaced.

## Files touched

- Modify: `frontend/src/pages/Home.jsx` (add "How it works" and "Why
  SproutFund" sections, add ticker/chart markup to the hero)
- Modify: `frontend/src/pages/Home.css` (new section styles, ticker/chart
  keyframes, revised color tokens for the hero)

No other files change. No new npm dependency.

## Data flow & error handling

None — this is entirely static markup and CSS animation. The ticker data
is a hardcoded JS array local to `Home.jsx`. No network requests, no new
state, no interaction with auth or the backend.

## Testing / verification plan

This project has no test framework (no Vitest/Jest). Verification is:

1. `npm run build` and `npm run lint` — must stay clean.
2. Manual browser check in both light and dark mode:
   - Ticker scrolls continuously without stutter or visible seam/jump at
     the loop point.
   - Chart line draws and loops smoothly.
   - "How it works" and "Why SproutFund" sections render with readable
     contrast in both themes.
   - No horizontal scroll/overflow introduced at mobile widths (check at
     ~375px viewport width) — the ticker's scrolling content must stay
     clipped to the hero's width.
3. Emulate `prefers-reduced-motion: reduce` in DevTools and confirm the
   ticker/chart animations stop (or become effectively instant) rather
   than continuing to loop.
