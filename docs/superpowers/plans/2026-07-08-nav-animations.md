# Nav Bar Animation Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make all four SproutFund nav bars (global `Navbar`, and the inline navs on Dashboard/Results/Profile) visually consistent and animated — sliding active-link pill, spring-animated dropdowns, an animated theme-toggle icon, scroll shadow, and entrance animation.

**Architecture:** Two new shared files (`lib/motion.js` transition presets, `hooks/useScrolled.js`) keep all four navs consistent. Motion (the rebranded Framer Motion) drives the interactive animations (dropdowns, active-link pill, logo hover, theme-icon swap); plain CSS handles the one-shot entrance animation and the two-state scroll-shadow toggle.

**Tech Stack:** React 19, react-router-dom v7, Motion (`motion` npm package, import path `motion/react`), plain CSS (no CSS-in-JS in this codebase).

## Global Constraints

- This project has **no test framework** (no Vitest/Jest/test script in `package.json`). Every task's verification step is `npm run build` + `npm run lint` + a manual browser check — not automated tests. Do not invent placeholder test files.
- Exactly one new dependency is added across this whole plan: `motion`, installed via `npm install motion` (do not manually pin a version in `package.json` — let npm resolve latest).
- Every Motion-driven animation (dropdowns, active-link pill, logo hover, theme-icon swap) must call `useReducedMotion()` from `motion/react` and pass its result through `resolveTransition()` (defined in Task 1) so it collapses to an instant transition when the user has `prefers-reduced-motion: reduce` set. The one-shot CSS entrance animation and the CSS scroll-shadow transition do NOT need this — they're already covered by the existing global rule in `frontend/src/index.css`:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```
- No unrelated refactoring. Where a task requires touching a file outside the four nav components (e.g. removing stale padding), the plan calls it out explicitly and it's included in the task steps — not left as a follow-up.

---

### Task 1: Shared animation infrastructure

**Files:**
- Modify: `frontend/package.json` (via `npm install`, not a manual edit)
- Create: `frontend/src/lib/motion.js`
- Create: `frontend/src/hooks/useScrolled.js`

**Interfaces:**
- Produces: `bounceSpring` (object), `quickFade` (object), `resolveTransition(transition, shouldReduceMotion)` (function) from `frontend/src/lib/motion.js` — used by Tasks 3, 4, 5.
- Produces: `useScrolled()` returning `{ isScrolled: boolean }` from `frontend/src/hooks/useScrolled.js` — used by Tasks 3 and 6.

- [ ] **Step 1: Install the Motion dependency**

Run from `frontend/`:
```bash
npm install motion
```
Expected: `package.json` gains a `"motion": "^..."` entry under `dependencies`, and `package-lock.json` updates. No errors.

- [ ] **Step 2: Create the shared transition presets**

Create `frontend/src/lib/motion.js`:
```js
export const bounceSpring = { type: 'spring', stiffness: 400, damping: 25 }
export const quickFade = { duration: 0.15, ease: 'easeIn' }

export function resolveTransition(transition, shouldReduceMotion) {
  return shouldReduceMotion ? { duration: 0 } : transition
}
```

- [ ] **Step 3: Create the shared scroll hook**

Create `frontend/src/hooks/useScrolled.js`:
```js
import { useEffect, useState } from 'react'

const SCROLL_THRESHOLD = 8

export function useScrolled() {
  const [isScrolled, setIsScrolled] = useState(() => window.scrollY > SCROLL_THRESHOLD)

  useEffect(() => {
    let ticking = false

    function handleScroll() {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > SCROLL_THRESHOLD)
        ticking = false
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return { isScrolled }
}
```

- [ ] **Step 4: Verify the build still succeeds**

Run from `frontend/`:
```bash
npm run build
```
Expected: build succeeds (these two files aren't imported anywhere yet, so this just confirms no syntax errors).

- [ ] **Step 5: Commit**

```bash
git add frontend/package.json frontend/package-lock.json frontend/src/lib/motion.js frontend/src/hooks/useScrolled.js
git commit -m "Add Motion dependency and shared nav animation infrastructure"
```

---

### Task 2: Shared CSS animation tokens

**Files:**
- Modify: `frontend/src/index.css`

**Interfaces:**
- Consumes: nothing.
- Produces: CSS custom properties `--nav-transition-fast`, `--nav-transition-bounce`, and a global `@keyframes nav-enter` — used by Tasks 3 and 6.

- [ ] **Step 1: Add the shared tokens to `:root`**

In `frontend/src/index.css`, the `:root` block currently ends with:
```css
  --font-heading: "Maison Neue Extended", system-ui, sans-serif;
  --font-body: "Capsule Sans Text Mono", ui-monospace, monospace;
}
```
Change it to:
```css
  --font-heading: "Maison Neue Extended", system-ui, sans-serif;
  --font-body: "Capsule Sans Text Mono", ui-monospace, monospace;

  --nav-transition-fast: 0.15s ease;
  --nav-transition-bounce: 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

- [ ] **Step 2: Add the shared entrance keyframe**

Immediately after the `html[data-theme="dark"] { ... }` block (which ends just before the `* { box-sizing: border-box; ... }` reset rule), insert:
```css
@keyframes nav-enter {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```
So the file reads (in order): `:root { ... }`, `html[data-theme="dark"] { ... }`, the new `@keyframes nav-enter { ... }`, then the existing `* { ... }` reset.

- [ ] **Step 3: Verify**

Run from `frontend/`:
```bash
npm run build
```
Expected: succeeds (pure CSS addition, nothing references it yet).

- [ ] **Step 4: Commit**

```bash
git add frontend/src/index.css
git commit -m "Add shared nav animation CSS tokens and entrance keyframe"
```

---

### Task 3: Animate the global Navbar

**Files:**
- Modify: `frontend/src/components/Navbar.jsx`
- Modify: `frontend/src/components/Navbar.css`
- Modify: `frontend/src/pages/Home.css`
- Modify: `frontend/src/pages/Auth.css`
- Modify: `frontend/src/App.jsx`

**Interfaces:**
- Consumes: `bounceSpring`, `resolveTransition` from `frontend/src/lib/motion.js` (Task 1); `useScrolled` from `frontend/src/hooks/useScrolled.js` (Task 1); the global `nav-enter` keyframe (Task 2).
- Produces: nothing new consumed by later tasks.

**Why the Home.css/Auth.css/App.jsx changes are here:** `Navbar` is currently `position: absolute`, transparent, and overlays page content — `Home.css` and `Auth.css` compensate with a hardcoded `padding-top: 110px` to avoid the overlay covering their content. Switching `Navbar` to `position: sticky` puts it back in normal document flow, so that hardcoded buffer must be removed or it'll double up into a large empty gap. Separately, `/tips` currently renders BOTH the global `Navbar` and `MarketTips`' own nav stacked (confirmed by loading `/tips` in a browser) — today this is just visually redundant, but once `Navbar` is sticky it would stay pinned on screen, making the duplicate far more obvious. Fixing this is a one-line addition to the existing `ROUTES_WITH_OWN_NAV` array, whose whole purpose is exactly this case.

- [ ] **Step 1: Replace `Navbar.jsx`**

Replace the full contents of `frontend/src/components/Navbar.jsx` with:
```jsx
import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { bounceSpring, quickFade, resolveTransition } from "../lib/motion";
import { useScrolled } from "../hooks/useScrolled";
import ThemeToggle from "./ThemeToggle";
import "./Navbar.css";

const AUTHED_LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/results", label: "Results" },
  { to: "/history", label: "Saved Plans" },
  { to: "/tips", label: "Tips" },
  { to: "/glossary", label: "Glossary" },
];

const GUEST_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/tips", label: "Tips" },
  { to: "/glossary", label: "Glossary" },
];

function Navbar() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isScrolled } = useScrolled();
  const shouldReduceMotion = useReducedMotion();

  async function handleLogout() {
    await logout();
    navigate("/auth");
  }

  const links = user ? AUTHED_LINKS : GUEST_LINKS;

  return (
    <nav className={`navbar${isScrolled ? " scrolled" : ""}`}>
      <div className="navbar-content">
        <Link to="/" className="logo">
          <motion.span
            className="logo-inner"
            whileHover={shouldReduceMotion ? undefined : { scale: 1.06 }}
            transition={resolveTransition(bounceSpring, shouldReduceMotion)}
          >
            Sprout
            <motion.span
              className="logo-accent"
              whileHover={shouldReduceMotion ? undefined : { rotate: [0, -8, 8, -4, 0] }}
              transition={{ duration: 0.4 }}
            >
              Fund
            </motion.span>
          </motion.span>
        </Link>

        <div className="nav-pill">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className="nav-link">
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="nav-active-pill"
                      transition={resolveTransition(bounceSpring, shouldReduceMotion)}
                    />
                  )}
                  <span className={`nav-link-label${isActive ? " active" : ""}`}>
                    {link.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}

          {user ? (
            <>
              <div className="settings-wrapper">
                <button
                  className="nav-button"
                  onClick={() => setSettingsOpen(!settingsOpen)}
                  type="button"
                >
                  Settings
                </button>

                <AnimatePresence>
                  {settingsOpen && (
                    <motion.div
                      className="settings-menu"
                      initial={{ opacity: 0, scale: 0.95, y: -6 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        transition: resolveTransition(bounceSpring, shouldReduceMotion),
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.95,
                        y: -6,
                        transition: resolveTransition(quickFade, shouldReduceMotion),
                      }}
                    >
                      <ThemeToggle />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button className="nav-button" onClick={handleLogout} type="button">
                Logout
              </button>
            </>
          ) : (
            <>
              <ThemeToggle />
              <Link to="/auth" className="cta-link">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
```

- [ ] **Step 2: Replace `Navbar.css`**

Replace the full contents of `frontend/src/components/Navbar.css` with:
```css
.navbar {
  position: sticky;
  top: 0;
  left: 0;

  width: 100%;

  padding: 24px 0 16px;

  border-bottom: 1px solid var(--border);

  background: transparent;
  z-index: 100;
  animation: nav-enter 0.5s ease-out both;
  transition: box-shadow 0.25s ease, padding 0.25s ease, background 0.25s ease;
}

.navbar.scrolled {
  padding: 14px 0;
  background: var(--background);
  box-shadow: var(--shadow-floating);
}

.navbar-content {
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0 32px;
  box-sizing: border-box;
}

.logo {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-heading);
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  text-decoration: none;
}

.logo-inner {
  display: inline-block;
}

.logo-accent {
  display: inline-block;
  color: var(--accent);
}

.nav-pill {
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 8px;
  border-radius: var(--radius-pill);

  background: var(--surface);
  border: 1px solid var(--border);
}

.nav-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-pill);
  color: var(--text-primary);
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  padding: 8px 14px;
  transition: color 0.15s;
  z-index: 0;
}

.nav-link:hover {
  color: var(--accent);
}

.nav-link-label {
  position: relative;
  z-index: 1;
}

.nav-link-label.active {
  color: var(--text-primary);
}

.nav-active-pill {
  position: absolute;
  inset: 0;
  background: var(--background);
  border: 1px solid var(--accent);
  border-radius: var(--radius-pill);
  z-index: 0;
}

.nav-button {
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-pill);

  color: var(--text-primary);
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;

  padding: 8px 14px;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}

.nav-button:hover {
  background: var(--surface);
  border-color: var(--accent);
  color: var(--accent);
}

.cta-link {
  border-color: var(--accent) !important;
  color: var(--accent) !important;
}

.cta-link:hover {
  background: var(--accent) !important;
  color: #110e08 !important;
}

.settings-wrapper {
  position: relative;
}

.settings-menu {
  position: absolute;
  top: 46px;
  right: 0;

  min-width: 160px;
  padding: 8px;

  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.settings-menu button {
  width: 100%;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius);

  color: var(--text-primary);
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 14px;
  padding: 8px 12px;
  text-align: left;
}

.settings-menu button:hover {
  background: var(--background);
  border-color: var(--accent);
  color: var(--accent);
}
```

- [ ] **Step 3: Remove the stale nav-overlay padding in `Home.css`**

In `frontend/src/pages/Home.css`, find:
```css
  padding: 110px 16px 56px;
```
Change it to:
```css
  padding: 56px 16px 56px;
```

- [ ] **Step 4: Remove the stale nav-overlay padding in `Auth.css`**

In `frontend/src/pages/Auth.css`, find:
```css
.auth-page {
  min-height: 100vh;
  background: var(--background);
  padding: 24px 16px 48px;
  padding-top: 110px;
}
```
Change it to:
```css
.auth-page {
  min-height: 100vh;
  background: var(--background);
  padding: 24px 16px 48px;
}
```

- [ ] **Step 5: Fix the `/tips` double-nav in `App.jsx`**

In `frontend/src/App.jsx`, find:
```js
const ROUTES_WITH_OWN_NAV = ['/dashboard', '/results', '/profile']
```
Change it to:
```js
const ROUTES_WITH_OWN_NAV = ['/dashboard', '/results', '/profile', '/tips']
```

- [ ] **Step 6: Build and lint**

Run from `frontend/`:
```bash
npm run build && npm run lint
```
Expected: both succeed with no new errors (the project has 2 pre-existing `react-refresh/only-export-components` errors in `AuthContext.jsx`/`ThemeContext.jsx` unrelated to this change — those are fine to still see).

- [ ] **Step 7: Manual verification**

Run `npm run dev`, then in a browser:
- Visit `/` (Home) and `/auth` — confirm no large empty gap under the nav, and the nav fades/slides in on load.
- Visit `/tips` — confirm only ONE nav bar renders (MarketTips' own), not two.
- While logged out, click between Home/Tips/Glossary — confirm a pill background slides smoothly to the active link.
- Hover the logo — confirm it scales up slightly and "Fund" wiggles.
- Log in, open the Settings dropdown — confirm it bounces open and fades closed (not an instant snap either way).
- Scroll down any page using the global nav — confirm a shadow appears and the nav shrinks slightly.
- In DevTools, enable the "prefers-reduced-motion: reduce" emulation (Rendering tab) and repeat the hover/dropdown/pill checks — confirm they're instant, not animated.

- [ ] **Step 8: Commit**

```bash
git add frontend/src/components/Navbar.jsx frontend/src/components/Navbar.css frontend/src/pages/Home.css frontend/src/pages/Auth.css frontend/src/App.jsx
git commit -m "Animate global Navbar: sliding active-link pill, logo hover, dropdown, scroll shadow"
```

---

### Task 4: Animate the UserMenu dropdown

**Files:**
- Modify: `frontend/src/components/UserMenu.jsx`
- Modify: `frontend/src/components/UserMenu.css`

**Interfaces:**
- Consumes: `bounceSpring`, `quickFade`, `resolveTransition` from `frontend/src/lib/motion.js` (Task 1).
- Produces: nothing new consumed by later tasks.

- [ ] **Step 1: Replace `UserMenu.jsx`**

Replace the full contents of `frontend/src/components/UserMenu.jsx` with:
```jsx
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { useAuth } from '../context/AuthContext'
import { getAvatarBackground, getInitials } from '../lib/avatar'
import { bounceSpring, quickFade, resolveTransition } from '../lib/motion'
import './UserMenu.css'

function UserMenu() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const initials = getInitials(user?.name)
  const firstName = user?.name?.split(' ')[0] || 'Profile'
  const avatarBg = getAvatarBackground(user?.avatar)

  return (
    <div className="user-menu" ref={ref}>
      <button
        type="button"
        className="user-menu-toggle"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span className="user-menu-avatar" style={{ background: avatarBg }}>
          {user?.photo ? (
            <img src={user.photo} alt={`${firstName} profile`} />
          ) : (
            initials
          )}
        </span>
        <span className="user-menu-name">{firstName}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="user-menu-dropdown"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: resolveTransition(bounceSpring, shouldReduceMotion),
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: -10,
              transition: resolveTransition(quickFade, shouldReduceMotion),
            }}
          >
            <button
              type="button"
              className="user-menu-item"
              onClick={() => {
                setOpen(false)
                navigate('/profile')
              }}
            >
              Profile
            </button>
            <div className="user-menu-divider" />
            <button
              type="button"
              className="user-menu-item user-menu-signout"
              onClick={() => {
                setOpen(false)
                logout()
                navigate('/auth')
              }}
            >
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default UserMenu
```

- [ ] **Step 2: Remove the now-redundant CSS animation from `UserMenu.css`**

In `frontend/src/components/UserMenu.css`, find:
```css
.user-menu-dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.08);
  min-width: 180px;
  z-index: 20;
  overflow: hidden;
  opacity: 0;
  transform: translateY(-10px);
  animation: dropdown-fade-in 0.18s ease forwards;
}

@keyframes dropdown-fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```
Replace it with (Motion now owns the animation via inline styles, so the CSS-side opacity/transform/animation lines and the keyframe are removed to avoid conflicting with it):
```css
.user-menu-dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.08);
  min-width: 180px;
  z-index: 20;
  overflow: hidden;
}
```

- [ ] **Step 3: Build and lint**

Run from `frontend/`:
```bash
npm run build && npm run lint
```
Expected: both succeed, no new errors.

- [ ] **Step 4: Manual verification**

Run `npm run dev`, log in, and on any page with `UserMenu` (Dashboard/Results/Profile):
- Click the avatar/name button — confirm the dropdown bounces open (slight overshoot), not an instant appear.
- Click elsewhere to close it — confirm it fades out quickly rather than vanishing instantly.
- Enable "prefers-reduced-motion: reduce" in DevTools and repeat — confirm both open and close are now instant.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/UserMenu.jsx frontend/src/components/UserMenu.css
git commit -m "Animate UserMenu dropdown open/close with Motion"
```

---

### Task 5: Animate the theme toggle icon

**Files:**
- Modify: `frontend/src/components/ThemeToggle.jsx`
- Modify: `frontend/src/components/ThemeToggle.css`

**Interfaces:**
- Consumes: `resolveTransition` from `frontend/src/lib/motion.js` (Task 1).
- Produces: nothing new consumed by later tasks.

- [ ] **Step 1: Replace `ThemeToggle.jsx`**

Replace the full contents of `frontend/src/components/ThemeToggle.jsx` with:
```jsx
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useTheme } from '../context/ThemeContext'
import { resolveTransition } from '../lib/motion'
import './ThemeToggle.css'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const shouldReduceMotion = useReducedMotion()

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          className="theme-toggle-icon"
          initial={{ rotate: -90, opacity: 0 }}
          animate={{
            rotate: 0,
            opacity: 1,
            transition: resolveTransition({ duration: 0.25 }, shouldReduceMotion),
          }}
          exit={{
            rotate: 90,
            opacity: 0,
            transition: resolveTransition({ duration: 0.15 }, shouldReduceMotion),
          }}
        >
          {theme === 'light' ? '☽' : '○'}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

export default ThemeToggle
```

- [ ] **Step 2: Add a display rule for the icon in `ThemeToggle.css`**

In `frontend/src/components/ThemeToggle.css`, the file currently is:
```css
.theme-toggle {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  cursor: pointer;
  color: var(--text-primary);
  transition: background 0.15s, border-color 0.15s;
  flex-shrink: 0;
}

.theme-toggle:hover {
  border-color: var(--accent);
}
```
Add this rule at the end:
```css

.theme-toggle-icon {
  display: inline-block;
}
```

- [ ] **Step 3: Build and lint**

Run from `frontend/`:
```bash
npm run build && npm run lint
```
Expected: both succeed, no new errors.

- [ ] **Step 4: Manual verification**

Run `npm run dev`, and on any page with a theme toggle:
- Click it — confirm the ☽/○ icon rotates and cross-fades rather than instantly swapping.
- Enable "prefers-reduced-motion: reduce" in DevTools and repeat — confirm the swap is now instant.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/ThemeToggle.jsx frontend/src/components/ThemeToggle.css
git commit -m "Animate theme toggle icon transition with Motion"
```

---

### Task 6: Sticky, scroll shadow, and entrance for the three inline navs

**Files:**
- Modify: `frontend/src/pages/InvestmentForm.jsx`
- Modify: `frontend/src/pages/InvestmentForm.css`
- Modify: `frontend/src/pages/Results.jsx`
- Modify: `frontend/src/pages/Results.css`
- Modify: `frontend/src/pages/Profile.jsx`
- Modify: `frontend/src/pages/Profile.css`

**Interfaces:**
- Consumes: `useScrolled` from `frontend/src/hooks/useScrolled.js` (Task 1); the global `nav-enter` keyframe (Task 2).
- Produces: nothing new consumed by later tasks.

These three navs are already `position: static` (in-flow), unlike the global `Navbar`, so switching them to `sticky` doesn't require any compensating-padding fixes elsewhere — they never overlaid content.

- [ ] **Step 1: Wire `useScrolled` into `InvestmentForm.jsx`**

In `frontend/src/pages/InvestmentForm.jsx`, replace the full contents with:
```jsx
import { useAuth } from '../context/AuthContext'
import BudgetInput from '../components/BudgetInput'
import ThemeToggle from '../components/ThemeToggle'
import UserMenu from '../components/UserMenu'
import { useScrolled } from '../hooks/useScrolled'
import './InvestmentForm.css'

function InvestmentForm() {
  const { user } = useAuth()
  const { isScrolled } = useScrolled()

  return (
    <div className="form-page">
      <nav className={`form-page-nav${isScrolled ? ' scrolled' : ''}`}>
        <span className="form-page-logo">Sprout<span>Fund</span></span>
        <div className="form-page-nav-right">
          {user && <span className="form-page-user">Hi, {user.name?.split(' ')[0]}</span>}
          <ThemeToggle />
          <UserMenu />
        </div>
      </nav>
      <BudgetInput />
    </div>
  )
}

export default InvestmentForm
```

- [ ] **Step 2: Add sticky/scroll/entrance CSS to `InvestmentForm.css`**

In `frontend/src/pages/InvestmentForm.css`, find:
```css
.form-page-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1023px;
  margin: 0 auto 48px;
  padding: 0 8px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 16px;
}
```
Replace it with:
```css
.form-page-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1023px;
  margin: 0 auto 48px;
  padding: 0 8px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 16px;
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--background);
  animation: nav-enter 0.5s ease-out both;
  transition: box-shadow 0.25s ease, padding-bottom 0.25s ease;
}

.form-page-nav.scrolled {
  padding-bottom: 10px;
  box-shadow: var(--shadow-floating);
}
```

- [ ] **Step 3: Wire `useScrolled` into `Results.jsx`'s `ResultsNav`**

In `frontend/src/pages/Results.jsx`, find:
```jsx
function ResultsNav() {
  const { user } = useAuth()

  return (
    <nav className="results-nav">
      <span className="results-logo">Sprout<span>Fund</span></span>
      <div className="results-nav-right">
        {user && <span className="results-user">Hi, {user.name?.split(' ')[0]}</span>}
        <ThemeToggle />
        <UserMenu />
      </div>
    </nav>
  )
}
```
Replace it with:
```jsx
function ResultsNav() {
  const { user } = useAuth()
  const { isScrolled } = useScrolled()

  return (
    <nav className={`results-nav${isScrolled ? ' scrolled' : ''}`}>
      <span className="results-logo">Sprout<span>Fund</span></span>
      <div className="results-nav-right">
        {user && <span className="results-user">Hi, {user.name?.split(' ')[0]}</span>}
        <ThemeToggle />
        <UserMenu />
      </div>
    </nav>
  )
}
```
Then add the import — find the existing import block at the top of the file:
```jsx
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { TIMELINE_LABELS, RISK_LABELS } from '../lib/labels'
import ThemeToggle from '../components/ThemeToggle'
import UserMenu from '../components/UserMenu'
import './Results.css'
```
Replace it with:
```jsx
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { TIMELINE_LABELS, RISK_LABELS } from '../lib/labels'
import ThemeToggle from '../components/ThemeToggle'
import UserMenu from '../components/UserMenu'
import { useScrolled } from '../hooks/useScrolled'
import './Results.css'
```

- [ ] **Step 4: Add sticky/scroll/entrance CSS to `Results.css`**

In `frontend/src/pages/Results.css`, find:
```css
.results-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 720px;
  margin: 0 auto 48px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}
```
Replace it with:
```css
.results-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 720px;
  margin: 0 auto 48px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--background);
  animation: nav-enter 0.5s ease-out both;
  transition: box-shadow 0.25s ease, padding-bottom 0.25s ease;
}

.results-nav.scrolled {
  padding-bottom: 10px;
  box-shadow: var(--shadow-floating);
}
```

- [ ] **Step 5: Wire `useScrolled` into `Profile.jsx`**

In `frontend/src/pages/Profile.jsx`, find the import block:
```jsx
import { useMemo, useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AVATAR_OPTIONS, getInitials } from '../lib/avatar'
import ThemeToggle from '../components/ThemeToggle'
import UserMenu from '../components/UserMenu'
import './Profile.css'
```
Replace it with:
```jsx
import { useMemo, useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AVATAR_OPTIONS, getInitials } from '../lib/avatar'
import ThemeToggle from '../components/ThemeToggle'
import UserMenu from '../components/UserMenu'
import { useScrolled } from '../hooks/useScrolled'
import './Profile.css'
```
Then, inside the `Profile()` component, find:
```jsx
function Profile() {
  const navigate = useNavigate()
  const { user, token, updateProfile } = useAuth()
```
Replace it with:
```jsx
function Profile() {
  const navigate = useNavigate()
  const { user, token, updateProfile } = useAuth()
  const { isScrolled } = useScrolled()
```
Then find:
```jsx
      <nav className="profile-nav">
```
Replace it with:
```jsx
      <nav className={`profile-nav${isScrolled ? ' scrolled' : ''}`}>
```

- [ ] **Step 6: Add sticky/scroll/entrance CSS to `Profile.css`**

In `frontend/src/pages/Profile.css`, find:
```css
.profile-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1120px;
  margin: 0 auto 32px;
  padding: 0 8px 16px;
  border-bottom: 1px solid var(--border);
  gap: 16px;
}
```
Replace it with:
```css
.profile-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1120px;
  margin: 0 auto 32px;
  padding: 0 8px 16px;
  border-bottom: 1px solid var(--border);
  gap: 16px;
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--background);
  animation: nav-enter 0.5s ease-out both;
  transition: box-shadow 0.25s ease, padding-bottom 0.25s ease;
}

.profile-nav.scrolled {
  padding-bottom: 10px;
  box-shadow: var(--shadow-floating);
}
```

- [ ] **Step 7: Build and lint**

Run from `frontend/`:
```bash
npm run build && npm run lint
```
Expected: both succeed, no new errors.

- [ ] **Step 8: Manual verification**

Run `npm run dev`, log in, and visit Dashboard, Results (after generating a plan), and Profile:
- Confirm each nav fades/slides in on page load.
- Scroll down each page — confirm a shadow appears and the nav's bottom padding shrinks slightly, and the nav stays pinned at the top instead of scrolling away.

- [ ] **Step 9: Commit**

```bash
git add frontend/src/pages/InvestmentForm.jsx frontend/src/pages/InvestmentForm.css frontend/src/pages/Results.jsx frontend/src/pages/Results.css frontend/src/pages/Profile.jsx frontend/src/pages/Profile.css
git commit -m "Add sticky positioning, scroll shadow, and entrance animation to inline navs"
```
