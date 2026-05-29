import { useLocation, useNavigate } from 'react-router-dom'
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

function Results() {
  const { state } = useLocation()
  const navigate = useNavigate()

  if (!state || !state.budget) {
    return (
      <div className="results-page">
        <nav className="results-nav">
          <span className="results-logo">Sprout<span>Fund</span></span>
        </nav>
        <div className="results-card">
          <h1 className="results-title">No data found.</h1>
          <p className="results-subtitle">Please fill out the investment form first.</p>
          <button className="back-btn" onClick={() => navigate('/')}>
            Go to Form
          </button>
        </div>
      </div>
    )
  }

  const { budget, timeline, riskTolerance, riskLevel, recommendation } = state
  const selectedRisk = riskTolerance || riskLevel

  return (
    <div className="results-page">
      <nav className="results-nav">
        <span className="results-logo">Sprout<span>Fund</span></span>
      </nav>

      <div className="results-card">
        <h1 className="results-title">Your Investment Plan</h1>
        <p className="results-subtitle">Based on your inputs, here's what we recommend.</p>

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

        {recommendation && (
          <div className="recommendation-box">
            <p className="rec-title">Recommendation</p>
            <p className="rec-text">{recommendation}</p>
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
