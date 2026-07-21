import { motion, useReducedMotion } from 'motion/react'
import { pageVariants, resolveVariants } from '../lib/motion'

/* Wraps a route's contents so navigation cross-fades instead of snapping.
 *
 * Every routed page mounts inside one of these; the AnimatePresence that drives
 * the exit half lives in App.jsx, keyed on pathname.
 */
function PageTransition({ children }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      variants={resolveVariants(pageVariants, shouldReduceMotion)}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}

export default PageTransition
