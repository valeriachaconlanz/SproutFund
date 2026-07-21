import { motion, useReducedMotion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { duration, ease, resolveTransition, softSpring } from '../lib/motion'
import './SurveyProgress.css'

/* Sticky progress for the survey.
 *
 * The form asks only three questions, but they're spread across a long page
 * with a lot of supporting content between them. Without this there's no way
 * to tell whether you're nearly done or barely started.
 *
 * Appears once the user has answered at least one question — showing an empty
 * 0/3 bar before anyone has engaged is just chrome.
 */
const STEP_KEYS = ['budget', 'timeline', 'risk']

function SurveyProgress({ answered }) {
  const shouldReduceMotion = useReducedMotion()
  const { t } = useTranslation()
  const completed = STEP_KEYS.filter((key) => answered[key]).length
  const pct = (completed / STEP_KEYS.length) * 100

  if (completed === 0) return null

  return (
    <motion.div
      className="survey-progress"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : duration.base, ease: ease.standard }}
    >
      <div className="survey-progress-inner">
        <div className="survey-progress-steps">
          {STEP_KEYS.map((key) => (
            <span
              key={key}
              className={`survey-progress-step${answered[key] ? ' done' : ''}`}
            >
              <span className="survey-progress-dot" aria-hidden="true" />
              {t(`surveyProgress.${key}`)}
            </span>
          ))}
        </div>

        <span className="survey-progress-count">
          {t('surveyProgress.count', { done: completed, total: STEP_KEYS.length })}
        </span>
      </div>

      <div
        className="survey-progress-track"
        role="progressbar"
        aria-valuenow={completed}
        aria-valuemin={0}
        aria-valuemax={STEP_KEYS.length}
        aria-label={t('surveyProgress.ariaLabel')}
      >
        <motion.div
          className="survey-progress-fill"
          animate={{ width: `${pct}%` }}
          transition={resolveTransition(softSpring, shouldReduceMotion)}
        />
      </div>
    </motion.div>
  )
}

export default SurveyProgress
