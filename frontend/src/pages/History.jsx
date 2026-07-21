import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, useReducedMotion } from 'motion/react'
import { useAuth } from '../context/useAuth'
import { liftHover, liftTap } from '../lib/motion'
import Stagger from '../components/Stagger'
import './History.css'

function History() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const shouldReduceMotion = useReducedMotion()
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [recommendations, setRecommendations] = useState([])

  const locale = i18n.language === 'es' ? 'es-ES' : 'en-US'

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })
  }

  function formatCurrency(amount) {
    return Number(amount).toLocaleString(locale, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
  }

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const response = await fetch('http://localhost:8080/api/investment/history', {
          headers: { 'Authorization': `Bearer ${token}` },
        })
        if (!response.ok) throw new Error('Failed to load history.')
        const data = await response.json()
        if (!cancelled) {
          setRecommendations(data)
          setStatus('ready')
        }
      } catch {
        if (!cancelled) setStatus('error')
      }
    }

    load()
    return () => { cancelled = true }
  }, [token])

  return (
    <div className="history-page">
      <div className="history-content">
        <div className="history-header">
          <h1 className="history-title">{t('history.title')}</h1>
          <p className="history-subtitle">{t('history.subtitle')}</p>
        </div>

        {/* Skeleton rather than a "Loading..." line: it reserves the real
            layout, so cards don't shove the page around when they land. */}
        {status === 'loading' && (
          <div className="history-list" aria-busy="true" aria-label={t('history.loading')}>
            {[0, 1, 2].map((i) => (
              <div className="history-skeleton" key={i}>
                <div className="history-skeleton-row">
                  <span className="skeleton-bar w-24" />
                  <span className="skeleton-bar w-20" />
                </div>
                <span className="skeleton-bar w-40 tall" />
                <div className="history-skeleton-row">
                  <span className="skeleton-bar w-28" />
                  <span className="skeleton-bar w-28" />
                </div>
              </div>
            ))}
          </div>
        )}
        {status === 'error' && <p className="history-status">{t('history.error')}</p>}

        {status === 'ready' && recommendations.length === 0 && (
          <div className="history-empty">
            <p className="history-status">{t('history.empty')}</p>
            <button className="history-cta" onClick={() => navigate('/dashboard')}>{t('history.createPlan')}</button>
          </div>
        )}

        {status === 'ready' && recommendations.length > 0 && (
          <Stagger className="history-list" stagger={0.06}>
            {recommendations.map((rec) => (
              <Stagger.Item key={rec.id}>
                {/* Saved plans used to be a dead end — you could see that a plan
                    existed but never open it again. Results already renders a
                    full plan from router state, so each card just hands it back.
                    The plan's strategy text stays in the language it was saved
                    in; only the surrounding chrome is translated. */}
                <motion.button
                  type="button"
                  className="history-card"
                  onClick={() => navigate('/results', { state: rec })}
                  whileHover={shouldReduceMotion ? undefined : liftHover}
                  whileTap={shouldReduceMotion ? undefined : liftTap}
                  aria-label={t('history.openPlanAria', { date: formatDate(rec.createdAt), amount: formatCurrency(rec.budget) })}
                >
                  <div className="history-card-top">
                    <span className="history-date">{formatDate(rec.createdAt)}</span>
                    <span className={`history-risk risk-${rec.riskTolerance}`}>
                      {t('history.riskLabel', { level: t(`results.riskLevel.${rec.riskTolerance}`, rec.riskTolerance) })}
                    </span>
                  </div>
                  <div className="history-card-main">
                    <span className="history-budget">{formatCurrency(rec.budget)}</span>
                    <span className="history-timeline">{t(`common.timeline.${rec.timeline}.label`, rec.timeline)}</span>
                  </div>
                  <div className="history-strategies">
                    {rec.strategies.map((s, i) => (
                      <span key={i} className="history-strategy-tag">{s.name} · {s.allocation}%</span>
                    ))}
                  </div>
                  <span className="history-card-open" aria-hidden="true">
                    {t('history.viewPlan')}
                  </span>
                </motion.button>
              </Stagger.Item>
            ))}
          </Stagger>
        )}
      </div>
    </div>
  )
}

export default History
