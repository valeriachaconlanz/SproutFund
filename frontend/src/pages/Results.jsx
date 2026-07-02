import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from '../components/ThemeToggle'
import UserMenu from '../components/UserMenu'
import './Results.css'

const TIMELINE_LABELS = {
  short: 'Short Term (Under 1 year)',
  medium: 'Medium Term (1–5 years)',
  long: 'Long Term (5+ years)',
}

const RISK_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

const COLORS = ['#ccff00', '#7eb8f7', '#f7a07e']

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

function ResultsNav() {
  const { user } = useAuth()

  return (
    <nav className="results-nav">
      <span className="results-logo">Sprout<span>Fund</span></span>
      <div className="results-nav-right">
        {user && <span className="results-user">Hi, {user.name.split(' ')[0]}</span>}
        <ThemeToggle />
        <UserMenu />
      </div>
    </nav>
  )
}

function AllocationBar({ strategies }) {
  return (
    <div className="allocation-wrap">
      <p className="allocation-heading">Portfolio allocation</p>
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
  const color = COLORS[index % COLORS.length]
  const dollars = Math.round(budget * strategy.allocation / 100)
  const formatted = dollars.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

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
          <p className="vehicles-heading">Where to invest</p>
          <div className="vehicles-tags">
            {strategy.vehicles.map((v, i) => (
              <span key={i} className="vehicle-tag">{v}</span>
            ))}
          </div>
        </div>
      )}

      {strategy.platform && (
        <div className="strategy-platform">
          <span className="platform-label">Platform</span>
          <span className="platform-value">{strategy.platform}</span>
        </div>
      )}
    </div>
  )
}

function Results() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { addRecommendation } = useAuth()
  const [savedPlanId, setSavedPlanId] = useState(state?.id || null)

  if (!state || !state.budget) {
    return (
      <div className="results-page">
        <ResultsNav />
        <div className="results-empty">
          <h1 className="results-title">No plan found.</h1>
          <p className="results-subtitle">Please fill out the investment form first.</p>
          <button className="back-btn" onClick={() => navigate('/dashboard')}>Go to Form</button>
        </div>
      </div>
    )
  }

  const { budget, timeline, riskTolerance, riskLevel, strategies, disclaimer } = state
  const selectedRisk = riskTolerance || riskLevel
  const timelineLabel = TIMELINE_LABELS[timeline] || timeline
  const riskLabel = RISK_LABELS[selectedRisk] || selectedRisk

  function handleSavePlan() {
    const savedPlan = addRecommendation({
      budget,
      timeline,
      riskTolerance: selectedRisk,
      riskLevel: selectedRisk,
      strategies,
      disclaimer,
    })
    setSavedPlanId(savedPlan.id)
  }

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

  return (
    <div className="results-page">
      <ResultsNav />

      <div className="results-content">
        <div className="results-header">
          <h1 className="results-title">Your Investment Plan</h1>
          <p className="results-subtitle">Personalized strategies based on your inputs.</p>
        </div>

        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">Budget</span>
            <span className="summary-value">
              ${Number(budget).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Timeline</span>
            <span className="summary-value">{timelineLabel}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Risk Level</span>
            <span className={`summary-value risk-${selectedRisk}`}>{riskLabel}</span>
          </div>
        </div>

        <div className="results-actions">
          <button
            type="button"
            className="results-action-btn primary"
            onClick={handleSavePlan}
            disabled={!!savedPlanId}
          >
            {savedPlanId ? 'Plan saved' : 'Save plan'}
          </button>
          <button
            type="button"
            className="results-action-btn"
            onClick={handleDownloadPdf}
          >
            Download PDF
          </button>
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

        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          Adjust My Plan
        </button>
      </div>
    </div>
  )
}

export default Results