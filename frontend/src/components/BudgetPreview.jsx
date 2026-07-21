import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { getBudgetTierKey } from '../lib/budgetTiers'
import { duration, ease, liftHover, liftTap, resolveTransition, softSpring } from '../lib/motion'

/* A live, no-commitment taste of the survey.
 *
 * Drag the slider and the tier, description, and split all update instantly —
 * driven by the same getBudgetTierKey the real form uses, so what someone sees
 * here is what they'll actually get.
 *
 * The split is explicitly labelled illustrative: the real allocation is
 * computed server-side from budget + timeline + risk, which this preview
 * deliberately doesn't ask for. Tier text and split categories come from i18n.
 */

/* Slider positions are non-linear — most first-time investors start well under
   $10k, so a linear scale would bury the interesting range in the first inch.
   The exponent spreads the low end out. */
const MIN = 100
const MAX = 50000
const CURVE = 2.5

function positionToAmount(pos) {
  const raw = MIN + (MAX - MIN) * Math.pow(pos, CURVE)
  /* Round to something a person would actually type. */
  if (raw < 1000) return Math.round(raw / 50) * 50
  if (raw < 10000) return Math.round(raw / 250) * 250
  return Math.round(raw / 1000) * 1000
}

function BudgetPreview() {
  const navigate = useNavigate()
  const shouldReduceMotion = useReducedMotion()
  const { t } = useTranslation()
  const [position, setPosition] = useState(0.42)

  const amount = positionToAmount(position)
  const tierKey = getBudgetTierKey(amount) ?? 'starter'
  const tier = t(`common.tiers.${tierKey}`, { returnObjects: true })
  const split = t(`home.budgetPreview.splits.${tierKey}`, { returnObjects: true })

  return (
    <div className="budget-preview">
      <div className="budget-preview-head">
        <label className="budget-preview-label" htmlFor="budget-preview-slider">
          {t('home.budgetPreview.ifYouStarted')}
        </label>
        <output className="budget-preview-amount" htmlFor="budget-preview-slider">
          ${amount.toLocaleString()}
        </output>
      </div>

      <input
        id="budget-preview-slider"
        className="budget-preview-slider"
        type="range"
        min={0}
        max={1}
        step={0.001}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        aria-label={t('home.budgetPreview.sliderLabel')}
        aria-valuetext={`$${amount.toLocaleString()}`}
      />

      <div className="budget-preview-scale" aria-hidden="true">
        <span>{t('home.budgetPreview.scaleMin')}</span>
        <span>{t('home.budgetPreview.scaleMax')}</span>
      </div>

      <div className="budget-preview-body">
        <div className="budget-preview-tier-row">
          <span className="budget-preview-tier-caption">{t('home.budgetPreview.youdBeIn')}</span>
          {/* Keyed on tier so it re-animates only when the tier actually
              changes, not on every pixel of slider movement. Deliberately NOT
              wrapped in AnimatePresence: an exit animation would hold the old
              tier on screen while dragging, so the badge would visibly lag the
              number above it. A key change remounts and replays `initial`. */}
          <motion.span
            key={tierKey}
            className="budget-preview-tier-badge"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : duration.fast, ease: ease.standard }}
          >
            {tier.label}
          </motion.span>
        </div>

        <motion.p
          key={`${tierKey}-desc`}
          className="budget-preview-desc"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : duration.fast }}
        >
          {tier.desc}
        </motion.p>

        <div className="budget-preview-split">
          {split.map((slice) => (
            <div className="budget-preview-slice" key={slice.name}>
              <div className="budget-preview-slice-head">
                <span className="budget-preview-slice-name">{slice.name}</span>
                <span className="budget-preview-slice-value">
                  ${Math.round((amount * slice.pct) / 100).toLocaleString()}
                </span>
              </div>
              <div className="budget-preview-track">
                {/* Animating width (not a re-mount) lets the bars glide as the
                    slider moves rather than restarting on every change. */}
                <motion.div
                  className="budget-preview-fill"
                  animate={{ width: `${slice.pct}%` }}
                  transition={resolveTransition(softSpring, shouldReduceMotion)}
                />
              </div>
            </div>
          ))}
        </div>

        <p className="budget-preview-note">{t('home.budgetPreview.note')}</p>

        <motion.button
          type="button"
          className="budget-preview-cta"
          onClick={() => navigate('/dashboard')}
          whileHover={shouldReduceMotion ? undefined : liftHover}
          whileTap={shouldReduceMotion ? undefined : liftTap}
        >
          {t('home.budgetPreview.cta')}
        </motion.button>
      </div>
    </div>
  )
}

export default BudgetPreview
