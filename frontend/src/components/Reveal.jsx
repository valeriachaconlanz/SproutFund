import { motion, useReducedMotion } from 'motion/react'
import { fadeUp, resolveVariants, viewportOnce } from '../lib/motion'

/* Fades and rises its children the first time they scroll into view.
 *
 * Fires once and never again — scrolling back up a page that keeps re-animating
 * is the fastest way to make motion feel cheap.
 *
 * `as` lets callers keep semantic markup (section, li, article) instead of
 * wrapping everything in extra divs that would disturb grid/flex layouts.
 */
function Reveal({ as = 'div', children, delay = 0, className, ...rest }) {
  const shouldReduceMotion = useReducedMotion()
  const Component = motion[as] ?? motion.div

  const variants = resolveVariants(
    delay
      ? { ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay } } }
      : fadeUp,
    shouldReduceMotion,
  )

  return (
    <Component
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      {...rest}
    >
      {children}
    </Component>
  )
}

export default Reveal
