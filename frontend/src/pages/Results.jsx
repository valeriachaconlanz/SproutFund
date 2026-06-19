import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from '../components/ThemeToggle'
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

  if (!state || !state.budget) {
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

  const { budget, timeline, riskTolerance, riskLevel, strategies, disclaimer } = state
  const selectedRisk = riskTolerance || riskLevel

  return (
    <div className="results-page">

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
            <span className="summary-value">{TIMELINE_LABELS[timeline]}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Risk Level</span>
            <span className={`summary-value risk-${selectedRisk}`}>{RISK_LABELS[selectedRisk]}</span>
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

        <button className="back-btn" onClick={() => navigate('/')}>
          Adjust My Plan
        </button>
      </div>
    </div>
  )
}

export default Results
