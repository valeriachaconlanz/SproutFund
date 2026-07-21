import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import './History.css'

const API = 'http://localhost:8080/api/investment'

function formatDate(iso, language) {
  return new Date(iso).toLocaleDateString(
    language === 'es' ? 'es-ES' : 'en-US',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }
  )
}

function formatCurrency(amount, language) {
  return Number(amount).toLocaleString(
    language === 'es' ? 'es-ES' : 'en-US',
    {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }
  )
}

function History() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { token } = useAuth()

  const [recommendations, setRecommendations] = useState([])
  const [editingPlanId, setEditingPlanId] = useState(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [pendingDeleteId, setPendingDeleteId] = useState(null)
  const [status, setStatus] = useState('loading')

  function getPlanTitle(rec, index) {
    return rec.title || `${t('history.defaultPlanTitle')} #${index + 1}`
  }

  async function handleTogglePin(id) {
    const currentPlan = recommendations.find((rec) => rec.id === id)
    if (!currentPlan) return

    const newPinnedState = !currentPlan.isPinned

    setRecommendations((prev) =>
      prev.map((rec) =>
        rec.id === id
          ? { ...rec, isPinned: newPinnedState }
          : rec
      )
    )

    try {
      const response = await fetch(`${API}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isPinned: newPinnedState,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update pin')
      }
    } catch (err) {
      console.error(err)

      setRecommendations((prev) =>
        prev.map((rec) =>
          rec.id === id
            ? { ...rec, isPinned: !newPinnedState }
            : rec
        )
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

    const previousTitle =
      recommendations.find((rec) => rec.id === id)?.title || ''

    setRecommendations((prev) =>
      prev.map((rec) =>
        rec.id === id ? { ...rec, title } : rec
      )
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
          rec.id === id
            ? { ...rec, ...updated, title: updated.title || title }
            : rec
        )
      )
    } catch (err) {
      console.error(err)

      setRecommendations((prev) =>
        prev.map((rec) =>
          rec.id === id
            ? { ...rec, title: previousTitle }
            : rec
        )
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

      setRecommendations((prev) =>
        prev.filter((rec) => rec.id !== id)
      )
    } catch (err) {
      console.error(err)
      alert(t('history.deleteError'))
    } finally {
      setPendingDeleteId(null)
    }
  }

    function handleViewRecommendation(rec) {
    navigate('/results', { state: { ...rec, isSavedPlan: true } })
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

    return () => {
      cancelled = true
    }
  }, [token])

  const sortedRecommendations = [...recommendations].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return 0
  })

  const pendingDeletePlan = recommendations.find(
    (rec) => rec.id === pendingDeleteId
  )

  const pendingDeleteIndex = recommendations.findIndex(
    (rec) => rec.id === pendingDeleteId
  )

  if (status === 'loading') {
    return (
      <div className="history-status">
        {t('history.loading')}
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="history-status error">
        {t('history.error')}
      </div>
    )
  }

  return (
    <main className="history-page">
      <div className="history-content">
        <div className="history-header">
          <h1 className="history-title">
            {t('history.title')}
          </h1>

          <p className="history-subtitle">
            {t('history.subtitle')}
          </p>
        </div>

        <div className="recommendations-list">
          <AnimatePresence mode="popLayout">
            {sortedRecommendations.length > 0 ? (
              sortedRecommendations.map((rec) => {
                const isEditing = editingPlanId === rec.id
                const originalIndex = recommendations.findIndex(
                  (r) => r.id === rec.id
                )

                return (
                  <motion.article
                    key={rec.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 38,
                    }}
                    className={`recommendation-item ${
                      rec.isPinned ? 'is-pinned' : ''
                    }`}
                  >
                    <div className="rec-header">
                      <div className="rec-title-group">
                        <button
                          className={`pin-btn ${
                            rec.isPinned ? 'pinned' : ''
                          }`}
                          onClick={() => handleTogglePin(rec.id)}
                          aria-label={
                            rec.isPinned
                              ? t('history.unpin')
                              : t('history.pin')
                          }
                        >
                          ★
                        </button>

                        {isEditing ? (
                          <input
                            className="rec-title-input"
                            value={editingTitle}
                            onChange={(e) =>
                              setEditingTitle(e.target.value)
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSaveRename(rec.id)
                              }

                              if (e.key === 'Escape') {
                                handleCancelRename()
                              }
                            }}
                            autoFocus
                          />
                        ) : (
                          <h3>
                            {getPlanTitle(rec, originalIndex)}
                          </h3>
                        )}
                      </div>

                      <span>
                        {formatDate(
                          rec.createdAt,
                          i18n.language
                        )}
                      </span>
                    </div>

                    <div className="rec-metrics">
                      <span>
                        {formatCurrency(
                          rec.budget,
                          i18n.language
                        )}
                      </span>

                      <span>
                        {t(
                          `common.timeline.${rec.timeline}.label`,
                          rec.timeline
                        )}
                      </span>

                      <span
                        className={`risk-badge risk-${rec.riskTolerance?.toLowerCase()}`}
                      >
                        {t(
                          `results.riskLevel.${rec.riskTolerance?.toLowerCase()}`,
                          rec.riskTolerance
                        )}{' '}
                        {t('history.risk')}
                      </span>
                    </div>

                    <div className="history-strategies">
                      {rec.strategies?.map((s, i) => (
                        <span
                          key={i}
                          className="history-strategy-tag"
                        >
                          {s.name} · {s.allocation}%
                        </span>
                      ))}
                    </div>

                    <div className="rec-actions">
                      {isEditing ? (
                        <>
                          <button
                            className="rec-action-btn"
                            onClick={() =>
                              handleSaveRename(rec.id)
                            }
                          >
                            {t('common.save')}
                          </button>

                          <button
                            className="rec-action-btn"
                            onClick={handleCancelRename}
                          >
                            {t('common.cancel')}
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="rec-action-btn"
                            onClick={() =>
                              handleViewRecommendation(rec)
                            }
                          >
                            {t('history.view')}
                          </button>

                          <button
                            className="rec-action-btn"
                            onClick={() =>
                              handleStartRename(
                                rec,
                                originalIndex
                              )
                            }
                          >
                            {t('history.rename')}
                          </button>

                          <button
                            className="rec-action-btn danger"
                            onClick={() =>
                              handleRequestDelete(rec.id)
                            }
                          >
                            {t('history.delete')}
                          </button>
                        </>
                      )}
                    </div>
                  </motion.article>
                )
              })
            ) : (
              <p className="recommendations-empty">
                {t('history.empty')}
              </p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {pendingDeletePlan && (
        <div
          className="delete-modal-backdrop"
          onClick={() => setPendingDeleteId(null)}
        >
          <div
            className="delete-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-modal-icon">
              !
            </div>

            <p className="profile-label">
              {t('history.deleteLabel')}
            </p>

            <h2>
              {t('history.deleteModalTitle')}
            </h2>

            <p className="delete-modal-copy">
              {t('history.deleteModalCopy', {
                title: getPlanTitle(
                  pendingDeletePlan,
                  pendingDeleteIndex
                ),
              })}
            </p>

            <div className="delete-modal-actions">
              <button
                className="delete-modal-btn secondary"
                onClick={() => setPendingDeleteId(null)}
              >
                {t('history.keepPlan')}
              </button>

              <button
                className="delete-modal-btn danger"
                onClick={() =>
                  handleConfirmDelete(
                    pendingDeletePlan.id
                  )
                }
              >
                {t('history.deletePlan')}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default History