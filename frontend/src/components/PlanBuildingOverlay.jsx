import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { duration, ease } from '../lib/motion'
import './PlanBuildingOverlay.css'

/* Covers the wait while the backend builds a plan.
 *
 * That request calls the Anthropic API and takes roughly ten seconds. The only
 * previous feedback was the submit button reading "Analyzing…", which over ten
 * seconds is indistinguishable from a hung page.
 *
 * The stages are honest about what they are: paced narration of a single
 * request, not real progress events. They're ordered to match what the backend
 * actually does with the answers, and the last one is open-ended so a slow
 * response never contradicts a claim that the work is finished. Stage text
 * lives in i18n (planOverlay.stages).
 */
const STAGE_AT = [0, 1800, 4200, 7000]

function PlanBuildingOverlay({ open, budget }) {
  const shouldReduceMotion = useReducedMotion()
  const { t } = useTranslation()
  const [stage, setStage] = useState(0)
  const stages = t('planOverlay.stages', { returnObjects: true })

  useEffect(() => {
    if (!open) return

    /* One timer per stage rather than an interval, so the pacing can be uneven
       and each stage lands when its work plausibly starts. */
    const timers = STAGE_AT.slice(1).map((at, i) =>
      window.setTimeout(() => setStage(i + 1), at),
    )
    return () => {
      timers.forEach(window.clearTimeout)
      setStage(0)
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="plan-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : duration.base }}
          role="status"
          aria-live="polite"
        >
          <motion.div
            className="plan-overlay-card"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: shouldReduceMotion ? 0 : duration.base, ease: ease.standard }}
          >
            {/* A sprout drawing itself — on brand, and a continuously animating
                mark is the clearest signal that the app is still working. */}
            <svg className="plan-overlay-mark" viewBox="0 0 64 64" aria-hidden="true">
              <motion.path
                className="plan-overlay-stem"
                d="M32 56 L32 26"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 1.1,
                  ease: ease.standard,
                  repeat: shouldReduceMotion ? 0 : Infinity,
                  repeatType: 'reverse',
                  repeatDelay: 0.3,
                }}
              />
              <motion.path
                className="plan-overlay-leaf"
                d="M32 34 C 20 34, 14 26, 14 18 C 24 18, 31 24, 32 34 Z"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ transformOrigin: '32px 30px' }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.8,
                  delay: shouldReduceMotion ? 0 : 0.5,
                  ease: ease.standard,
                  repeat: shouldReduceMotion ? 0 : Infinity,
                  repeatType: 'reverse',
                  repeatDelay: 0.6,
                }}
              />
              <motion.path
                className="plan-overlay-leaf"
                d="M32 30 C 44 30, 50 22, 50 14 C 40 14, 33 20, 32 30 Z"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ transformOrigin: '32px 26px' }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.8,
                  delay: shouldReduceMotion ? 0 : 0.8,
                  ease: ease.standard,
                  repeat: shouldReduceMotion ? 0 : Infinity,
                  repeatType: 'reverse',
                  repeatDelay: 0.6,
                }}
              />
            </svg>

            <h2 className="plan-overlay-title">{t('planOverlay.title')}</h2>

            {budget ? (
              <p className="plan-overlay-budget">
                ${Number(budget).toLocaleString()}
              </p>
            ) : null}

            <div className="plan-overlay-stage">
              <AnimatePresence mode="wait">
                <motion.span
                  key={stage}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: shouldReduceMotion ? 0 : duration.fast, ease: ease.standard }}
                >
                  {stages[stage]}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="plan-overlay-dots" aria-hidden="true">
              {STAGE_AT.map((at, i) => (
                <span
                  key={at}
                  className={`plan-overlay-dot${i <= stage ? ' done' : ''}`}
                />
              ))}
            </div>

            <p className="plan-overlay-note">{t('planOverlay.note')}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PlanBuildingOverlay
