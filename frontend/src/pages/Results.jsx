import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, useReducedMotion } from 'motion/react'
import { useAuth } from '../context/useAuth'
import { TIMELINE_LABELS, RISK_LABELS } from '../lib/labels'
import { duration, ease, liftHover, liftTap, viewportOnce } from '../lib/motion'
import CountUp from '../components/CountUp'
import Reveal from '../components/Reveal'
import Stagger from '../components/Stagger'
import './Results.css'

const COLORS = ['#ccff00', '#7eb8f7', '#f7a07e']

const PENDING_PLAN_KEY = 'sproutfund_pending_plan'

function readPendingPlan() {
  try {
    const stored = sessionStorage.getItem(PENDING_PLAN_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function formatCurrency(value) {
  return Number(value).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function buildPrintablePlan({ budget, timeline, risk, strategies, disclaimer }) {
  const strategyRows = strategies.map((strategy, index) => `
    <section class="strategy">
      <div class="strategy-head">
        <strong>${index + 1}. ${escapeHtml(strategy.name)}</strong>
        <span>${escapeHtml(strategy.allocation)}% / ${formatCurrency(Math.round(budget * strategy.allocation / 100))}</span>
      </div>
      <p>${escapeHtml(strategy.description)}</p>
      ${strategy.vehicles?.length ? `<p><strong>Where to invest:</strong> ${strategy.vehicles.map(escapeHtml).join(', ')}</p>` : ''}
      ${strategy.platform ? `<p><strong>Platform:</strong> ${escapeHtml(strategy.platform)}</p>` : ''}
    </section>
  `).join('')

  return `
    <!doctype html>
    <html>
      <head>
        <title>SproutFund Investment Plan</title>
        <style>
          body { font-family: Arial, sans-serif; color: #111; margin: 32px; line-height: 1.5; }
          h1 { margin: 0 0 8px; font-size: 28px; }
          .meta { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 24px 0; }
          .meta div, .strategy, .disclaimer { border: 1px solid #ddd; border-radius: 8px; padding: 14px; }
          .label { color: #666; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; }
          .value { display: block; margin-top: 4px; font-weight: 700; }
          .strategy { margin-bottom: 12px; }
          .strategy-head { display: flex; justify-content: space-between; gap: 16px; }
          .disclaimer { margin-top: 18px; color: #555; font-size: 13px; }
        </style>
      </head>
      <body>
        <h1>SproutFund Investment Plan</h1>
        <p>Personalized strategies based on your inputs.</p>
        <div class="meta">
          <div><span class="label">Budget</span><span class="value">${formatCurrency(budget)}</span></div>
          <div><span class="label">Timeline</span><span class="value">${escapeHtml(timeline)}</span></div>
          <div><span class="label">Risk Level</span><span class="value">${escapeHtml(risk)}</span></div>
        </div>
        ${strategyRows}
        ${disclaimer ? `<div class="disclaimer">${escapeHtml(disclaimer)}</div>` : ''}
      </body>
    </html>
  `
}

function AllocationBar({ strategies }) {
  const { t } = useTranslation()
  const shouldReduceMotion = useReducedMotion()

  return (
    <Reveal className="allocation-wrap">
      <p className="allocation-heading">{t('results.allocation')}</p>
      <div className="allocation-bar">
        {strategies.map((s, i) => (
          <motion.div
            key={i}
            className="allocation-segment"
            style={{ background: COLORS[i % COLORS.length] }}
            initial={shouldReduceMotion ? false : { width: 0 }}
            whileInView={{ width: `${s.allocation}%` }}
            viewport={viewportOnce}
            transition={{
              duration: shouldReduceMotion ? 0 : duration.slow,
              ease: ease.standard,
              delay: shouldReduceMotion ? 0 : i * 0.1,
            }}
            title={`${s.name}: ${s.allocation}%`}
          />
        ))}
      </div>
      <Stagger className="allocation-legend" stagger={0.06} delayChildren={0.2}>
        {strategies.map((s, i) => (
          <Stagger.Item key={i} className="legend-item">
            <span className="legend-dot" style={{ background: COLORS[i % COLORS.length] }} />
            <span className="legend-name">{s.name}</span>
            <span className="legend-pct">{s.allocation}%</span>
          </Stagger.Item>
        ))}
      </Stagger>
    </Reveal>
  )
}

function StrategyCard({ strategy, index, budget }) {
  const { t, i18n } = useTranslation()
  const shouldReduceMotion = useReducedMotion()
  const color = COLORS[index % COLORS.length]
  const dollars = Math.round(budget * strategy.allocation / 100)
  const formatted = dollars.toLocaleString(i18n.language === 'es' ? 'es-ES' : 'en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

  return (
    <Stagger.Item className="strategy-card">
      <div className="strategy-top">
        <div className="strategy-left">
          <span className="strategy-num" style={{ color }}>{String(index + 1).padStart(2, '0')}</span>
          <h3 className="strategy-name">{strategy.name}</h3>
        </div>
        <div className="strategy-badge" style={{ background: color }}>
          {strategy.allocation}% &middot; {formatted}
        </div>
      </div>

      <div className="strategy-track">
        <motion.div
          className="strategy-fill"
          style={{ background: color }}
          initial={shouldReduceMotion ? false : { width: 0 }}
          whileInView={{ width: `${strategy.allocation}%` }}
          viewport={viewportOnce}
          transition={{ duration: shouldReduceMotion ? 0 : duration.slow, ease: ease.standard }}
        />
      </div>

      <p className="strategy-desc">{strategy.description}</p>

      {strategy.vehicles && strategy.vehicles.length > 0 && (
        <div className="strategy-vehicles">
          <p className="vehicles-heading">{t('results.whereToInvest')}</p>
          <div className="vehicles-tags">
            {strategy.vehicles.map((v, i) => (
              <span key={i} className="vehicle-tag">{v}</span>
            ))}
          </div>
        </div>
      )}

      {strategy.platform && (
        <div className="strategy-platform">
          <span className="platform-label">{t('results.platform')}</span>
          <span className="platform-value">{strategy.platform}</span>
        </div>
      )}
    </Stagger.Item>
  )
}

function Results() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { token } = useAuth()
  const { t, i18n } = useTranslation()
  const shouldReduceMotion = useReducedMotion()

  const isHistoricallySaved = state?.isSavedPlan || !!state?.id

  const [saveState, setSaveState] = useState(isHistoricallySaved ? 'saved' : 'idle')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [customTitle, setCustomTitle] = useState('')

  const [plan, setPlan] = useState(() => state || readPendingPlan())
  const [syncedState, setSyncedState] = useState(state)

  /* When the router hands us a different plan (e.g. opening a saved plan from
     History), adjust during render instead of in an effect. This is React's
     documented pattern for deriving state from changing props — an effect here
     renders the stale plan first and then immediately re-renders. */
  if (state && state !== syncedState) {
    setSyncedState(state)
    setPlan(state)
    if (state.isSavedPlan || state.id) {
      setSaveState('saved')
    }
  }

  /* Clearing the stash is a side effect, so it stays in an effect. */
  useEffect(() => {
    if (state) {
      sessionStorage.removeItem(PENDING_PLAN_KEY)
    }
  }, [state])

  if (!plan || !plan.budget) {
    return (
      <div className="results-page">
        <div className="results-empty">
          <h1 className="results-title">{t('results.noPlanTitle')}</h1>
          <p className="results-subtitle">{t('results.noPlanSubtitle')}</p>
          <button className="back-btn" onClick={() => navigate('/dashboard')}>{t('results.goToForm')}</button>
        </div>
      </div>
    )
  }

  const { budget, timeline, riskTolerance, riskLevel, strategies, disclaimer } = plan
  const selectedRisk = riskTolerance || riskLevel
  const timelineLabel = TIMELINE_LABELS[timeline] || timeline
  const riskLabel = RISK_LABELS[selectedRisk] || selectedRisk

  function handleDownloadPdf() {
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      window.print()
      return
    }

    printWindow.document.write(buildPrintablePlan({
      budget,
      timeline: timelineLabel,
      risk: riskLabel,
      strategies: strategies || [],
      disclaimer,
    }))
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  function handleSaveClick() {
    if (isHistoricallySaved) return
    if (!token) {
      sessionStorage.setItem(PENDING_PLAN_KEY, JSON.stringify(plan))
      navigate('/auth', { state: { from: { pathname: '/results' } } })
      return
    }
    setCustomTitle('')
    setIsModalOpen(true)
  }

  async function handleFinalSaveConfirm() {
    setIsModalOpen(false)
    setSaveState('saving')
    
    const finalTitle =
      customTitle.trim() ||
      `${t('history.defaultPlanTitle', { number: '' }).trim()} - ${now.toLocaleDateString(
        i18n.language === 'es' ? 'es-ES' : 'en-US'
      )}, ${now.toLocaleTimeString(
        i18n.language === 'es' ? 'es-ES' : 'en-US',
        {
          hour: 'numeric',
          minute: '2-digit',
        }
      )}`

    try {
      const response = await fetch('http://localhost:8080/api/investment/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          title: finalTitle,
          budget: plan.budget,
          timeline: plan.timeline,
          riskTolerance: plan.riskTolerance || plan.riskLevel,
          strategies: plan.strategies || [],
          disclaimer: plan.disclaimer
        })
      })
      if (!response.ok) throw new Error('Save failed.')
      
      sessionStorage.removeItem(PENDING_PLAN_KEY)
      setSaveState('saved')
    } catch {
      setSaveState('error')
    }
  }

  return (
    <div className="results-page">
      <div className="results-content">
        <div className="results-header">
          <h1 className="results-title">{plan.title || t('results.title')}</h1>
          <p className="results-subtitle">
            {isHistoricallySaved ? 'Reviewing your saved strategy.' : t('results.subtitle')}
          </p>
        </div>

        <Stagger className="summary-grid" stagger={0.08}>
          <Stagger.Item className="summary-item">
            <span className="summary-label">{t('results.budget')}</span>
            <span className="summary-value">
              <CountUp
                value={Number(budget)}
                format={(n) => `$${n.toLocaleString(i18n.language === 'es' ? 'es-ES' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              />
            </span>
          </Stagger.Item>
          <Stagger.Item className="summary-item">
            <span className="summary-label">{t('results.timeline')}</span>
            <span className="summary-value">{t(`common.timeline.${timeline}.label`)} ({t(`common.timeline.${timeline}.duration`)})</span>
          </Stagger.Item>
          <Stagger.Item className="summary-item">
            <span className="summary-label">{t('results.riskLevelLabel')}</span>
            <span className={`summary-value risk-${selectedRisk}`}>{t(`results.riskLevel.${selectedRisk}`)}</span>
          </Stagger.Item>
        </Stagger>

        {strategies && strategies.length > 0 && (
          <>
            <AllocationBar strategies={strategies} />
            <Stagger className="strategies-list" stagger={0.1}>
              {strategies.map((s, i) => (
                <StrategyCard key={i} strategy={s} index={i} budget={budget} />
              ))}
            </Stagger>
          </>
        )}

        {disclaimer && (
          <Reveal className="disclaimer-box">
            <span className="disclaimer-icon">!</span>
            <p className="disclaimer-text">{disclaimer}</p>
          </Reveal>
        )}

        <div className="results-actions">
          <motion.button
            type="button"
            className="results-action-btn primary"
            onClick={handleSaveClick}
            disabled={isHistoricallySaved || saveState === 'saving' || saveState === 'saved'}
            whileHover={shouldReduceMotion ? undefined : liftHover}
            whileTap={shouldReduceMotion ? undefined : liftTap}
          >
            {!token
              ? t('results.saveCreateAccount')
              : saveState === 'saving'
                ? t('results.saving')
                : saveState === 'saved'
                  ? t('results.saved')
                  : t('results.savePlan')}
          </motion.button>
          <motion.button
            type="button"
            className="results-action-btn"
            onClick={handleDownloadPdf}
            whileHover={shouldReduceMotion ? undefined : liftHover}
            whileTap={shouldReduceMotion ? undefined : liftTap}
          >
            {t('results.downloadPdf')}
          </motion.button>
        </div>
        {saveState === 'error' && (
          <p className="save-error">{t('results.saveError')}</p>
        )}
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          {isHistoricallySaved ? 'Back to Dashboard' : t('results.adjustPlan')}
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
           <h3>{t('results.namePlanTitle')}</h3>

            <p>{t('results.namePlanDescription')}</p>

           <input
              type="text"
              placeholder={t('results.namePlanPlaceholder')}
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              maxLength={50}
              autoFocus
            />

            <div className="modal-buttons">
              <button
                type="button"
                className="modal-btn-cancel"
                onClick={() => setIsModalOpen(false)}
              >
                {t('results.cancel')}
              </button>

             <button
                type="button"
                className="modal-btn-confirm"
               onClick={handleFinalSaveConfirm}
              >
               {t('results.confirmSave')}
             </button>
            </div>
         </div>
        </div>
    )}
    </div>
  )
}

export default Results