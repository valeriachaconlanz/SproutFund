import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/* Owns scroll behaviour on navigation.
 *
 * Three cases, in priority order:
 *
 * 1. A #hash target wins over everything. The command palette and the inline
 *    glossary popovers both deep-link to a specific entry (/glossary#term-etf),
 *    so the hash has to be honoured before any scroll-to-top or restore — those
 *    would otherwise land the user somewhere else on the page.
 * 2. The glossary remembers where you were, so returning from a term doesn't
 *    dump you back at the top of a long A–Z list.
 * 3. Everything else resets to the top. Without this, navigating from the
 *    bottom of a long page drops you into the middle of the next one — which
 *    also left the Results count-up figures below the fold, so they never
 *    animated and read $0.00.
 */
const SCROLL_MEMORY_PATHS = ['/glossary']

function ScrollService() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      /* Wait a frame so the target exists after the route's chunk renders. */
      requestAnimationFrame(() => {
        const target = document.querySelector(hash)
        if (target) {
          target.scrollIntoView({ block: 'start' })
          return
        }
        window.scrollTo(0, 0)
      })
      return
    }

    if (!SCROLL_MEMORY_PATHS.includes(pathname)) {
      window.scrollTo(0, 0)
      return
    }

    const key = `scroll-position-${pathname}`
    const savedPosition = sessionStorage.getItem(key)
    if (savedPosition) {
      window.scrollTo(0, Number(savedPosition))
    }

    function saveScrollPosition() {
      sessionStorage.setItem(key, window.scrollY)
    }

    window.addEventListener('scroll', saveScrollPosition)
    return () => window.removeEventListener('scroll', saveScrollPosition)
  }, [pathname, hash])

  return null
}

export default ScrollService
