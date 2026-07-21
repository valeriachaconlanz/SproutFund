import { motion, useReducedMotion } from 'motion/react'
import { fadeUp, resolveVariants, staggerContainer, viewportOnce } from '../lib/motion'

/* Reveals a group of children in sequence when the group scrolls into view.
 *
 * Pair with <Stagger.Item>: the container owns the timing, each item owns its
 * own entrance. Children must be Stagger.Item (or any motion element using the
 * hidden/visible variant names) for the sequence to propagate.
 */
function Stagger({ as = 'div', children, stagger = 0.07, delayChildren = 0, className, ...rest }) {
  const shouldReduceMotion = useReducedMotion()
  const Component = motion[as] ?? motion.div

  return (
    <Component
      className={className}
      variants={resolveVariants(staggerContainer(stagger, delayChildren), shouldReduceMotion)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      {...rest}
    >
      {children}
    </Component>
  )
}

function StaggerItem({ as = 'div', children, className, ...rest }) {
  const shouldReduceMotion = useReducedMotion()
  const Component = motion[as] ?? motion.div

  return (
    <Component
      className={className}
      variants={resolveVariants(fadeUp, shouldReduceMotion)}
      {...rest}
    >
      {children}
    </Component>
  )
}

Stagger.Item = StaggerItem

export default Stagger
