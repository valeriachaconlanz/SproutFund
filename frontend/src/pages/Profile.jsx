import { useMemo, useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { AVATAR_OPTIONS, getInitials } from '../lib/avatar'
import './Profile.css'

const API = 'http://localhost:8080/api/investment'

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

function formatDate(value) {
  if (!value) return 'Not saved yet'
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function getPlanTitle(recommendation, index) {
  return recommendation.title || `Plan ${index + 1}`
}

function Profile() {
  const navigate = useNavigate()
  const { user, token, updateProfile } = useAuth()

  const [formValues, setFormValues] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    avatar: user?.avatar || 'indigo',
    photo: user?.photo || '',
  })
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [pickerOpen, setPickerOpen] = useState(false)
  const [editingPlanId, setEditingPlanId] = useState(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [pendingDeleteId, setPendingDeleteId] = useState(null)

  const [recStatus, setRecStatus] = useState('loading') // loading | ready | error
  const [recommendations, setRecommendations] = useState([])

  const pickerRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setPickerOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') {
        setPendingDeleteId(null)
      }
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
          setRecStatus('ready')
        }
      } catch {
        if (!cancelled) setRecStatus('error')
      }
    }

    load()
    return () => { cancelled = true }
  }, [token])

  const profileStats = useMemo(() => {
    const totalSaved = recommendations.length

    const totalBudget = recommendations.reduce(
      (sum, rec) => sum + Number(rec.budget || 0),
      0
    )
    const averageBudget = totalSaved ? totalBudget / totalSaved : 0
    const latestSaved = recommendations[0]?.createdAt
    const riskCounts = recommendations.reduce((counts, rec) => {
      const risk = rec.riskTolerance || 'unknown'
      counts[risk] = (counts[risk] || 0) + 1
      return counts
    }, {})
    const mostCommonRisk = Object.entries(riskCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'

    return {
      totalSaved,
      totalBudget,
      averageBudget,
      latestSaved,
      mostCommonRisk,
    }
  }, [recommendations])

  const hasUnsavedChanges = useMemo(() => (
    formValues.name !== (user?.name || '') ||
    formValues.email !== (user?.email || '') ||
    formValues.password.length > 0
  ), [formValues.email, formValues.name, formValues.password, user])

  function handleChange(key, value) {
    setSaved(false)
    setFormValues((prev) => ({ ...prev, [key]: value }))
  }

  async function handleAvatarSelect(avatar) {
    setFormValues((prev) => ({ ...prev, avatar }))
    setPickerOpen(false)
    const { error } = await updateProfile({ avatar })
    setSaved(!error)
  }

  function handlePhotoUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async () => {
      const photo = reader.result
      setFormValues((prev) => ({ ...prev, photo }))
      setPickerOpen(false)
      const { error } = await updateProfile({ photo })
      setSaved(!error)
    }
    reader.readAsDataURL(file)
  }

  async function handlePhotoRemove() {
    setFormValues((prev) => ({ ...prev, photo: '' }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    const { error } = await updateProfile({ photo: '' })
    setSaved(!error)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaveError('')
    const { error } = await updateProfile({
      name: formValues.name,
      email: formValues.email,
      password: formValues.password || undefined,
    })
    if (error) {
      setSaveError(error.message || 'Could not save changes.')
      return
    }
    setFormValues((prev) => ({ ...prev, password: '' }))
    setSaved(true)
  }

  function handleViewRecommendation(recommendation) {
    navigate('/results', { state: recommendation })
  }

  function handleStartRename(recommendation, index) {
    setPendingDeleteId(null)
    setEditingPlanId(recommendation.id)
    setEditingTitle(getPlanTitle(recommendation, index))
  }

  function handleCancelRename() {
    setEditingPlanId(null)
    setEditingTitle('')
  }

  async function handleSaveRename(id) {
    const title = editingTitle.trim()
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
      setRecommendations((prev) => prev.map((rec) => (rec.id === id ? updated : rec)))
    } catch {
      // Leave the list as-is; the title in the input is discarded and the user can retry.
    }
    handleCancelRename()
  }

  function handleRequestDelete(id) {
    setEditingPlanId(null)
    setEditingTitle('')
    setPendingDeleteId(id)
  }

  async function handleConfirmDelete(id) {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error('Delete failed.')
      setRecommendations((prev) => prev.filter((rec) => rec.id !== id))
    } catch {
      // Leave the list as-is; the user can retry the delete.
    } finally {
      setPendingDeleteId(null)
    }
  }

  const avatarOption =
    AVATAR_OPTIONS.find((option) => option.id === formValues.avatar) || AVATAR_OPTIONS[0]
  const avatarInitials = getInitials(formValues.name || user?.name)
  const pendingDeletePlan = recommendations.find((rec) => rec.id === pendingDeleteId)
  const pendingDeleteIndex = recommendations.findIndex((rec) => rec.id === pendingDeleteId)

  return (
    <main className="profile-page">
      <div className="profile-shell">
        <section className="profile-panel profile-account-panel">
          <div className="profile-panel-heading">
            <p className="profile-label">Account</p>
            <h1>{user?.name || 'Sprout Fund User'}</h1>
            <p className="profile-email">{user?.email || 'No email provided'}</p>
          </div>

          <div className="profile-avatar-row">
            <div className="profile-avatar-wrapper">
              <button
                type="button"
                className="profile-avatar"
                style={{ background: avatarOption.background }}
                onClick={() => setPickerOpen((current) => !current)}
                aria-label="Change avatar color"
              >
                {formValues.photo ? (
                  <img
                    className="profile-avatar-photo"
                    src={formValues.photo}
                    alt={`${user?.name || 'User'} profile`}
                  />
                ) : (
                  <span>{avatarInitials}</span>
                )}

                <div className="avatar-hover-overlay">
                  <span>Change avatar</span>
                </div>
              </button>

              <input
                ref={fileInputRef}
                className="profile-photo-input"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
              />

              <button
                type="button"
                className={`profile-photo-action ${formValues.photo ? 'remove' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  if (formValues.photo) {
                    handlePhotoRemove()
                  } else {
                    fileInputRef.current?.click()
                  }
                }}
                aria-label={formValues.photo ? 'Remove profile photo' : 'Upload profile photo'}
              >
                {formValues.photo ? 'x' : '+'}
              </button>

              <div
                ref={pickerRef}
                className={`avatar-picker ${pickerOpen ? 'open' : ''}`}
              >
                {pickerOpen && (
                  <>
                    <p className="avatar-picker-label">AVATAR COLOR</p>
                    <div className="avatar-options-grid">
                      {AVATAR_OPTIONS.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          className={`avatar-option ${
                            formValues.avatar === option.id ? 'selected' : ''
                          }`}
                          style={{ background: option.background }}
                          onClick={() => handleAvatarSelect(option.id)}
                        >
                          <span className="avatar-option-initials">{avatarInitials}</span>
                          <span className="avatar-option-label">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="profile-avatar-copy">
              <strong>Profile picture</strong>
              <span>Upload a photo or keep a color avatar.</span>
            </div>
          </div>

          <form className="profile-form" onSubmit={handleSave}>
            <div className="profile-field">
              <label>FULL NAME</label>
              <input
                value={formValues.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>

            <div className="profile-field">
              <label>EMAIL</label>
              <input
                type="email"
                value={formValues.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>

            <div className="profile-field">
              <label>NEW PASSWORD</label>
              <input
                type="password"
                placeholder="Leave blank to keep your current password"
                value={formValues.password}
                onChange={(e) => handleChange('password', e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <div className="profile-actions">
              <button type="submit" className="profile-save-btn">
                Save changes
              </button>
              {hasUnsavedChanges && <span className="profile-unsaved">Unsaved changes...</span>}
              {saved && !hasUnsavedChanges && <span className="profile-saved">Saved</span>}
              {saveError && <span className="profile-error">{saveError}</span>}
            </div>
          </form>
        </section>

        <section className="profile-panel profile-recommendations-panel">
          <div className="profile-panel-heading">
            <p className="profile-label">Recommendations</p>
            <h2>Saved Plans</h2>
            <p className="recommendations-total">
              {profileStats.totalSaved} saved recommendation{profileStats.totalSaved === 1 ? '' : 's'}
            </p>
          </div>

          <div className="profile-stats-grid">
            <div className="profile-stat">
              <span>TOTAL BUDGET</span>
              <strong>{formatCurrency(profileStats.totalBudget)}</strong>
            </div>
            <div className="profile-stat">
              <span>AVERAGE PLAN</span>
              <strong>{formatCurrency(profileStats.averageBudget)}</strong>
            </div>
            <div className="profile-stat">
              <span>COMMON RISK</span>
              <strong>{profileStats.mostCommonRisk}</strong>
            </div>
            <div className="profile-stat">
              <span>LATEST SAVED</span>
              <strong>{formatDate(profileStats.latestSaved)}</strong>
            </div>
          </div>

          {recStatus === 'loading' && <p className="recommendations-empty">Loading...</p>}
          {recStatus === 'error' && (
            <p className="recommendations-empty">Couldn&apos;t load your saved plans. Please try again.</p>
          )}

          {recStatus === 'ready' && (
            recommendations.length ? (
              <div className="recommendations-list">
                {recommendations.map((rec, index) => {
                  const topStrategy = rec.strategies?.[0]
                  const isEditing = editingPlanId === rec.id

                  return (
                    <article key={rec.id} className="recommendation-item">
                      <div className="rec-header">
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
                          <h3>{getPlanTitle(rec, index)}</h3>
                        )}
                        <span>{formatDate(rec.createdAt)}</span>
                      </div>

                      <div className="rec-metrics">
                        <span>{formatCurrency(rec.budget)}</span>
                        <span>{rec.timeline || 'No timeline'}</span>
                        <span>{rec.riskTolerance || 'No risk'}</span>
                      </div>

                      {topStrategy && (
                        <div className="rec-strategy-summary">
                          <span>Top allocation</span>
                          <strong>
                            {topStrategy.name} / {topStrategy.allocation}%
                          </strong>
                        </div>
                      )}

                      <div className="rec-actions">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              className="rec-action-btn"
                              onClick={() => handleSaveRename(rec.id)}
                            >
                              Save name
                            </button>
                            <button
                              type="button"
                              className="rec-action-btn"
                              onClick={handleCancelRename}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              className="rec-action-btn"
                              onClick={() => handleViewRecommendation(rec)}
                            >
                              View
                            </button>
                            <button
                              type="button"
                              className="rec-action-btn"
                              onClick={() => handleStartRename(rec, index)}
                            >
                              Rename
                            </button>
                            <button
                              type="button"
                              className="rec-action-btn danger"
                              onClick={() => handleRequestDelete(rec.id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </article>
                  )
                })}
              </div>
            ) : (
              <p className="recommendations-empty">No saved plans yet.</p>
            )
          )}
        </section>
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
              This will permanently delete &quot;{getPlanTitle(pendingDeletePlan, pendingDeleteIndex)}&quot;.
              You will not be able to recover it later.
            </p>

            <div className="delete-modal-actions">
              <button
                type="button"
                className="delete-modal-btn secondary"
                onClick={() => setPendingDeleteId(null)}
              >
                Keep plan
              </button>
              <button
                type="button"
                className="delete-modal-btn danger"
                onClick={() => handleConfirmDelete(pendingDeletePlan.id)}
              >
                Delete plan
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default Profile
