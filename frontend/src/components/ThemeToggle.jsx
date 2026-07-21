import { motion, useReducedMotion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../context/useTheme'
import { resolveTransition } from '../lib/motion'
import './ThemeToggle.css'

function ThemeToggle() {
  const { t } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const shouldReduceMotion = useReducedMotion()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className={`theme-switch${isDark ? ' is-dark' : ''}`}
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? t('theme.switchToLight') : t('theme.switchToDark')}
    >
      <span className="theme-switch-icon sun" aria-hidden="true">☀</span>
      <span className="theme-switch-icon moon" aria-hidden="true">☾</span>
      <motion.span
        className="theme-switch-knob"
        animate={{ x: isDark ? 22 : 0 }}
        transition={resolveTransition(
          { type: 'spring', stiffness: 500, damping: 32 },
          shouldReduceMotion,
        )}
      />
    </button>
  )
}

export default ThemeToggle
