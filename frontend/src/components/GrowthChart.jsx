import { useMemo } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { ease } from '../lib/motion'

/* The hero's signature visual: compound growth drawn as a real curve.
 *
 * The numbers are genuinely computed, not drawn by hand — `principal` grown at
 * `rate` for `years`. The 7% assumption is a stated assumption, surfaced in the
 * caption rather than buried, because an unlabelled growth curve on a finance
 * page implies a promise the product can't make.
 */

const VIEW_W = 640
const VIEW_H = 260
const PAD = { top: 24, right: 16, bottom: 28, left: 16 }

function compoundSeries({ principal, rate, years }) {
  return Array.from({ length: years + 1 }, (_, year) => ({
    year,
    value: principal * Math.pow(1 + rate, year),
  }))
}

function buildPath(points, maxValue, years) {
  const plotW = VIEW_W - PAD.left - PAD.right
  const plotH = VIEW_H - PAD.top - PAD.bottom

  return points
    .map((p, i) => {
      const x = PAD.left + (p.year / years) * plotW
      const y = PAD.top + plotH - (p.value / maxValue) * plotH
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
}

function GrowthChart({ principal = 5000, rate = 0.07, years = 30 }) {
  const shouldReduceMotion = useReducedMotion()
  const { t } = useTranslation()

  const { linePath, areaPath, endPoint, endValue } = useMemo(() => {
    const points = compoundSeries({ principal, rate, years })
    const maxValue = points[points.length - 1].value
    const line = buildPath(points, maxValue, years)

    const plotW = VIEW_W - PAD.left - PAD.right
    const plotH = VIEW_H - PAD.top - PAD.bottom
    const lastX = PAD.left + plotW
    const lastY = PAD.top + plotH - (maxValue / maxValue) * plotH

    return {
      linePath: line,
      /* Closed back along the baseline so it can be filled as a soft area. */
      areaPath: `${line} L ${lastX} ${PAD.top + plotH} L ${PAD.left} ${PAD.top + plotH} Z`,
      endPoint: { x: lastX, y: lastY },
      endValue: maxValue,
    }
  }, [principal, rate, years])

  const drawDuration = shouldReduceMotion ? 0 : 1.8

  return (
    <figure className="growth-chart">
      <svg
        className="growth-chart-svg"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        role="img"
        aria-label={`${principal.toLocaleString()} → ${Math.round(endValue).toLocaleString()}`}
      >
        <defs>
          <linearGradient id="growth-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" className="growth-fill-top" />
            <stop offset="100%" className="growth-fill-bottom" />
          </linearGradient>
        </defs>

        {/* Baseline grid — quiet, just enough to give the curve somewhere to sit. */}
        {[0.25, 0.5, 0.75, 1].map((tick) => (
          <line
            key={tick}
            className="growth-grid-line"
            x1={PAD.left}
            x2={VIEW_W - PAD.right}
            y1={PAD.top + (VIEW_H - PAD.top - PAD.bottom) * tick}
            y2={PAD.top + (VIEW_H - PAD.top - PAD.bottom) * tick}
          />
        ))}

        <motion.path
          className="growth-area"
          d={areaPath}
          fill="url(#growth-fill)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.8, delay: drawDuration * 0.5 }}
        />

        {/* pathLength normalises the dash to 0–1 so the draw works regardless
            of the curve's actual length in user units. */}
        <motion.path
          className="growth-line"
          d={linePath}
          initial={{ pathLength: shouldReduceMotion ? 1 : 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: drawDuration, ease: ease.standard }}
        />

        <motion.circle
          className="growth-dot"
          cx={endPoint.x}
          cy={endPoint.y}
          r={6}
          initial={{ scale: shouldReduceMotion ? 1 : 0, opacity: shouldReduceMotion ? 1 : 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.4,
            delay: drawDuration * 0.95,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        />
      </svg>

      <figcaption className="growth-chart-caption">
        <span className="growth-chart-figure">
          ${principal.toLocaleString()} → ${Math.round(endValue).toLocaleString()}
        </span>
        <span className="growth-chart-note">
          {t('home.growthChart.note', {
            principal: principal.toLocaleString(),
            rate: (rate * 100).toFixed(0),
            years,
          })}
        </span>
      </figcaption>
    </figure>
  )
}

export default GrowthChart
