export const bounceSpring = { type: 'spring', stiffness: 400, damping: 25 }
export const quickFade = { duration: 0.15, ease: 'easeIn' }

export function resolveTransition(transition, shouldReduceMotion) {
  return shouldReduceMotion ? { duration: 0 } : transition
}
