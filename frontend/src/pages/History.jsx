import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { TIMELINE_LABELS, RISK_LABELS } from '../lib/labels'
import './History.css'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatCurrency(amount) {
  return Number(amount).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

function History() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [recommendations, setRecommendations] = useState([])

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
          <h1 className="history-title">Saved Plans</h1>
          <p className="history-subtitle">Investment plans you've saved for later.</p>
        </div>

        {status === 'loading' && <p className="history-status">Loading...</p>}
        {status === 'error' && <p className="history-status">Couldn't load your saved plans. Please try again.</p>}

        {status === 'ready' && recommendations.length === 0 && (
          <div className="history-empty">
            <p className="history-status">You haven't saved any plans yet.</p>
            <button className="history-cta" onClick={() => navigate('/dashboard')}>Create a Plan</button>
          </div>
        )}

        {status === 'ready' && recommendations.length > 0 && (
          <div className="history-list">
            {recommendations.map((rec) => (
              <div key={rec.id} className="history-card">
                <div className="history-card-top">
                  <span className="history-date">{formatDate(rec.createdAt)}</span>
                  <span className={`history-risk risk-${rec.riskTolerance}`}>
                    {RISK_LABELS[rec.riskTolerance] || rec.riskTolerance} Risk
                  </span>
                </div>
                <div className="history-card-main">
                  <span className="history-budget">{formatCurrency(rec.budget)}</span>
                  <span className="history-timeline">{TIMELINE_LABELS[rec.timeline] || rec.timeline}</span>
                </div>
                <div className="history-strategies">
                  {rec.strategies.map((s, i) => (
                    <span key={i} className="history-strategy-tag">{s.name} · {s.allocation}%</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default History
