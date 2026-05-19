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
  src: url("https://cdn.robinhood.com/assets/generated_assets/brand/_next/static/fonts/CapsuleSansText-Mono__1eb62580f1b1a5cd4904a665edc4447c0c639b7820f6c19e6a8aabea9b7de3d8.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Maison Neue Extended";
  src: url("https://cdn.robinhood.com/assets/generated_assets/brand/_next/static/fonts/MaisonNeueExtendedWEB-Book__ec5066707e9199414c0820c1c16e7323fa638fe3ac815702afca4ed5840fdf93.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Capsule Sans Text";
  src: url("https://cdn.robinhood.com/assets/generated_assets/brand/_next/static/fonts/CapsuleSansText-Book__6573ba5ca76b29d5ffe83d94b27a4a8a09c8d5c8d5f2ca0719aaeef6856042d8.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Capsule Sans Text";
  src: url("https://cdn.robinhood.com/assets/generated_assets/brand/_next/static/fonts/CapsuleSansText-Bold__0ef7c688bd1385a7df6941a13f3b4e980cd2f90f01b9268c9bb3e95394eec486.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "Capsule Sans Display";
  src: url("https://cdn.robinhood.com/assets/generated_assets/brand/_next/static/fonts/CapsuleSansText-Book__6573ba5ca76b29d5ffe83d94b27a4a8a09c8d5c8d5f2ca0719aaeef6856042d8.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Nib Pro Display";
  src: url("https://cdn.robinhood.com/assets/generated_assets/brand/_next/static/fonts/Nib-Regular-Pro__6500974df6ea2199ee7856eb141814151002d1911bb43ea9fa19ca34369a8e82.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Nib Pro Display";
  src: url("https://cdn.robinhood.com/assets/generated_assets/brand/_next/static/fonts/Nib-Black-Pro__7ad99da3653f05b5eaed9209b8754fedd68cc7f11dd7848dd59daa06198c6515.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "ITC Garamond Std";
  src: url("https://cdn.robinhood.com/assets/generated_assets/brand/_next/static/fonts/ITCGaramondStd__aa05260f780922b9812cd5ea6618c780c7d158993f1c0a0f330290cc7272b597.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Phonic";
  src: url("https://cdn.robinhood.com/assets/generated_assets/brand/_next/static/fonts/RHPhonic-Regular__66da8fcfda05a8b53afe5c8697bdb1b2fd883e748a29f65a628d7a98aad40982.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Phonic";
  src: url("https://cdn.robinhood.com/assets/generated_assets/brand/_next/static/fonts/RHPhonic-Bold__7f2cc2d831ae8cb196f347fee306ddd1ce4eb72b3dd76a05e28720a23f5a4ee3.woff2") format("woff2");
  font-weight: 700;
}
@font-face {
  font-family: "Martina Plantijn";
  src: url("https://cdn.robinhood.com/assets/generated_assets/brand/_next/static/fonts/MartinaPlantijn-Regular__e02ea76d18e952604fbe5636471d4c7e48f8db1c01fa15ee0e0170347f966405.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Instrument Serif";
  src: url("https://cdn.robinhood.com/assets/generated_assets/brand/_next/static/fonts/InstrumentSerif-Regular__60c06664b5a95c7de6cc3e00d1f9034d78bd1e40b564016b241674449a067d4d.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Geist";
  src: url("https://cdn.robinhood.com/assets/generated_assets/brand/_next/static/fonts/Geist-Regular__a29f900a6d603e989449327956e7ac61ea3e6b26ca7426f64e7cccf2cd4aed37.woff2") format("woff2");
  font-weight: 400;
}
@font-face {
  font-family: "Nib Pro Book Cover";
  src: url("https://cdn.robinhood.com/assets/generated_assets/webapp/59b7f13dd4b4f1eaac54.woff2") format("woff2");
  font-weight: 300;
}
@font-face {
  font-family: "Capsule Sans Book Cover";
  src: url("https://cdn.robinhood.com/assets/generated_assets/webapp/328dc7da9a95e55b6ea7.woff2") format("woff2");
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
