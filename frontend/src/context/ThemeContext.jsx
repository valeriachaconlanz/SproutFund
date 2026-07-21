import { useEffect, useState } from 'react'
import { ThemeContext } from './themeContextObject'


// Called inside useState so the correct theme is known before the first render,
// avoiding a flash of the wrong theme on load
function getInitialTheme() {
  const stored = localStorage.getItem('sproutfund_theme')
  if (stored === 'dark' || stored === 'light') return stored
  // Fall back to the OS preference if the user hasn't chosen yet
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    // data-theme on <html> is what all the CSS variable overrides key off of
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('sproutfund_theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme(t => (t === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

