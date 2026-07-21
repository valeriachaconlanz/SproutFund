import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { TIMELINE_LABELS, RISK_LABELS } from '../lib/labels'
import './History.css'

const API = 'http://localhost:8080/api/investment'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatCurrency(amount) {
  return Number(amount).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

function History() {
  const navigate = useNavigate()
  const { token } = useAuth()

  const [recommendations, setRecommendations] = useState([])
  const [editingPlanId, setEditingPlanId] = useState(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [pendingDeleteId, setPendingDeleteId] = useState(null)
  const [status, setStatus] = useState('loading')

  function getPlanTitle(rec, index) {
    return rec.title || `Investment Plan #${index + 1}`
  }

  async function handleTogglePin(id) {
    setRecommendations((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, isPinned: !rec.isPinned } : rec))
    )

    try {
      const targetPlan = recommendations.find((rec) => rec.id === id)
      const newPinnedState = !targetPlan?.isPinned

      const response = await fetch(`${API}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isPinned: newPinnedState }),
      })

      if (!response.ok) throw new Error('Failed to update pinned status on server.')
    } catch (err) {
      console.error(err)
      setRecommendations((prev) =>
        prev.map((rec) => (rec.id === id ? { ...rec, isPinned: !rec.isPinned } : rec))
      )
    }
  }

  function handleStartRename(rec, originalIndex) {
    setEditingPlanId(rec.id)
    setEditingTitle(rec.title || getPlanTitle(rec, originalIndex))
  }

  function handleCancelRename() {
    setEditingPlanId(null)
    setEditingTitle('')
  }

  async function handleSaveRename(id) {
    const title = editingTitle.trim()
    if (!title) {
      handleCancelRename()
      return
    }

    const previousTitle = recommendations.find((rec) => rec.id === id)?.title || ''

    setRecommendations((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, title } : rec))
    )

    handleCancelRename()

    try {
      const response = await fetch(`${API}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      })

      if (!response.ok) throw new Error('Rename failed.')

      const updated = await response.json()
      setRecommendations((prev) =>
        prev.map((rec) =>
          rec.id === id ? { ...rec, ...updated, title: updated.title || title } : rec
        )
      )
    } catch (err) {
      console.error(err)
      setRecommendations((prev) =>
        prev.map((rec) => (rec.id === id ? { ...rec, title: previousTitle } : rec))
      )
    }
  }

  function handleRequestDelete(id) {
    setPendingDeleteId(id)
  }

  async function handleConfirmDelete(id) {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error('Failed to delete.')
      setRecommendations((prev) => prev.filter((rec) => rec.id !== id))
    } catch (err) {
      console.error(err)
      alert('Could not delete the plan. Please try again.')
    } finally {
      setPendingDeleteId(null)
    }
  }

  function handleViewRecommendation(rec) {
    navigate('/results', { state: rec })
  }

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') setPendingDeleteId(null)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const response = await fetch(`${API}/history`, {
          headers: { Authorization: `Bearer ${token}` },
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

    if (token) load()
    return () => { cancelled = true }
  }, [token])

  const sortedRecommendations = [...recommendations].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return 0
  })

  const pendingDeletePlan = recommendations.find((rec) => rec.id === pendingDeleteId)
  const pendingDeleteIndex = recommendations.findIndex((rec) => rec.id === pendingDeleteId)

  if (status === 'loading') {
    return <div className="history-status">Loading history...</div>
  }

  if (status === 'error') {
    return <div className="history-status error">Failed to load investment history.</div>
  }

  return (
    <main className="history-page">
      <div className="history-content">
        <div className="history-header">
          <h1 className="history-title">Saved Plans</h1>
          <p className="history-subtitle">
            Investment plans you've saved for later.
          </p>
        </div>

        <div className="recommendations-list">
          <AnimatePresence mode="popLayout">
            {sortedRecommendations.length > 0 ? (
              sortedRecommendations.map((rec) => {
                const isEditing = editingPlanId === rec.id
                
                // Track item index relative to the stable chronological array state
                const originalIndex = recommendations.findIndex((r) => r.id === rec.id)

                return (
                  <motion.article 
                    key={rec.id}
                    layout 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 38
                    }}
                    className={`recommendation-item ${rec.isPinned ? 'is-pinned' : ''}`}
                  >
                    <div className="rec-header">
                      <div className="rec-title-group">
                        <button 
                          className={`pin-btn ${rec.isPinned ? 'pinned' : ''}`}
                          onClick={() => handleTogglePin(rec.id)}
                          aria-label={rec.isPinned ? "Unpin plan" : "Pin plan"}
                        >
                          ★
                        </button>

                        {isEditing ? (
                          <input
                            className="rec-title-input"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveRename(rec.id)
                              if (e.key === 'Escape') handleCancelRename()
                            }}
                            autoFocus
                          />
                        ) : (
                          <h3>{getPlanTitle(rec, originalIndex)}</h3>
                        )}
                      </div>

                      <span>{formatDate(rec.createdAt)}</span>
                    </div>

                    <div className="rec-metrics">
                      <span>{formatCurrency(rec.budget)}</span>
                      <span>{TIMELINE_LABELS[rec.timeline] || rec.timeline}</span>
                      <span className={`risk-badge risk-${rec.riskTolerance?.toLowerCase()}`}>
                        {RISK_LABELS[rec.riskTolerance] || rec.riskTolerance} Risk
                      </span>
                    </div>

                    <div className="history-strategies">
                      {rec.strategies?.map((s, i) => (
                        <span key={i} className="history-strategy-tag">
                          {s.name} · {s.allocation}%
                        </span>
                      ))}
                    </div>

                    <div className="rec-actions">
                      {isEditing ? (
                        <>
                          <button className="rec-action-btn" onClick={() => handleSaveRename(rec.id)}>Save</button>
                          <button className="rec-action-btn" onClick={handleCancelRename}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button className="rec-action-btn" onClick={() => handleViewRecommendation(rec)}>View</button>
                          <button className="rec-action-btn" onClick={() => handleStartRename(rec, originalIndex)}>Rename</button>
                          <button className="rec-action-btn danger" onClick={() => handleRequestDelete(rec.id)}>Delete</button>
                        </>
                      )}
                    </div>
                  </motion.article>
                )
              })
            ) : (
              <p className="recommendations-empty">No saved plans yet.</p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {pendingDeletePlan && (
        <div
          className="delete-modal-backdrop"
          role="presentation"
          onClick={() => setPendingDeleteId(null)}
        >
          <div
            className="delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-modal-icon">!</div>
            <p className="profile-label">Delete saved plan</p>
            <h2 id="delete-modal-title">Are you sure?</h2>
            <p className="delete-modal-copy">
              This will permanently delete "{getPlanTitle(pendingDeletePlan, pendingDeleteIndex)}".
              You will not be able to recover it later.
            </p>

            <div className="delete-modal-actions">
              <button type="button" className="delete-modal-btn secondary" onClick={() => setPendingDeleteId(null)}>Keep plan</button>
              <button type="button" className="delete-modal-btn danger" onClick={() => handleConfirmDelete(pendingDeletePlan.id)}>Delete plan</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default History