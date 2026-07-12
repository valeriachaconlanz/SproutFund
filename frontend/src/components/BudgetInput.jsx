import { useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import './BudgetInput.css'

const TIMELINE_VALUES = ['short', 'medium', 'long']
const RISK_VALUES = ['low', 'medium', 'high']

function getBudgetTier(value, t) {
  const n = Number(value)
  if (!n || n <= 0) return null
  if (n < 1000) return { key: 'starter', range: '$1 – $999', ...t('common.tiers.starter', { returnObjects: true }) }
  if (n < 10000) return { key: 'growing', range: '$1,000 – $9,999', ...t('common.tiers.growing', { returnObjects: true }) }
  return { key: 'established', range: '$10,000+', ...t('common.tiers.established', { returnObjects: true }) }
}

function BudgetInput() {
  const navigate = useNavigate()
  const { token } = useAuth()
  const { t } = useTranslation()
  const fieldRefs = useRef({})
  const toastTimeoutRef = useRef(null)
  const [budget, setBudget] = useState('')
  const [timeline, setTimeline] = useState('')
  const [riskTolerance, setRiskTolerance] = useState('')
  const [errors, setErrors] = useState({})
  const [toastMessage, setToastMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const tier = getBudgetTier(budget, t)

  const timelineOptions = useMemo(
    () => TIMELINE_VALUES.map((value) => ({
      value,
      ...t(`common.timeline.${value}`, { returnObjects: true }),
      ...t(`budgetInput.timelineOptions.${value}`, { returnObjects: true }),
    })),
    [t]
  )

  const riskOptions = useMemo(
    () => RISK_VALUES.map((value) => ({
      value,
      ...t(`budgetInput.riskOptions.${value}`, { returnObjects: true }),
    })),
    [t]
  )

  function showErrorToast(message) {
    setToastMessage(message)
    window.clearTimeout(toastTimeoutRef.current)
    toastTimeoutRef.current = window.setTimeout(() => setToastMessage(''), 4500)
  }

  function scrollToFirstError(validationErrors) {
    const firstErrorKey = ['budget', 'timeline', 'riskTolerance'].find((key) => validationErrors[key])
    if (!firstErrorKey) return

    requestAnimationFrame(() => {
      fieldRefs.current[firstErrorKey]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    })
  }

  function validate() {
    const newErrors = {}
    if (!budget || budget.trim() === '') {
      newErrors.budget = t('budgetInput.errors.budgetRequired')
    } else if (isNaN(Number(budget)) || Number(budget) <= 0) {
      newErrors.budget = t('budgetInput.errors.budgetInvalid')
    }
    if (!timeline) {
      newErrors.timeline = t('budgetInput.errors.timelineRequired')
    }
    if (!riskTolerance) {
      newErrors.riskTolerance = t('budgetInput.errors.riskRequired')
    }
    return newErrors
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      scrollToFirstError(validationErrors)
      showErrorToast(Object.values(validationErrors)[0])
      return
    }

    setErrors({})
    setToastMessage('')
    setIsSubmitting(true)

    const payload = { budget: Number(budget), timeline, riskTolerance }

    try {
      // Building a plan is public — only attach the token when logged in
      // (a logged-out visitor taking the survey has none).
      const headers = { 'Content-Type': 'application/json' }
      if (token) headers.Authorization = `Bearer ${token}`

      const response = await fetch('http://localhost:8080/api/investment', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        throw new Error('Investment recommendation request failed.')
      }
      const data = await response.json()
      navigate('/results', { state: { ...payload, strategies: data.strategies, disclaimer: data.disclaimer } })
    } catch {
      showErrorToast(t('budgetInput.errors.submitFailed'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page-content">

      {/* ── Hero ── */}
      <section className="hero-section">
        <span className="hero-badge">{t('common.builtForBeginners')}</span>
        <h1 className="hero-title">{t('budgetInput.heroTitleLine1')}<br />{t('budgetInput.heroTitleLine2')}</h1>
        <p className="hero-sub">
          {t('budgetInput.heroSub')}
        </p>
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="stat-value">$1</span>
            <span className="stat-label">{t('budgetInput.statMinimum')}</span>
          </div>
          <div className="stat-divider" />
          <div className="hero-stat">
            <span className="stat-value">{t('budgetInput.statTimeValue')}</span>
            <span className="stat-label">{t('budgetInput.statTime')}</span>
          </div>
          <div className="stat-divider" />
          <div className="hero-stat">
            <span className="stat-value">100%</span>
            <span className="stat-label">{t('budgetInput.statPersonalized')}</span>
          </div>
        </div>
      </section>

      {/* ── Why invest ── */}
      <section className="why-section">
        <h2 className="section-heading">{t('budgetInput.whyTitle')}</h2>
        <div className="why-cards">
          <div className="why-card">
            <span className="why-icon">↑</span>
            <h3 className="why-title">{t('budgetInput.why1Title')}</h3>
            <p className="why-desc">
              <Trans i18nKey="budgetInput.why1Desc" components={{ 1: <Link to="/glossary#term-inflation" className="glossary-inline-link" /> }} />
            </p>
          </div>
          <div className="why-card">
            <span className="why-icon">◷</span>
            <h3 className="why-title">{t('budgetInput.why2Title')}</h3>
            <p className="why-desc">
              {t('budgetInput.why2Desc')}
            </p>
          </div>
          <div className="why-card">
            <span className="why-icon">◎</span>
            <h3 className="why-title">{t('budgetInput.why3Title')}</h3>
            <p className="why-desc">
              {t('budgetInput.why3Desc')}
            </p>
          </div>
        </div>
      </section>

      {/* ── Form ── */}
      <form className="investment-form" onSubmit={handleSubmit} noValidate>

        {/* Step 1 */}
        <section className="form-step" ref={(node) => { fieldRefs.current.budget = node }}>
          <div className="step-header">
            <span className="step-number">01</span>
            <div>
              <h2 className="step-title">{t('budgetInput.step1Title')}</h2>
              <p className="step-desc">{t('budgetInput.step1Desc')}</p>
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
            <p className="guide-heading">{t('budgetInput.guideHeading')}</p>
            <div className="guide-rows">
              <div className={`guide-row ${tier?.key === 'starter' ? 'guide-active' : ''}`}>
                <span className="guide-range">$1 – $999</span>
                <span className="guide-tier">{t('common.tiers.starter.label')}</span>
                <span className="guide-note">
                  <Trans
                    i18nKey="budgetInput.guideNotes.starter"
                    components={{
                      1: <Link to="/glossary#term-high-yield-savings-account" className="glossary-inline-link" />,
                      2: <Link to="/glossary#term-cds" className="glossary-inline-link" />,
                    }}
                  />
                </span>
              </div>
              <div className={`guide-row ${tier?.key === 'growing' ? 'guide-active' : ''}`}>
                <span className="guide-range">$1,000 – $9,999</span>
                <span className="guide-tier">{t('common.tiers.growing.label')}</span>
                <span className="guide-note">
                  <Trans
                    i18nKey="budgetInput.guideNotes.growing"
                    components={{
                      1: <Link to="/glossary#term-index-fund" className="glossary-inline-link" />,
                      2: <Link to="/glossary#term-etf" className="glossary-inline-link" />,
                    }}
                  />
                </span>
              </div>
              <div className={`guide-row ${tier?.key === 'established' ? 'guide-active' : ''}`}>
                <span className="guide-range">$10,000+</span>
                <span className="guide-tier">{t('common.tiers.established.label')}</span>
                <span className="guide-note">
                  <Trans
                    i18nKey="budgetInput.guideNotes.established"
                    components={{
                      1: <Link to="/glossary#term-portfolio" className="glossary-inline-link" />,
                      2: <Link to="/glossary#term-bonds" className="glossary-inline-link" />,
                    }}
                  />
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Step 2 */}
        <section className="form-step" ref={(node) => { fieldRefs.current.timeline = node }}>
          <div className="step-header">
            <span className="step-number">02</span>
            <div>
              <h2 className="step-title">{t('budgetInput.step2Title')}</h2>
              <p className="step-desc">{t('budgetInput.step2Desc')}</p>
            </div>
          </div>

          <div className="timeline-cards">
            {timelineOptions.map((opt) => (
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
                <p className="timeline-best-for">{t('budgetInput.bestForPrefix')} {opt.bestFor}</p>
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
        <section className="form-step" ref={(node) => { fieldRefs.current.riskTolerance = node }}>
          <div className="step-header">
            <span className="step-number">03</span>
            <div>
              <h2 className="step-title">{t('budgetInput.step3Title')}</h2>
              <p className="step-desc">{t('budgetInput.step3Desc')}</p>
            </div>
          </div>

          <div className="timeline-cards">
            {riskOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`timeline-card ${riskTolerance === opt.value ? 'selected' : ''}`}
                onClick={() => setRiskTolerance(opt.value)}
              >
                <div className="timeline-card-top">
                  <div>
                    <span className="timeline-label">{opt.label}</span>
                  </div>
                  <span className={`timeline-dot ${riskTolerance === opt.value ? 'dot-active' : ''}`} />
                </div>
                <p className="timeline-best-for">{opt.description}</p>
              </button>
            ))}
          </div>
          {errors.riskTolerance && <p className="error-message">{errors.riskTolerance}</p>}
        </section>

        <div className="section-divider" />

        {/* What you get */}
        <section className="outcomes-section">
          <h2 className="section-heading">{t('budgetInput.outcomesTitle')}</h2>
          <div className="outcomes-list">
            {t('budgetInput.outcomes', { returnObjects: true }).map((outcome) => (
              <div className="outcome-item" key={outcome.title}>
                <span className="outcome-marker">→</span>
                <div>
                  <p className="outcome-title">{outcome.title}</p>
                  <p className="outcome-desc">{outcome.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? t('budgetInput.analyzing') : t('budgetInput.submit')}
        </button>
        <p className="submit-footnote">{t('budgetInput.footnote')}</p>
      </form>

      {toastMessage && (
        <div className="error-toast" role="alert" aria-live="assertive">
          <span className="error-toast-title">{t('budgetInput.toastTitle')}</span>
          <span className="error-toast-message">{toastMessage}</span>
        </div>
      )}
    </div>
  )

}

export default BudgetInput
