import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function ScrollRestoration() {
  const location = useLocation()

  useEffect(() => {
    const path = location.pathname

    // Only enable scroll memory for glossary
    if (path !== '/glossary') {
      window.scrollTo(0, 0)
      return
    }

    const savedPosition = sessionStorage.getItem(
      `scroll-position-${path}`
    )

    if (savedPosition) {
      window.scrollTo(0, Number(savedPosition))
    }

    function saveScrollPosition() {
      sessionStorage.setItem(
        `scroll-position-${path}`,
        window.scrollY
      )
    }

    window.addEventListener('scroll', saveScrollPosition)

    return () => {
      window.removeEventListener('scroll', saveScrollPosition)
    }
  }, [location.pathname])

  return null
}

export default ScrollRestoration