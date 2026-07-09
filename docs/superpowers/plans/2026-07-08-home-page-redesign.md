# Home Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the Home page from a bare hero into a page that explains SproutFund (Hero with a stock-themed animation, How it works, Why SproutFund), with a bolder color treatment built from the app's existing design tokens.

**Architecture:** `Home.jsx` grows from one section to three. The hero's ticker/chart animation is plain CSS (continuous ambient motion, no interactive state — no Motion needed). Colors are theme-conditional CSS custom properties on `.home-page`, following the exact pattern the file already uses for `--home-accent-readable`.

**Tech Stack:** React 19, plain CSS (no CSS-in-JS, no new dependency).

## Global Constraints

- This project has **no test framework**. Every task's verification step is `npm run build` + `npm run lint` + a manual browser check — not automated tests.
- **No new npm dependency.** The ticker/chart animations are plain CSS `@keyframes`, not Motion — they're continuous ambient motion, not interactive state.
- **No real market data.** The ticker's symbol/price-change values are a small hardcoded array, purely decorative.
- Every color used must be one of: an existing global token from `frontend/src/index.css` (`--accent`, `--text-primary`, `--surface`, `--background`, `--border`, etc.), or the literal `#110e08` — this exact hex is already used directly (not as a named token) throughout the codebase for "text/background that sits on top of the lime accent" (e.g. `Navbar.css`'s `.cta-link:hover`, `Results.css`'s `.results-action-btn.primary`), so reusing it here follows existing convention rather than introducing a new color.
- The nav-animation plan (`docs/superpowers/plans/2026-07-08-nav-animations.md`) already changed `Home.css`'s `.home-page` padding from `110px 16px 56px` to `56px 16px 56px` as part of making the global Navbar sticky. This plan assumes that change is already in place — if `.home-page`'s padding still reads `110px 16px 56px` when you start, stop and flag it; the file is not in the state this plan expects.

---

### Task 1: Add "How it works" and "Why SproutFund" content sections

**Files:**
- Modify: `frontend/src/pages/Home.jsx`
- Modify: `frontend/src/pages/Home.css`

**Interfaces:**
- Consumes: nothing new.
- Produces: nothing consumed by Task 2 (Task 2 modifies the same two files further, but only within the `.hero` section — it doesn't depend on any name/export this task introduces).

- [ ] **Step 1: Replace `Home.jsx`**

Replace the full contents of `frontend/src/pages/Home.jsx` with:
```jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

const HOW_IT_WORKS_STEPS = [
  {
    number: "01",
    title: "Enter your budget",
    description: "Tell us your budget, timeline, and risk comfort.",
  },
  {
    number: "02",
    title: "Get matched with strategies",
    description: "See personalized investment strategies that fit your numbers.",
  },
  {
    number: "03",
    title: "Start with confidence",
    description: "Plain-language explanations, no jargon.",
  },
];

const WHY_SPROUTFUND_ITEMS = [
  "Personalized strategies based on your budget",
  "Clear, jargon-free recommendations",
  "Built for first-time investors",
  "Free to use, no credit card required",
];

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <main className="home-page">
      <section className="hero">
        <h1>Invest Smarter with SproutFund</h1>

        <p>
          Get personalized investment recommendations based on your budget,
          goals, and timeline.
        </p>

        <button
          className="hero-button"
          onClick={() => navigate(user ? "/dashboard" : "/auth")}
        >
          {user ? "Go to Dashboard" : "Get Started"}
        </button>
      </section>

      <section className="how-it-works">
        <h2 className="section-title">How it works</h2>
        <div className="how-it-works-steps">
          {HOW_IT_WORKS_STEPS.map((step) => (
            <div className="how-step" key={step.number}>
              <div className="step-header">
                <span className="step-number">{step.number}</span>
                <div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-desc">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="why-sproutfund">
        <h2 className="section-title">Why SproutFund</h2>
        <ul className="why-list">
          {WHY_SPROUTFUND_ITEMS.map((item) => (
            <li key={item} className="why-item">{item}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default Home;
```

- [ ] **Step 2: Fix `.home-page`'s layout for multiple stacked sections**

`.home-page` currently uses `display: flex; align-items: center; justify-content: center;` — designed to center a single `.hero` child both horizontally and vertically. With two more sections now siblings of `.hero`, this would center all three side-by-side in a row instead of stacking them. In `frontend/src/pages/Home.css`, find:
```css
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
```
Replace it with:
```css
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
```
(dropping `justify-content: center` too — the page now flows top-to-bottom naturally across three sections rather than vertically centering a single short hero).

- [ ] **Step 3: Add the new section styles**

Append to the end of `frontend/src/pages/Home.css`:
```css

.section-title {
  font-family: var(--font-heading);
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  text-align: center;
  margin-bottom: 32px;
}

.how-it-works {
  width: 100%;
  max-width: 900px;
  margin: 64px auto 0;
  padding: 0 16px;
}

.how-it-works-steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.how-step {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  text-align: left;
}

@media (max-width: 720px) {
  .how-it-works-steps {
    grid-template-columns: 1fr;
  }
}

.why-sproutfund {
  width: 100%;
  max-width: 700px;
  margin: 56px auto 0;
  padding: 0 16px;
}

.why-list {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 24px;
}

.why-item {
  position: relative;
  padding-left: 22px;
  text-align: left;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.5;
}

.why-item::before {
  content: "→";
  position: absolute;
  left: 0;
  color: var(--accent);
  font-weight: 700;
}

@media (max-width: 560px) {
  .why-list {
    grid-template-columns: 1fr;
  }
}
```

Note: `.how-step`'s number badge relies on `.step-header`/`.step-number`/`.step-title`/`.step-desc` classes already defined globally in `frontend/src/components/BudgetInput.css` (the same numbered-step pattern used on the investment form) — do not redefine them here, they're shared.

- [ ] **Step 4: Build and lint**

Run from `frontend/`:
```bash
npm run build && npm run lint
```
Expected: both succeed. Lint should show only the 2 pre-existing `react-refresh/only-export-components` errors in `AuthContext.jsx`/`ThemeContext.jsx` — unrelated to this change.

- [ ] **Step 5: Manual verification**

Run `npm run dev`, visit `/`:
- Confirm three sections stack vertically: Hero, "How it works" (3 cards, numbered 01/02/03), "Why SproutFund" (2-column list of 4 items with arrow bullets).
- Confirm the hero is no longer vertically centered in the viewport — it now sits at the top with the other sections flowing below.
- Resize to a narrow (~375px) width and confirm the 3-column step grid and 2-column why-list both collapse to a single column.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/pages/Home.jsx frontend/src/pages/Home.css
git commit -m "Add How it works and Why SproutFund sections to Home page"
```

---

### Task 2: Hero animation and color rework

**Files:**
- Modify: `frontend/src/pages/Home.jsx`
- Modify: `frontend/src/pages/Home.css`

**Interfaces:**
- Consumes: nothing new (builds on Task 1's file state).
- Produces: nothing consumed elsewhere.

This task adds the ticker/chart animation to the hero and replaces the muted-green `--home-accent-readable` token with a bolder, theme-conditional treatment (near-black-on-lime in light mode, lime-on-near-black in dark mode) — while leaving the existing subtle dot/diagonal-line background texture untouched, since that wasn't part of what needed fixing.

- [ ] **Step 1: Add the ticker data and hero markup to `Home.jsx`**

In `frontend/src/pages/Home.jsx`, find:
```jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

const HOW_IT_WORKS_STEPS = [
```
Replace it with:
```jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

const TICKER_ITEMS = [
  { symbol: "AAPL", change: "+2.4%", up: true },
  { symbol: "TSLA", change: "-1.1%", up: false },
  { symbol: "SPX", change: "+0.8%", up: true },
  { symbol: "VOO", change: "+1.2%", up: true },
  { symbol: "NDX", change: "-0.3%", up: false },
];

const HOW_IT_WORKS_STEPS = [
```
Then find:
```jsx
        <button
          className="hero-button"
          onClick={() => navigate(user ? "/dashboard" : "/auth")}
        >
          {user ? "Go to Dashboard" : "Get Started"}
        </button>
      </section>
```
Replace it with:
```jsx
        <button
          className="hero-button"
          onClick={() => navigate(user ? "/dashboard" : "/auth")}
        >
          {user ? "Go to Dashboard" : "Get Started"}
        </button>

        <div className="hero-ticker" aria-hidden="true">
          <div className="hero-ticker-track">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, index) => (
              <span
                key={index}
                className={`hero-ticker-item ${item.up ? "up" : "down"}`}
              >
                {item.symbol} {item.change}
              </span>
            ))}
          </div>
        </div>

        <div className="hero-chart" aria-hidden="true">
          <svg className="hero-chart-svg" viewBox="0 0 300 90" preserveAspectRatio="none">
            <path className="hero-chart-path" d="M 10 75 L 70 60 L 110 68 L 160 35 L 210 45 L 290 12" />
            <circle className="hero-chart-dot" cx="290" cy="12" r="5" />
          </svg>
        </div>
      </section>
```

The ticker's `TICKER_ITEMS` array is duplicated (`[...TICKER_ITEMS, ...TICKER_ITEMS]`) so the CSS marquee animation (Step 3) can loop seamlessly from `translateX(0)` to `translateX(-50%)` — at the halfway point the second copy is pixel-identical to where the first copy started. Both the ticker and chart have `aria-hidden="true"` since they're decorative, not informational content a screen reader needs to announce.

- [ ] **Step 2: Replace the color tokens on `.home-page`**

In `frontend/src/pages/Home.css`, find:
```css
.home-page {
  --home-accent-readable: #3f7d00;
  --home-background: #f7f8f2;
  --home-texture-dot: rgba(17, 14, 8, 0.06);
  --home-texture-line: rgba(17, 14, 8, 0.035);
```
Replace it with:
```css
.home-page {
  --home-background: #f7f8f2;
  --home-texture-dot: rgba(17, 14, 8, 0.06);
  --home-texture-line: rgba(17, 14, 8, 0.035);
  --home-cta-bg: #110e08;
  --home-cta-text: #ccff00;
  --home-ticker-bg: #110e08;
  --home-ticker-up: #ccff00;
  --home-ticker-down: #ff6b6b;
  --home-chart-line: #110e08;
```
Then find:
```css
html[data-theme="dark"] .home-page {
  --home-accent-readable: var(--accent);
  --home-background: var(--background);
  --home-texture-dot: rgba(0, 0, 0, 0.36);
  --home-texture-line: rgba(0, 0, 0, 0.24);
}
```
Replace it with:
```css
html[data-theme="dark"] .home-page {
  --home-background: var(--background);
  --home-texture-dot: rgba(0, 0, 0, 0.36);
  --home-texture-line: rgba(0, 0, 0, 0.24);
  --home-cta-bg: var(--accent);
  --home-cta-text: #110e08;
  --home-ticker-bg: var(--surface);
  --home-ticker-up: var(--accent);
  --home-ticker-down: #ff8a8a;
  --home-chart-line: var(--accent);
}
```

- [ ] **Step 3: Update `.hero-button` and add ticker/chart styles**

In `frontend/src/pages/Home.css`, find:
```css
.hero-button {
  background: var(--home-accent-readable);
  border: 1px solid var(--home-accent-readable);
  border-radius: var(--radius-pill);
  color: #110e08;
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 700;
  padding: 10px 18px;
}

.hero-button:hover {
  background: var(--surface);
  color: var(--home-accent-readable);
}
```
Replace it with:
```css
.hero-button {
  background: var(--home-cta-bg);
  border: 1px solid var(--home-cta-bg);
  border-radius: var(--radius-pill);
  color: var(--home-cta-text);
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 700;
  padding: 10px 18px;
  transition: opacity 0.15s;
}

.hero-button:hover {
  opacity: 0.85;
}

.hero-ticker {
  width: 100%;
  max-width: 480px;
  margin: 28px auto 0;
  overflow: hidden;
  background: var(--home-ticker-bg);
  border-radius: var(--radius);
  padding: 8px 0;
}

.hero-ticker-track {
  display: flex;
  gap: 24px;
  white-space: nowrap;
  width: max-content;
  animation: hero-ticker-scroll 12s linear infinite;
}

@keyframes hero-ticker-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

.hero-ticker-item {
  font-family: ui-monospace, monospace;
  font-size: 13px;
  font-weight: 700;
}

.hero-ticker-item.up {
  color: var(--home-ticker-up);
}

.hero-ticker-item.down {
  color: var(--home-ticker-down);
}

.hero-chart {
  width: 100%;
  max-width: 480px;
  height: 90px;
  margin: 16px auto 0;
}

.hero-chart-svg {
  width: 100%;
  height: 100%;
}

.hero-chart-path {
  fill: none;
  stroke: var(--home-chart-line);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 300;
  stroke-dashoffset: 300;
  animation: hero-chart-draw 2.2s ease-out infinite;
}

@keyframes hero-chart-draw {
  0%   { stroke-dashoffset: 300; }
  60%  { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: 0; }
}

.hero-chart-dot {
  fill: var(--home-chart-line);
  opacity: 0;
  animation: hero-chart-dot-appear 2.2s ease-out infinite;
}

@keyframes hero-chart-dot-appear {
  0%, 55% { opacity: 0; }
  65%, 100% { opacity: 1; }
}
```

- [ ] **Step 4: Build and lint**

Run from `frontend/`:
```bash
npm run build && npm run lint
```
Expected: both succeed, same 2 pre-existing lint errors as before and no others.

- [ ] **Step 5: Manual verification**

Run `npm run dev`, visit `/` in both light and dark mode (use the theme toggle in the nav):
- Confirm the CTA button is near-black-on-lime in light mode, lime-on-near-black in dark mode.
- Confirm the ticker strip scrolls continuously left with no visible jump or stutter at the loop point, and colors (green-ish "up", red "down") are legible against its background in both themes.
- Confirm the chart line draws itself and loops smoothly, with the dot appearing at the peak.
- Resize to ~375px width and confirm the ticker's scrolling content stays clipped within the hero — no horizontal page scrollbar appears.
- In DevTools, enable "prefers-reduced-motion: reduce" emulation and confirm the ticker/chart stop animating (or become effectively static) rather than continuing to loop.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/pages/Home.jsx frontend/src/pages/Home.css
git commit -m "Add ticker/chart hero animation and bolder color treatment to Home page"
```
