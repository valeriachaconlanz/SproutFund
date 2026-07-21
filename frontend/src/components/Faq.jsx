import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { duration, ease } from '../lib/motion'

/* Answers are derived from how the app actually behaves — the public survey
 * route, the auth gate on saving, the disclaimer the backend returns. If any
 * of that changes, these (in the i18n catalogue under faq.items) need to
 * change with it.
 */
function Faq() {
  const { t } = useTranslation()
  const items = t('faq.items', { returnObjects: true })
  const [openIndex, setOpenIndex] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="faq-list">
      {items.map((item, index) => {
        const isOpen = openIndex === index

        return (
          <div className={`faq-item${isOpen ? ' open' : ''}`} key={item.q}>
            <button
              type="button"
              className="faq-question"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${index}`}
            >
              <span>{item.q}</span>
              {/* One glyph rotated 45° rather than swapping +/− icons, so the
                  state change is a single continuous motion. */}
              <motion.span
                className="faq-icon"
                aria-hidden="true"
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : duration.fast, ease: ease.standard }}
              >
                +
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  className="faq-answer"
                  id={`faq-answer-${index}`}
                  key="answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: shouldReduceMotion ? 0 : duration.base, ease: ease.standard }}
                >
                  <p>{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

export default Faq
