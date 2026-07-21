/* Shared motion vocabulary.
 *
 * Everything animated in the app pulls its timing from here, so the whole
 * product moves with one voice instead of each page inventing its own curve.
 *
 * The house style is "refined": things enter once, settle, and then stay put.
 * Nothing loops forever — perpetual motion reads as decoration, not intent.
 */

/* Easings. `standard` is the workhorse; `exit` is faster because leaving
   should never make the user wait on an element they've already dismissed. */
export const ease = {
  standard: [0.22, 1, 0.36, 1],
  exit: [0.4, 0, 1, 1],
}

export const duration = {
  fast: 0.18,
  base: 0.32,
  slow: 0.55,
}

/* Springs. `bounceSpring` predates this file and is still used by the navbar's
   sliding active pill — kept at its original values so that stays identical. */
export const bounceSpring = { type: 'spring', stiffness: 400, damping: 25 }
export const softSpring = { type: 'spring', stiffness: 260, damping: 30 }
export const quickFade = { duration: 0.15, ease: 'easeIn' }

/* How far elements travel when they rise into place. Small on purpose —
   long journeys draw attention to the animation rather than the content. */
const RISE = 16

export const fadeUp = {
  hidden: { opacity: 0, y: RISE },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: ease.standard },
  },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.base, ease: ease.standard } },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.base, ease: ease.standard },
  },
}

/* Container variant: children inherit `visible` and fire in sequence.
   `staggerChildren` is deliberately short — past ~0.12s a list starts to feel
   like it's loading slowly rather than arriving deliberately. */
export function staggerContainer(stagger = 0.07, delayChildren = 0) {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  }
}

/* Route-level transition. Exits are quicker than enters so back-to-back
   navigation doesn't feel sluggish. */
export const pageVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: ease.standard },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: duration.fast, ease: ease.exit },
  },
}

/* Hover/tap feedback for buttons and cards. Subtle by design: a 2px lift
   reads as responsive, an 8px lift reads as a toy. */
export const liftHover = { y: -2 }
export const liftTap = { y: 0, scale: 0.985 }

export function resolveTransition(transition, shouldReduceMotion) {
  return shouldReduceMotion ? { duration: 0 } : transition
}

/* Collapses any variant set to a plain cross-fade-free state when the user has
   asked for reduced motion: no travel, no scale, no stagger — just presence.
   Callers pass their variants through this instead of branching at each site. */
export function resolveVariants(variants, shouldReduceMotion) {
  if (!shouldReduceMotion) return variants
  return {
    hidden: { opacity: 1 },
    visible: { opacity: 1, transition: { duration: 0, staggerChildren: 0 } },
    exit: { opacity: 1, transition: { duration: 0 } },
  }
}

/* Shared viewport config so every scroll-triggered reveal fires at the same
   point. `once` is what keeps the page calm on scroll-back. */
export const viewportOnce = { once: true, amount: 0.25, margin: '0px 0px -80px 0px' }
