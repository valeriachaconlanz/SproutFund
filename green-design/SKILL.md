---
name: robinhood-design
description: Design system skill for robinhood. Activate when building UI components, pages, or any visual elements. Provides exact color tokens, typography scale, spacing grid, component patterns, and craft rules. Read references/DESIGN.md before writing any CSS or JSX.
---

# robinhood Design System

You are building UI for **robinhood**. Light-themed, warm palette, monospace typography (Maison Neue Extended), compact density on a 4px grid, expressive motion.

## Visual Reference

**IMPORTANT**: Study ALL screenshots below before writing any UI. Match colors, typography, spacing, layout, and motion exactly as shown.

### Homepage

![robinhood Homepage](screenshots/homepage.png)

> Read `references/DESIGN.md` for full token details.

## Design Philosophy

- **Layered depth** — use shadow tokens to create a sense of physical layering. Each elevation level has a specific shadow.
- **Gradient accents** — gradients are used thoughtfully for emphasis, not decoration.
- **Single typeface** — Maison Neue Extended carries all text. Hierarchy comes from size, weight, and color — never font mixing.
- **compact density** — 4px base grid. Every dimension is a multiple of 4.
- **warm palette** — the color temperature runs warm, matching the monospace typography.
- **Restrained accent** — `#ccff00` is the only pop of color. Used exclusively for CTAs, links, focus rings, and active states.
- **Expressive motion** — animations are an integral part of the experience. Use spring physics and layout animations.

## Color System

### Core Palette

| Role | Token | Hex | Use |
|------|-------|-----|-----|
| Background | `--background` | `#ffffff` | Page/app background |
| Surface | `--surface` | `#f4f4f5` | Cards, panels, modals |
| Text Primary | `--text-primary` | `#110e08` | Headings, body text |
| Text Muted | `--text-muted` | `#bfbfbf` | Captions, placeholders |
| Accent | `--accent` | `#ccff00` | CTAs, links, focus rings |
| Border | `--border` | `#35322d` | Dividers, card borders |

### Status Colors

| Status | Hex | Use |
|--------|-----|-----|
| Warning | `#1c180d` | Caution states, pending items |

### Extended Palette

- `#000000` — Deep background layer or shadow color
- `#dad3c0`
- `#d9d9d9`
- `#859aac`
- `#0000ee`
- `#cbcbcd`
- `#4d4a46`
- `#888784`

### CSS Variable Tokens

```css
--rh__primary-base: rgb(0, 200, 5);
--rh__primary-hover: rgba(38, 208, 43, 1);
--rh__primary-pressed: rgba(64, 214, 68, 1);
--rh__primary-light-base: rgba(0, 200, 5, 0.4);
--rh__primary-lightest-base: rgba(0, 200, 5, 0.2);
--rh__primary-textOverlay: var(--rh__neutral-bg1);
--rh__primary-light-textOverlay: var(--rh__primary-base);
--rh__primary-lightest-textOverlay: var(--rh__primary-base);
--rh-LEGACY__primary-color-hover: rgba(38, 208, 43, 1);
--rh__size-palette___experimentalPopoverZIndex: 1;
--rh__size-palette__borderRadius: 4px;
```

## Typography

### Font Stack

- **Maison Neue Extended** — Heading 1, Heading 2, Heading 3
- **Capsule Sans Text Mono** — Body, Caption, Code

### Font Sources

```css
@font-face {
  font-family: "Capsule Sans Text Mono";
  src: url("fonts/CapsuleSansTextMono-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Maison Neue Extended";
  src: url("fonts/MaisonNeueExtended-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Capsule Sans Text";
  src: url("fonts/CapsuleSansText-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Capsule Sans Text";
  src: url("fonts/CapsuleSansText-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "Capsule Sans Display";
  src: url("fonts/CapsuleSansDisplay-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Nib Pro Display";
  src: url("fonts/NibProDisplay-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Nib Pro Display";
  src: url("fonts/NibProDisplay-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "ITC Garamond Std";
  src: url("fonts/ITCGaramondStd-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Phonic";
  src: url("fonts/Phonic-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Phonic";
  src: url("fonts/Phonic-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "Martina Plantijn";
  src: url("fonts/MartinaPlantijn-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Instrument Serif";
  src: url("fonts/InstrumentSerif-Regular.ttf") format("truetype");
  font-weight: 400;
}
@font-face {
  font-family: "Geist";
  src: url("fonts/Geist-Bold.ttf") format("truetype");
  font-weight: 700;
}
@font-face {
  font-family: "Geist";
  src: url("fonts/Geist-Regular.ttf") format("truetype");
  font-weight: 400;
}
@font-face {
  font-family: "Nib Pro Book Cover";
  src: url("fonts/NibProBookCover-300.woff") format("woff");
  font-weight: 300;
}
@font-face {
  font-family: "Capsule Sans Book Cover";
  src: url("fonts/CapsuleSansBookCover-Regular.woff") format("woff");
  font-weight: 400;
}
```

### Type Scale

| Role | Family | Size | Weight |
|------|--------|------|--------|
| Heading 1 | Maison Neue Extended | 120px | 700 |
| Heading 2 | Maison Neue Extended | 110px | 700 |
| Heading 3 | Maison Neue Extended | 90px | 700 |
| Body | Capsule Sans Text Mono | 16px | 400 |
| Caption | Capsule Sans Text Mono | 12px | 400 |
| Code | Capsule Sans Text Mono | 14px | 400 |

### Typography Rules

- All text uses **Maison Neue Extended** — never add another font family
- Max 3-4 font sizes per screen
- Headings: weight 600-700, body: weight 400
- Use color and opacity for text hierarchy, not additional font sizes
- Line height: 1.5 for body, 1.2 for headings

## Spacing & Layout

### Base Grid: 4px

Every dimension (margin, padding, gap, width, height) must be a multiple of **4px**.

### Spacing Scale

`2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 26` px

### Spacing as Meaning

| Spacing | Use |
|---------|-----|
| 4-8px | Tight: related items (icon + label, avatar + name) |
| 12-16px | Medium: between groups within a section |
| 24-32px | Wide: between distinct sections |
| 48px+ | Vast: major page section breaks |

### Border Radius

Scale: `.3rem, 2px, 3px, 4px, 10px, 20px, 24px, 36px, 44px`
Default: `10px`

### Container

Max-width: `1023px`, centered with auto margins.

### Breakpoints

| Name | Value |
|------|-------|
| xs | 360px |
| xs | 400px |
| xs | 425px |
| xs | 426px |
| sm | 484px |
| sm | 550px |
| md | 767px |
| md | 768px |
| lg | 800px |
| lg | 1023px |
| lg | 1024px |
| xl | 1279px |
| xl | 1280px |
| 2xl | 1399px |

Mobile-first: design for small screens, layer on responsive overrides.

## Component Patterns

### Card

```css
.card {
  background: #f4f4f5;
  border: 1px solid #35322d;
  border-radius: 10px;
  padding: 16px;
  box-shadow: rgb(128, 128, 128) 0px 0px 5px 0px;
}
```

```html
<div class="card">
  <h3>Card Title</h3>
  <p>Card content goes here.</p>
</div>
```

### Button

```css
/* Primary */
.btn-primary {
  background: #ccff00;
  color: #110e08;
  border-radius: 10px;
  padding: 8px 16px;
  font-weight: 500;
  transition: opacity 150ms ease;
}
.btn-primary:hover { opacity: 0.9; }

/* Ghost */
.btn-ghost {
  background: transparent;
  border: 1px solid #35322d;
  color: #110e08;
  border-radius: 10px;
  padding: 8px 16px;
}
```

```html
<button class="btn-primary">Get Started</button>
<button class="btn-ghost">Learn More</button>
```

### Input

```css
.input {
  background: #ffffff;
  border: 1px solid #35322d;
  border-radius: 10px;
  padding: 8px 12px;
  color: #110e08;
  font-size: 14px;
}
.input:focus { border-color: #ccff00; outline: none; }
```

```html
<input class="input" type="text" placeholder="Search..." />
```

### Badge / Chip

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  background: #f4f4f5;
  color: #bfbfbf;
}
```

```html
<span class="badge">New</span>
<span class="badge">Beta</span>
```

### Modal / Dialog

```css
.modal-backdrop { background: rgba(0, 0, 0, 0.6); }
.modal {
  background: #f4f4f5;
  border: 1px solid #35322d;
  border-radius: 44px;
  padding: 24px;
  max-width: 480px;
  width: 90vw;
  box-shadow: 0 1px 12px rgba(48,51,51,.09);
}
```

```html
<div class="modal-backdrop">
  <div class="modal">
    <h2>Dialog Title</h2>
    <p>Dialog content.</p>
    <button class="btn-primary">Confirm</button>
    <button class="btn-ghost">Cancel</button>
  </div>
</div>
```

### Table

```css
.table { width: 100%; border-collapse: collapse; }
.table th {
  text-align: left;
  padding: 8px 12px;
  font-weight: 500;
  font-size: 12px;
  color: #bfbfbf;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #35322d;
}
.table td {
  padding: 12px;
  border-bottom: 1px solid #35322d;
}
```

```html
<table class="table">
  <thead><tr><th>Name</th><th>Status</th><th>Date</th></tr></thead>
  <tbody>
    <tr><td>Item One</td><td>Active</td><td>Jan 1</td></tr>
    <tr><td>Item Two</td><td>Pending</td><td>Jan 2</td></tr>
  </tbody>
</table>
```

### Navigation

```css
.nav {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid #35322d;
}
.nav-link {
  color: #bfbfbf;
  padding: 8px 12px;
  border-radius: 10px;
  transition: color 150ms;
}
.nav-link:hover { color: #110e08; }
.nav-link.active { color: #ccff00; }
```

```html
<nav class="nav">
  <a href="/" class="nav-link active">Home</a>
  <a href="/about" class="nav-link">About</a>
  <a href="/pricing" class="nav-link">Pricing</a>
  <button class="btn-primary" style="margin-left: auto">Get Started</button>
</nav>
```

### Extracted Components

These components were found in the codebase:

**Button** (`html`)

## Page Structure

The following page sections were detected:

- **Navigation** — Top navigation bar (27 items)
- **Hero** — Hero section (detected from heading structure)
- **Footer** — Page footer with links and info (79 items)
- **Faq** — FAQ/accordion section

When building pages, follow this section order and structure.

## Animation & Motion

This project uses **expressive motion**. Animations are part of the design language.

### CSS Animations

- `animation-b7n1on`
- `animation-1rmoxwc`
- `animation-1w1aj7y`
- `animation-1hcdlku`
- `animation-k8pqa9`

### Motion Tokens

- **Duration scale:** `150ms`, `200ms`, `300ms`, `400ms`
- **Easing functions:** `cubic-bezier(.65,.05,.36,1)`, `cubic-bezier(.18,.89,.32,1.28)`, `ease`, `ease-out`
- **Animated properties:** `transform`

### Motion Guidelines

- **Duration:** Use values from the duration scale above. Short (150ms) for micro-interactions, long (400ms) for page transitions
- **Easing:** Use `cubic-bezier(.65,.05,.36,1)` as the default easing curve
- **Direction:** Elements enter from bottom/right, exit to top/left
- **Reduced motion:** Always respect `prefers-reduced-motion` — disable animations when set

## Depth & Elevation

### Shadow Tokens

- Subtle: `0 1px 0 rgba(0,0,0,.06)`
- Raised (cards, buttons): `rgb(128, 128, 128) 0px 0px 5px 0px`
- Floating (dropdowns, popovers): `0 1px 12px rgba(48,51,51,.09)`
- Overlay (modals, dialogs): `0 0 4px 1px rgba(0,0,0,.01),0 3px 24px rgba(48,51,51,.09)`
- Overlay (modals, dialogs): `0 0 4px 1px rgba(0,0,0,.01),0 3px 24px rgba(0,0,0,.6)`

### Z-Index Scale

`0, 1, 2, 80, 301, 1000, 2147483647`

Use these exact values — never invent z-index values.

## Anti-Patterns (Never Do)

- **No blur effects** — no backdrop-blur, no filter: blur()
- **No zebra striping** — tables and lists use borders for separation
- **No invented colors** — every hex value must come from the palette above
- **No arbitrary spacing** — every dimension is a multiple of 4px
- **No extra fonts** — only Maison Neue Extended and Capsule Sans Text Mono are allowed
- **No arbitrary border-radius** — use the scale: .3rem, 2px, 3px, 4px, 10px, 20px, 24px, 36px, 44px
- **No opacity for disabled states** — use muted colors instead

## Workflow

1. **Read** `references/DESIGN.md` before writing any UI code
2. **Pick colors** from the Color System section — never invent new ones
3. **Set typography** — Maison Neue Extended, Capsule Sans Text Mono only, using the type scale
4. **Build layout** on the 4px grid — check every margin, padding, gap
5. **Match components** to patterns above before creating new ones
6. **Apply elevation** — use shadow tokens
7. **Validate** — every value traces back to a design token. No magic numbers.

## Brand Spec

- **Favicon:** `/us/en/rh_favicon_32.png`
- **Site URL:** `https://robinhood.com/`
- **Brand color:** `#ccff00`
- **Brand typeface:** Maison Neue Extended

## Quick Reference

```
Background:     #ffffff
Surface:        #f4f4f5
Text:           #110e08 / #bfbfbf
Accent:         #ccff00
Border:         #35322d
Font:           Maison Neue Extended
Spacing:        4px grid
Radius:         10px
Components:     7 detected
```

## When to Trigger

Activate this skill when:
- Creating new components, pages, or visual elements for robinhood
- Writing CSS, Tailwind classes, styled-components, or inline styles
- Building page layouts, templates, or responsive designs
- Reviewing UI code for design consistency
- The user mentions "robinhood" design, style, UI, or theme
- Generating mockups, wireframes, or visual prototypes

---

# Full Reference Files

> Every output file is embedded below. Claude has full design system context from /skills alone.

## Design System Tokens (DESIGN.md)

# robinhood DESIGN.md

> Auto-generated design system — reverse-engineered via static analysis by skillui.
> Frameworks: None detected
> Colors: 20 · Fonts: 2 · Components: 7
> Icon library: not detected · State: not detected
> Primary theme: light · Dark mode toggle: no · Motion: expressive

## Visual Reference

**Match this design exactly** — study colors, fonts, spacing, and component shapes before writing any UI code.

![robinhood Homepage](../screenshots/homepage.png)

---

## 1. Visual Theme & Atmosphere

This is a **light-themed** interface with a warm, approachable feel. The light background emphasizes content clarity. Typography uses **Maison Neue Extended** throughout — a technical, developer-focused choice that maintains consistency. Spacing follows a **4px base grid** (compact density), with scale: 2, 4, 6, 8, 10, 12, 14, 16px. The palette is predominantly monochromatic with **#ccff00** as the single accent color — used sparingly for interactive elements and emphasis. Motion is expressive — spring physics, layout animations, and staggered reveals are part of the visual language.

---

## 2. Color Palette & Roles

| Token | Hex | Role | Use |
|---|---|---|---|
| background | `#ffffff` | background | Page background, darkest surface |
| surface | `#f4f4f5` | surface | Card and panel backgrounds |
| text-primary | `#110e08` | text-primary | Headings and body text |
| text-muted | `#bfbfbf` | text-muted | Captions, placeholders, secondary info |
| border | `#35322d` | border | Dividers, card borders, outlines |
| accent | `#ccff00` | accent | CTAs, links, focus rings, active states |
| warning | `#1c180d` | warning | Warning states, caution indicators |
| info | `#0000ee` | info | Informational highlights |
| unknown | `#000000` | unknown | Palette color |
| unknown | `#dad3c0` | unknown | Palette color |
| unknown | `#d9d9d9` | unknown | Palette color |
| unknown | `#859aac` | unknown | Palette color |
| unknown | `#cbcbcd` | unknown | Palette color |
| unknown | `#4d4a46` | unknown | Palette color |
| unknown | `#888784` | unknown | Palette color |
| unknown | `#5e5e5f` | unknown | Palette color |
| unknown | `#040d14` | unknown | Palette color |
| unknown | `#999999` | unknown | Palette color |
| unknown | `#6a7278` | unknown | Palette color |
| unknown | `#0088cc` | unknown | Palette color |

### CSS Variable Tokens

```css
--rh__primary-base: rgb(0, 200, 5);
--rh__primary-hover: rgba(38, 208, 43, 1);
--rh__primary-pressed: rgba(64, 214, 68, 1);
--rh__primary-light-base: rgba(0, 200, 5, 0.4);
--rh__primary-lightest-base: rgba(0, 200, 5, 0.2);
--rh__primary-textOverlay: var(--rh__neutral-bg1);
--rh__primary-light-textOverlay: var(--rh__primary-base);
--rh__primary-lightest-textOverlay: var(--rh__primary-base);
--rh-LEGACY__primary-color-hover: rgba(38, 208, 43, 1);
--rh__size-palette___experimentalPopoverZIndex: 1;
--rh__size-palette__borderRadius: 4px;
```


---

## 3. Typography Rules

**Font Stack:**
- **Maison Neue Extended** — Heading 1, Heading 2, Heading 3
- **Capsule Sans Text Mono** — Body, Caption, Code

**Font Sources:**

```css
@font-face {
  font-family: "Capsule Sans Text Mono";
  src: url("fonts/CapsuleSansTextMono-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Maison Neue Extended";
  src: url("fonts/MaisonNeueExtended-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Capsule Sans Text";
  src: url("fonts/CapsuleSansText-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Capsule Sans Text";
  src: url("fonts/CapsuleSansText-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "Capsule Sans Display";
  src: url("fonts/CapsuleSansDisplay-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Nib Pro Display";
  src: url("fonts/NibProDisplay-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Nib Pro Display";
  src: url("fonts/NibProDisplay-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "ITC Garamond Std";
  src: url("fonts/ITCGaramondStd-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Phonic";
  src: url("fonts/Phonic-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Phonic";
  src: url("fonts/Phonic-700.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "Martina Plantijn";
  src: url("fonts/MartinaPlantijn-Regular.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Instrument Serif";
  src: url("fonts/InstrumentSerif-Regular.ttf") format("truetype");
  font-weight: 400;
}
@font-face {
  font-family: "Geist";
  src: url("fonts/Geist-Bold.ttf") format("truetype");
  font-weight: 700;
}
@font-face {
  font-family: "Geist";
  src: url("fonts/Geist-Regular.ttf") format("truetype");
  font-weight: 400;
}
@font-face {
  font-family: "Nib Pro Book Cover";
  src: url("fonts/NibProBookCover-300.woff") format("woff");
  font-weight: 300;
}
@font-face {
  font-family: "Capsule Sans Book Cover";
  src: url("fonts/CapsuleSansBookCover-Regular.woff") format("woff");
  font-weight: 400;
}
```

| Role | Font | Size | Weight |
|---|---|---|---|
| Heading 1 | Maison Neue Extended | 120px | 700 |
| Heading 2 | Maison Neue Extended | 110px | 700 |
| Heading 3 | Maison Neue Extended | 90px | 700 |
| Body | Capsule Sans Text Mono | 16px | 400 |
| Caption | Capsule Sans Text Mono | 12px | 400 |
| Code | Capsule Sans Text Mono | 14px | 400 |

**Typographic Rules:**
- Use **Maison Neue Extended** for all text — do not mix font families
- Maintain consistent hierarchy: no more than 3-4 font sizes per screen
- Headings use bold (600-700), body uses regular (400)
- Line height: 1.5 for body text, 1.2 for headings
- Use color and opacity for secondary hierarchy, not additional font sizes


---

## 4. Component Stylings

### Layout (1)

**Footer** — `html`

### Navigation (1)

**Navigation** — `html`

### Data Display (2)

**Badge** — `html`

**List** — `html`

### Data Input (1)

**Button** — `html`

### Media (2)

**Image** — `html`

**Icon** — `html`



---

## 5. Layout Principles

- **Base spacing unit:** 4px
- **Spacing scale:** 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 26
- **Border radius:** .3rem, 2px, 3px, 4px, 10px, 20px, 24px, 36px, 44px
- **Max content width:** 1023px

**Spacing as Meaning:**
| Spacing | Use |
|---|---|
| 4-8px | Tight: related items within a group |
| 12-16px | Medium: between groups |
| 24-32px | Wide: between sections |
| 48px+ | Vast: major section breaks |


---

## 6. Depth & Elevation

### Flat — subtle depth hints

- `0 1px 0 rgba(0,0,0,.06)`

### Raised — cards, buttons, interactive elements

- `rgb(128, 128, 128) 0px 0px 5px 0px`

### Floating — dropdowns, popovers, modals

- `0 1px 12px rgba(48,51,51,.09)`

### Overlay — full-screen overlays, top-level dialogs

- `0 0 4px 1px rgba(0,0,0,.01),0 3px 24px rgba(48,51,51,.09)`
- `0 0 4px 1px rgba(0,0,0,.01),0 3px 24px rgba(0,0,0,.6)`

### Z-Index Scale

`0, 1, 2, 80, 301, 1000, 2147483647`



---

## 7. Animation & Motion

This project uses **expressive motion**. Animations are an integral part of the experience.

### CSS Animations

- `@keyframes animation-b7n1on`
- `@keyframes animation-1rmoxwc`
- `@keyframes animation-1w1aj7y`
- `@keyframes animation-1hcdlku`
- `@keyframes animation-k8pqa9`
- `@keyframes animation-v3tyt4`
- `@keyframes animation-19tr8sd`
- `@keyframes animation-vejq6o`

### Motion Guidelines

- Duration: 150-300ms for micro-interactions, 300-500ms for page transitions
- Easing: `ease-out` for enters, `ease-in` for exits
- Always respect `prefers-reduced-motion`


---

## 8. Do's and Don'ts

### Do's

- Use `#ccff00` for interactive elements (buttons, links, focus rings)
- Use `#ffffff` as the primary page background
- Use **Maison Neue Extended** for all UI text
- Follow the **4px** spacing grid for all margins, padding, and gaps
- Use the defined shadow tokens for elevation — see Section 6
- Use border-radius from the scale: .3rem, 2px, 3px, 4px, 10px
- Reuse existing components from Section 4 before creating new ones

### Don'ts

- Don't introduce colors outside this palette — extend the design tokens first
- Don't mix font families — use Maison Neue Extended consistently
- Don't use arbitrary spacing values — stick to multiples of 4px
- Don't create custom box-shadow values outside the system tokens
- Don't use arbitrary border-radius values — pick from the defined scale
- Don't duplicate component patterns — check Section 4 first
- Don't use backdrop-blur or blur effects

### Anti-Patterns (detected from codebase)

- No blur or backdrop-blur effects
- No zebra striping on tables/lists


---

## 9. Responsive Behavior

| Name | Value | Source |
|---|---|---|
| xs | 360px | css |
| xs | 400px | css |
| xs | 425px | css |
| xs | 426px | css |
| sm | 484px | css |
| sm | 550px | css |
| md | 767px | css |
| md | 768px | css |
| lg | 800px | css |
| lg | 1023px | css |
| lg | 1024px | css |
| xl | 1279px | css |
| xl | 1280px | css |
| 2xl | 1399px | css |

**Approach:** Use `@media (min-width: ...)` queries matching the breakpoints above.


---

## 10. Agent Prompt Guide

Use these as starting points when building new UI:

### Build a Card

```
Background: #f4f4f5
Border: 1px solid #35322d
Radius: 10px
Padding: 16px
Font: Maison Neue Extended
Use shadow tokens from Section 6.
```

### Build a Button

```
Primary: bg #ccff00, text white
Ghost: bg transparent, border #35322d
Padding: 8px 16px
Radius: 10px
Hover: opacity 0.9 or lighter shade
Focus: ring with #ccff00
```

### Build a Page Layout

```
Background: #ffffff
Max-width: 1023px, centered
Grid: 4px base
Responsive: mobile-first, breakpoints from Section 9
```

### Build a Stats Card

```
Surface: #f4f4f5
Label: #bfbfbf (muted, 12px, uppercase)
Value: #110e08 (primary, 24-32px, bold)
Status: use success/warning/danger from Section 2
```

### Build a Form

```
Input bg: #ffffff
Input border: 1px solid #35322d
Focus: border-color #ccff00
Label: #bfbfbf 12px
Spacing: 16px between fields
Radius: 10px
```

### General Component

```
1. Read DESIGN.md Sections 2-6 for tokens
2. Colors: only from palette
3. Font: Maison Neue Extended, type scale from Section 3
4. Spacing: 4px grid
5. Components: match patterns from Section 4
6. Elevation: shadow tokens
```

## Bundled Fonts (fonts/)

The following font files are bundled in the `fonts/` directory:

- `fonts/CapsuleSansBookCover-Regular.woff`
- `fonts/CapsuleSansDisplay-500.woff`
- `fonts/CapsuleSansDisplay-500.woff2`
- `fonts/CapsuleSansDisplay-Regular.woff`
- `fonts/CapsuleSansDisplay-Regular.woff2`
- `fonts/CapsuleSansText-300.woff`
- `fonts/CapsuleSansText-300.woff2`
- `fonts/CapsuleSansText-500.woff`
- `fonts/CapsuleSansText-500.woff2`
- `fonts/CapsuleSansText-700.woff`
- `fonts/CapsuleSansText-700.woff2`
- `fonts/CapsuleSansText-Regular.woff`
- `fonts/CapsuleSansText-Regular.woff2`
- `fonts/CapsuleSansTextMono-Regular.woff`
- `fonts/CapsuleSansTextMono-Regular.woff2`
- `fonts/Geist-Black.ttf`
- `fonts/Geist-Bold.ttf`
- `fonts/Geist-ExtraBold.ttf`
- `fonts/Geist-ExtraLight.ttf`
- `fonts/Geist-Light.ttf`
- `fonts/Geist-Medium.ttf`
- `fonts/Geist-Regular.ttf`
- `fonts/Geist-SemiBold.ttf`
- `fonts/Geist-Thin.ttf`
- `fonts/ITCGaramondStd-Regular.woff`
- `fonts/ITCGaramondStd-Regular.woff2`
- `fonts/InstrumentSerif-Regular.ttf`
- `fonts/MaisonNeueExtended-Regular.woff`
- `fonts/MaisonNeueExtended-Regular.woff2`
- `fonts/MartinaPlantijn-Regular.woff`
- `fonts/MartinaPlantijn-Regular.woff2`
- `fonts/NibProBookCover-300.woff`
- `fonts/NibProDisplay-300.woff`
- `fonts/NibProDisplay-300.woff2`
- `fonts/NibProDisplay-500.woff`
- `fonts/NibProDisplay-500.woff2`
- `fonts/NibProDisplay-700.woff`
- `fonts/NibProDisplay-700.woff2`
- `fonts/NibProDisplay-Regular.woff`
- `fonts/NibProDisplay-Regular.woff2`
- `fonts/Phonic-300.woff`
- `fonts/Phonic-300.woff2`
- `fonts/Phonic-500.woff`
- `fonts/Phonic-500.woff2`
- `fonts/Phonic-700.woff`
- `fonts/Phonic-700.woff2`
- `fonts/Phonic-Regular.woff`
- `fonts/Phonic-Regular.woff2`

Use these local font files in `@font-face` declarations instead of fetching from Google Fonts.

## Homepage Screenshots (screenshots/)

![homepage.png](screenshots/homepage.png)

