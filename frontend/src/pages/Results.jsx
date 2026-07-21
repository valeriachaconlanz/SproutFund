import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { TIMELINE_LABELS, RISK_LABELS } from '../lib/labels'
import './Results.css'

const COLORS = ['#ccff00', '#7eb8f7', '#f7a07e']

// A logged-out visitor who hits "Save" gets bounced to /auth; we stash their
// built plan here so they land back on it (and can save) after signing up.
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
  return (
    <div className="allocation-wrap">
      <p className="allocation-heading">{t('results.allocation')}</p>
      <div className="allocation-bar">
        {strategies.map((s, i) => (
          <div
            key={i}
            className="allocation-segment"
            style={{ width: `${s.allocation}%`, background: COLORS[i % COLORS.length] }}
            title={`${s.name}: ${s.allocation}%`}
          />
        ))}
      </div>
      <div className="allocation-legend">
        {strategies.map((s, i) => (
          <div key={i} className="legend-item">
            <span className="legend-dot" style={{ background: COLORS[i % COLORS.length] }} />
            <span className="legend-name">{s.name}</span>
            <span className="legend-pct">{s.allocation}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function StrategyCard({ strategy, index, budget }) {
  const { t, i18n } = useTranslation()
  const color = COLORS[index % COLORS.length]
  const dollars = Math.round(budget * strategy.allocation / 100)
  const formatted = dollars.toLocaleString(i18n.language === 'es' ? 'es-ES' : 'en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

  return (
    <div className="strategy-card">
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
        <div className="strategy-fill" style={{ width: `${strategy.allocation}%`, background: color }} />
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
    </div>
  )
}

function Results() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { token } = useAuth()
  const { t, i18n } = useTranslation()
  const [saveState, setSaveState] = useState('idle') // idle | saving | saved | error
  // Prefer a freshly-navigated plan (router state); otherwise fall back to a
  // plan stashed before an auth detour so it survives the round trip.
  const [plan] = useState(() => state || readPendingPlan())

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

  async function handleSave() {
    // Saving requires an account. Stash the plan and send them to sign up;
    // they'll return here (via readPendingPlan) able to save it.
    if (!token) {
      sessionStorage.setItem(PENDING_PLAN_KEY, JSON.stringify(plan))
      navigate('/auth', { state: { from: { pathname: '/results' } } })
      return
    }

    setSaveState('saving')
    try {
      const response = await fetch('http://localhost:8080/api/investment/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ budget, timeline, riskTolerance: selectedRisk, strategies, disclaimer }),
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
          <h1 className="results-title">{t('results.title')}</h1>
          <p className="results-subtitle">{t('results.subtitle')}</p>
        </div>

        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">{t('results.budget')}</span>
            <span className="summary-value">
              ${Number(budget).toLocaleString(i18n.language === 'es' ? 'es-ES' : 'en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">{t('results.timeline')}</span>
            <span className="summary-value">{t(`common.timeline.${timeline}.label`)} ({t(`common.timeline.${timeline}.duration`)})</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">{t('results.riskLevelLabel')}</span>
            <span className={`summary-value risk-${selectedRisk}`}>{t(`results.riskLevel.${selectedRisk}`)}</span>
          </div>
        </div>

        {strategies && strategies.length > 0 && (
          <>
            <AllocationBar strategies={strategies} />
            <div className="strategies-list">
              {strategies.map((s, i) => (
                <StrategyCard key={i} strategy={s} index={i} budget={budget} />
              ))}
            </div>
          </>
        )}

        {disclaimer && (
          <div className="disclaimer-box">
            <span className="disclaimer-icon">!</span>
            <p className="disclaimer-text">{disclaimer}</p>
          </div>
        )}

        <div className="results-actions">
          <button
            type="button"
            className="results-action-btn primary"
            onClick={handleSave}
            disabled={saveState === 'saving' || saveState === 'saved'}
          >
            {!token
              ? t('results.saveCreateAccount')
              : saveState === 'saving'
                ? t('results.saving')
                : saveState === 'saved'
                  ? t('results.saved')
                  : t('results.savePlan')}
          </button>
          <button
            type="button"
            className="results-action-btn"
            onClick={handleDownloadPdf}
          >
            {t('results.downloadPdf')}
          </button>
        </div>
        {saveState === 'error' && (
          <p className="save-error">{t('results.saveError')}</p>
        )}
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          {t('results.adjustPlan')}
        </button>
      </div>
    </div>
  )
}

export default Results