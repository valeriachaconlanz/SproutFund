# Unified navbar + public-survey/gated-save auth flow

## Goal

Replace SproutFund's four inconsistent navigation systems with a single,
consistent floating "pill" navbar (Supaste-style, themed to SproutFund's
light/dark palette) used on every page, and change the entry flow so the
investment survey is public — only *saving* a result requires an account.
Also replace the crude ☽/○ theme toggle with a proper animated switch.

## Current problems being fixed

1. **Four different navs.** Global `Navbar` renders on Home/Auth/Glossary;
   InvestmentForm, Results, Profile, and MarketTips each render their own
   inline nav. Nothing is consistent.
2. **"Tips redirects to auth."** On `/tips`, the only nav is MarketTips'
   local one whose back button goes to `/auth` — a dead-end for anyone who
   isn't mid-signup.
3. **No persistent account button.** There's no consistent way to reach the
   account/profile from every page.
4. **Ugly "Get Started" button** and **ugly ☽/○ theme toggle.**
5. **Survey is locked behind login.** "Get Started" goes to `/auth`, not to
   the survey; a first-time visitor can't try the product before committing.

## A. Unified navbar

- A single `Navbar` component rendered on **every** route in `App.jsx`.
  The per-page inline navs are **deleted** from `InvestmentForm.jsx`,
  `Results.jsx` (`ResultsNav`), `Profile.jsx`, and `MarketTips.jsx` (its
  `.tips-nav`), along with their now-unused nav CSS.
- Visual: a **floating, centered, rounded-bottom pill** fixed to the top
  (like the provided Supaste example), themed via CSS custom properties so
  it adapts to light/dark rather than being hardcoded black:
  - `--nav-bg`: light `#110e08` (near-black pill on the light page for
    contrast), dark `var(--surface)`.
  - `--nav-fg`: light `rgba(255,255,255,0.7)`, dark `var(--text-secondary)`.
  - `--nav-fg-active`: light `#ffffff`, dark `var(--text-primary)`.
  - Accent (active-link pill / hovers): `var(--accent)` in both themes.
  - The animated active-link pill, logo hover, and reduced-motion handling
    from the existing (just-completed) nav-animation work are preserved —
    this redesign restyles and relocates the nav, it does not throw away the
    Motion interactions already built into `Navbar.jsx`.
- Contents:
  - **Left:** SproutFund logo (wordmark; existing `Sprout`+lime`Fund`).
  - **Middle:** nav links. Logged out: Home · Tips · Glossary. Logged in:
    Dashboard · Results · Saved Plans · Tips · Glossary.
  - **Right:** the new **ThemeToggle** (see C); then an **Account button**
    — the existing `UserMenu` dropdown when logged in, or a "Sign in" link
    to `/auth` when logged out; then, **when logged out only**, a redesigned
    **"Get Started"** button (clean white-in-light / lime-in-dark pill,
    matching the Supaste "Download" button treatment) that routes to the
    survey.
- Because the navbar is now global and floating/fixed, each page's top
  padding is normalized so content clears the pill (no page-specific
  `padding-top: 110px` hacks left dangling, no double gaps).

## B. Public survey, gated save

- **Route:** the survey (currently `InvestmentForm` at `/dashboard`,
  wrapped in `ProtectedRoute`) becomes **public**. `/dashboard` keeps its
  path but loses the `ProtectedRoute` wrapper. Home's "Get Started" button
  and the navbar "Get Started" button both route to `/dashboard`.
- **Frontend build call:** `BudgetInput.jsx` submits to `POST
  /api/investment` to build the recommendation. It currently always sends
  `Authorization: Bearer ${token}`. Change it to send that header **only
  when a token exists**, so a logged-out visitor can build a plan.
- **Backend:** `SecurityConfig.java` currently does
  `.anyRequest().authenticated()`. Change to permit **exactly** `POST
  /api/investment` for everyone, while `POST /api/investment/save`,
  `GET /api/investment/history`, and `PATCH`/`DELETE /api/investment/{id}`
  stay authenticated. (These are different paths/methods, so a single
  `requestMatchers(HttpMethod.POST, "/api/investment").permitAll()` before
  `.anyRequest().authenticated()` is sufficient and does not loosen the
  save/history/delete endpoints.)
- **Gated save (Results):** `handleSave` in `Results.jsx` branches on
  whether a `token` exists:
  - Logged in → unchanged (POST to `/api/investment/save`).
  - Logged out → does **not** POST. Instead it stashes the current result
    (`state`) in `sessionStorage` under a known key and navigates to
    `/auth`, showing copy like "Create an account to save this plan."
  - On mount, `Results` checks: if there's no router `state` but there *is*
    a stashed result in `sessionStorage` **and** the user is now
    authenticated, it restores that result (so after signing up the visitor
    lands back on their plan and can save it), then clears the stash.
  - The Save button label/inline message reflects the logged-out case
    ("Create an account to save" vs "Save This Plan"/"Saving…"/"Saved ✓").

## C. New theme toggle

Replace the ☽/○ glyph in `ThemeToggle.jsx` with a proper **sliding
sun/moon switch**: a small pill-shaped track with a knob that slides
left/right on toggle, with a sun icon in light mode and a moon in dark
mode. Keep using the existing `useTheme()` hook and `prefers-reduced-motion`
handling; only the button's internal markup/CSS changes.

## Files touched

**Frontend — modify:**
- `frontend/src/App.jsx` (render `Navbar` on every route; drop
  `ROUTES_WITH_OWN_NAV`; make `/dashboard` public)
- `frontend/src/components/Navbar.jsx` / `Navbar.css` (floating pill
  restyle, account button, Get Started → survey, links)
- `frontend/src/components/ThemeToggle.jsx` / `ThemeToggle.css` (switch)
- `frontend/src/components/UserMenu.jsx` (reused as the account button; only
  changed if needed to fit the new nav)
- `frontend/src/pages/InvestmentForm.jsx` / `.css` (remove inline nav)
- `frontend/src/pages/Results.jsx` / `.css` (remove `ResultsNav`; gated save
  + sessionStorage restore)
- `frontend/src/pages/Profile.jsx` / `.css` (remove inline nav)
- `frontend/src/pages/MarketTips.jsx` / `.css` (remove `.tips-nav`)
- `frontend/src/pages/Home.jsx` (Get Started → `/dashboard`)
- `frontend/src/components/BudgetInput.jsx` (conditional auth header)
- `frontend/src/index.css` (nav color tokens)

**Backend — modify:**
- `backend/src/main/java/com/sproutfund/security/SecurityConfig.java`
  (permit `POST /api/investment`)

## Testing / verification plan

No test framework exists (build + lint + manual browser check).

1. `npm run build` + `npm run lint` clean (only the 2 known pre-existing
   `react-refresh` errors).
2. Backend compiles (`mvn -q -o compile`).
3. Manual, both themes:
   - The same floating pill navbar appears on **every** page (Home, Tips,
     Glossary, survey, Results, Profile, Auth) — no page has a second nav.
   - Theme toggle slides and swaps sun/moon; page theme changes.
   - Logged out: "Get Started" → survey; the survey submits and shows
     Results **without logging in**; on Results, Save shows "Create an
     account to save" and routes to `/auth`; after signing up you return to
     the same plan and can save it.
   - Logged in: navbar shows account dropdown (Profile / Sign out), no
     "Get Started"; Save works directly.
   - `/tips` no longer dead-ends at `/auth`.
4. Reduced-motion emulation: nav/toggle animations collapse to instant.

## Non-goals

- No change to how recommendations are computed, or to the saved-plan data
  model. No new npm dependency (Motion is already present). The
  sessionStorage stash is a deliberately small mechanism, not a full
  "resume pending action after login" framework.
