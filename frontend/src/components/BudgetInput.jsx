import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './BudgetInput.css'

const TIMELINE_OPTIONS = [
  {
    value: 'short',
    label: 'Short Term',
    duration: 'Under 1 year',
    bestFor: 'Emergency funds, planned purchases, or testing the waters',
    strategies: ['High-yield savings accounts', 'Money market funds', 'Short-term CDs', 'Treasury bills'],
    tradeoff: 'Lower risk, lower return. Stability is the priority.',
  },
  {
    value: 'medium',
    label: 'Medium Term',
    duration: '1–5 years',
    bestFor: 'Building wealth steadily while keeping some flexibility',
    strategies: ['Index funds', 'Balanced ETFs', 'Mutual funds', 'Dividend stocks'],
    tradeoff: 'Moderate risk, moderate return. A balanced approach.',
  },
  {
    value: 'long',
    label: 'Long Term',
    duration: '5+ years',
    bestFor: 'Retirement, wealth building, or major life goals',
    strategies: ['Growth stocks', 'International funds', 'Real estate (REITs)', 'S&P 500 index funds'],
    tradeoff: 'Higher risk, higher potential return. Time smooths out volatility.',
  },
]
// Risk selection

const RISK_OPTIONS = [
  {
    // Low Risk

    value: 'low',
    label: 'Low Risk',
    description: 'Safer investments with lower potential returns. Best for protecting your money.',
  },
  {
    // Medium Risk

    value: 'medium',    
    label: 'Medium Risk',
    description: 'Balanced approach with moderate growth and moderate ups and downs.',
  },
  {
    // High Risk

    value: 'high',
    label: 'High Risk',
    description: 'Higher potential returns, but also higher chance of losses and volatility.',
  },
]

function getBudgetTier(value) {
  const n = Number(value)
  if (!n || n <= 0) return null
  if (n < 1000) return { label: 'Starter', range: '$1 – $999', desc: 'Great for learning the basics and building the habit.' }
  if (n < 10000) return { label: 'Growing', range: '$1,000 – $9,999', desc: 'Enough to diversify across multiple investment types.' }
  return { label: 'Established', range: '$10,000+', desc: 'Access to a full portfolio strategy with meaningful diversification.' }
}

function BudgetInput() {
  const navigate = useNavigate()
  const [budget, setBudget] = useState('')
  const [timeline, setTimeline] = useState('')
  const [riskLevel, setRiskLevel] = useState('')
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const tier = getBudgetTier(budget)

  function validate() {
    const newErrors = {}
    if (!budget || budget.trim() === '') {
      newErrors.budget = 'Please enter an investment amount.'
    } else if (isNaN(Number(budget)) || Number(budget) <= 0) {
      newErrors.budget = 'Please enter a valid positive dollar amount.'
    }
    if (!timeline) {
      newErrors.timeline = 'Please select a timeline before submitting.'
    }
    if (!riskLevel) {
      newErrors.riskLevel = 'Please select a risk level before submitting.'
    }
    return newErrors
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)

    const payload = { budget: Number(budget), timeline, riskLevel }

    try {
      const response = await fetch('http://localhost:8080/api/investment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      navigate('/results', { state: { ...payload, recommendation: data.recommendation } })
    } catch {
      navigate('/results', { state: payload })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page-content">

      {/* ── Hero ── */}
      <section className="hero-section">
        <span className="hero-badge">Built for first-time investors</span>
        <h1 className="hero-title">Start Your<br />Investment Journey</h1>
        <p className="hero-sub">
          Tell us your budget and timeline — we'll match you with strategies designed
          for exactly where you are right now.
        </p>
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="stat-value">$1</span>
            <span className="stat-label">Minimum to start</span>
          </div>
          <div className="stat-divider" />
          <div className="hero-stat">
            <span className="stat-value">2 min</span>
            <span className="stat-label">To get your plan</span>
          </div>
          <div className="stat-divider" />
          <div className="hero-stat">
            <span className="stat-value">100%</span>
            <span className="stat-label">Personalized</span>
          </div>
        </div>
      </section>

      {/* ── Why invest ── */}
      <section className="why-section">
        <h2 className="section-heading">Why start investing now?</h2>
        <div className="why-cards">
          <div className="why-card">
            <span className="why-icon">↑</span>
            <h3 className="why-title">Beat Inflation</h3>
            <p className="why-desc">
              Savings accounts earn 0.5–1% APY while inflation averages 3–4% per year.
              Investing is how your money keeps its value over time.
            </p>
          </div>
          <div className="why-card">
            <span className="why-icon">◷</span>
            <h3 className="why-title">Time Is Your Edge</h3>
            <p className="why-desc">
              $5,000 invested at age 25 grows to ~$70,000 by 65 (7% avg return).
              The same amount at 45 only reaches ~$22,000. Starting early matters.
            </p>
          </div>
          <div className="why-card">
            <span className="why-icon">◎</span>
            <h3 className="why-title">Start Small, Think Big</h3>
            <p className="why-desc">
              Many strategies work with as little as $100. The habit of investing
              consistently matters more than the initial amount.
            </p>
          </div>
        </div>
      </section>

      {/* ── Form ── */}
      <form className="investment-form" onSubmit={handleSubmit} noValidate>

        {/* Step 1 */}
        <section className="form-step">
          <div className="step-header">
            <span className="step-number">01</span>
            <div>
              <h2 className="step-title">How much do you want to invest?</h2>
              <p className="step-desc">Enter the amount you're comfortable committing. You can always adjust later.</p>
            </div>
          </div>

          <div className={`input-wrapper ${errors.budget ? 'has-error' : ''}`}>
            <span className="currency-symbol">$</span>
            <input
              id="budget"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              className="budget-field"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
          {errors.budget && <p className="error-message">{errors.budget}</p>}

          {tier && (
            <div className="tier-callout">
              <div className="tier-header">
                <span className="tier-badge">{tier.label}</span>
                <span className="tier-range">{tier.range}</span>
              </div>
              <p className="tier-desc">{tier.desc}</p>
            </div>
          )}

          <div className="budget-guide">
            <p className="guide-heading">Budget ranges at a glance</p>
            <div className="guide-rows">
              <div className={`guide-row ${tier?.label === 'Starter' ? 'guide-active' : ''}`}>
                <span className="guide-range">$1 – $999</span>
                <span className="guide-tier">Starter</span>
                <span className="guide-note">High-yield savings, CDs, money market</span>
              </div>
              <div className={`guide-row ${tier?.label === 'Growing' ? 'guide-active' : ''}`}>
                <span className="guide-range">$1,000 – $9,999</span>
                <span className="guide-tier">Growing</span>
                <span className="guide-note">Index funds, ETFs, mutual funds</span>
              </div>
              <div className={`guide-row ${tier?.label === 'Established' ? 'guide-active' : ''}`}>
                <span className="guide-range">$10,000+</span>
                <span className="guide-tier">Established</span>
                <span className="guide-note">Diversified portfolio, bonds, growth stocks</span>
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Step 2 */}
        <section className="form-step">
          <div className="step-header">
            <span className="step-number">02</span>
            <div>
              <h2 className="step-title">When do you want to see returns?</h2>
              <p className="step-desc">Your timeline determines which strategies are realistic and appropriate for you.</p>
            </div>
          </div>

          <div className="timeline-cards">
            {TIMELINE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`timeline-card ${timeline === opt.value ? 'selected' : ''}`}
                onClick={() => setTimeline(opt.value)}
              >
                <div className="timeline-card-top">
                  <div>
                    <span className="timeline-label">{opt.label}</span>
                    <span className="timeline-duration">{opt.duration}</span>
                  </div>
                  <span className={`timeline-dot ${timeline === opt.value ? 'dot-active' : ''}`} />
                </div>
                <p className="timeline-best-for">Best for: {opt.bestFor}</p>
                <ul className="timeline-strategies">
                  {opt.strategies.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <p className="timeline-tradeoff">{opt.tradeoff}</p>
              </button>
            ))}
          </div>
          {errors.timeline && <p className="error-message">{errors.timeline}</p>}
        </section>

        <div className="section-divider" />

        {/* Risk tolerance selection  */}
        <section className="form-step">
          <div className="step-header">
            <span className="step-number">03</span>
            <div>
              <h2 className="step-title">How much risk are you comfortable with?</h2>
              <p className="step-desc">Choose the level of risk that feels right for your money and goals.</p>
            </div>
          </div>

          <div className="timeline-cards">
            {RISK_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`timeline-card ${riskLevel === opt.value ? 'selected' : ''}`}
                onClick={() => setRiskLevel(opt.value)}
              >
                <div className="timeline-card-top">
                  <div>
                    <span className="timeline-label">{opt.label}</span>
                  </div>
                  <span className={`timeline-dot ${riskLevel === opt.value ? 'dot-active' : ''}`} />
                </div>
                <p className="timeline-best-for">{opt.description}</p>
              </button>
            ))}
          </div>
          {errors.riskLevel && <p className="error-message">{errors.riskLevel}</p>}
        </section>

        <div className="section-divider" />

        {/* What you get */}
        <section className="outcomes-section">
          <h2 className="section-heading">What you'll receive</h2>
          <div className="outcomes-list">
            <div className="outcome-item">
              <span className="outcome-marker">→</span>
              <div>
                <p className="outcome-title">A strategy matched to your budget</p>
                <p className="outcome-desc">We surface options that actually make sense at your investment level — no generic advice.</p>
              </div>
            </div>
            <div className="outcome-item">
              <span className="outcome-marker">→</span>
              <div>
                <p className="outcome-title">Timeline-appropriate recommendations</p>
                <p className="outcome-desc">Short-term and long-term goals require completely different strategies. We'll align them correctly.</p>
              </div>
            </div>
            <div className="outcome-item">
              <span className="outcome-marker">→</span>
              <div>
                <p className="outcome-title">Plain-language explanations</p>
                <p className="outcome-desc">No jargon. Every recommendation comes with a clear explanation of what it is and why it fits you.</p>
              </div>
            </div>
          </div>
        </section>

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Analyzing...' : 'Get My Investment Plan →'}
        </button>
        <p className="submit-footnote">No account required · Free to use · Results in seconds</p>
      </form>
    </div>
  )

}

export default BudgetInput
