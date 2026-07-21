import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'motion/react'
import { duration } from '../lib/motion'

/* Counts a number up from zero when it first scrolls into view.
 *
 * Used for the figures on Results, where watching a dollar amount resolve
 * makes the number feel earned rather than just printed.
 *
 * Deliberately not driven by motion's animate(): we need to run the formatter
 * on every frame so currency/percent strings stay correctly formatted mid-count,
 * which a raw motion value can't express.
 */
function CountUp({ value, format = (n) => Math.round(n).toLocaleString(), className }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const shouldReduceMotion = useReducedMotion()
  const [progressValue, setProgressValue] = useState(0)

  /* Reduced motion (or a non-finite value) skips the animation entirely and
     renders the final figure — the count is decoration, the number is content.
     Derived during render rather than pushed through state in an effect. */
  const shouldAnimate = !shouldReduceMotion && Number.isFinite(value)

  useEffect(() => {
    if (!shouldAnimate || !isInView) return

    const totalMs = duration.slow * 1000
    let frame
    let start

    const tick = (now) => {
      if (start === undefined) start = now
      const progress = Math.min((now - start) / totalMs, 1)
      /* easeOutCubic — fast out of the gate, gentle landing on the real value. */
      setProgressValue(value * (1 - Math.pow(1 - progress, 3)))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [isInView, value, shouldAnimate])

  return (
    <span ref={ref} className={className}>
      {format(shouldAnimate ? progressValue : value)}
    </span>
  )
}

export default CountUp
