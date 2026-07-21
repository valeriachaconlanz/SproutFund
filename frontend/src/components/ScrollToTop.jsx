import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/* Resets scroll on navigation.
 *
 * React Router doesn't do this: the browser keeps the previous scroll offset,
 * so navigating from the bottom of a long page dropped you into the middle of
 * the next one. Most visibly, submitting the survey (scrolled near the bottom)
 * landed on Results already scrolled past the summary — which also meant the
 * count-up figures never entered the viewport and sat at $0.00.
 *
 * Hash targets are honoured instead of overridden, since the command palette
 * and the glossary previews both link to specific terms.
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      /* Wait a frame so the target exists after the route's chunk renders. */
      requestAnimationFrame(() => {
        const el = document.querySelector(hash)
        if (el) {
          el.scrollIntoView({ block: 'start' })
          return
        }
        window.scrollTo(0, 0)
      })
      return
    }

    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

export default ScrollToTop
