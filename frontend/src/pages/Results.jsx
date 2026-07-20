import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { TIMELINE_LABELS, RISK_LABELS } from '../lib/labels'
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
  const { token } = useAuth()
  
  // Check if we came from the history page or if the plan object itself already has an ID field
  const isHistoricallySaved = state?.isSavedPlan || !!state?.id

  const [saveState, setSaveState] = useState(isHistoricallySaved ? 'saved' : 'idle') 
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [customTitle, setCustomTitle] = useState('')

  const [plan, setPlan] = useState(() => state || readPendingPlan())

  useEffect(() => {
    if (state) {
      setPlan(state)
      if (state.isSavedPlan || state.id) {
        setSaveState('saved')
      }
      sessionStorage.removeItem(PENDING_PLAN_KEY)
    }
  }, [state])

  if (!plan || !plan.budget) {
    return (
      <div className="results-page">
        <div className="results-empty">
          <h1 className="results-title">No plan found.</h1>
          <p className="results-subtitle">Please fill out the investment form first.</p>
          <button className="back-btn" onClick={() => navigate('/dashboard')}>Go to Form</button>
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
    if (isHistoricallySaved) return // Extra guard safety
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
    
    const now = new Date();
    const finalTitle =
      customTitle.trim() ||
      `Plan - ${now.toLocaleDateString('en-US')}, ${now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      })}`;

    try {
      const response = await fetch('http://localhost:8080/api/investment/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          title: finalTitle,
          isPinned: false,
          budget: plan.budget, 
          timeline: plan.timeline, 
          riskTolerance: plan.riskTolerance || plan.riskLevel, 
          strategies: plan.strategies || [], 
          disclaimer: plan.disclaimer 
        }),
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
          <h1 className="results-title">{plan.title || 'Your Investment Plan'}</h1>
          <p className="results-subtitle">
            {isHistoricallySaved ? 'Reviewing your saved strategy.' : 'Personalized strategies based on your inputs.'}
          </p>
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
            onClick={handleSaveClick}
            disabled={isHistoricallySaved || saveState === 'saving' || saveState === 'saved'}
          >
            {!token
              ? 'Create an account to save'
              : saveState === 'saving'
                ? 'Saving...'
                : saveState === 'saved'
                  ? 'Saved ✓'
                  : 'Save This Plan'}
          </button>
          <button
            type="button"
            className="results-action-btn"
            onClick={handleDownloadPdf}
          >
            Download PDF
          </button>
        </div>
        {saveState === 'error' && (
          <p className="save-error">Couldn't save your plan. Please try again.</p>
        )}
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          {isHistoricallySaved ? 'Back to Dashboard' : 'Adjust My Plan'}
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h3>Name Your Investment Plan</h3>
            <p>Give your plan a title to distinguish it easily on your profile.</p>
            <input
              type="text"
              placeholder="e.g., House Fund, Retirement Fund"
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
                Cancel
              </button>
              <button 
                type="button" 
                className="modal-btn-confirm" 
                onClick={handleFinalSaveConfirm}
              >
                Confirm Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Results