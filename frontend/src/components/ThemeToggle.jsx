import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useTheme } from '../context/ThemeContext'
import { resolveTransition } from '../lib/motion'
import './ThemeToggle.css'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const shouldReduceMotion = useReducedMotion()

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          className="theme-toggle-icon"
          initial={{ rotate: -90, opacity: 0 }}
          animate={{
            rotate: 0,
            opacity: 1,
            transition: resolveTransition({ duration: 0.25 }, shouldReduceMotion),
          }}
          exit={{
            rotate: 90,
            opacity: 0,
            transition: resolveTransition({ duration: 0.15 }, shouldReduceMotion),
          }}
        >
          {theme === 'light' ? '☽' : '○'}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

export default ThemeToggle
