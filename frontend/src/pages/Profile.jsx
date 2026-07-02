import { useMemo, useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from '../components/ThemeToggle'
import UserMenu from '../components/UserMenu'
import './Profile.css'

function getInitials(name) {
  if (!name) return 'SF'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

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

const AVATAR_OPTIONS = [
  { id: 'indigo', label: 'Indigo', background: 'linear-gradient(135deg, #7c3aed, #4338ca)' },
  { id: 'emerald', label: 'Emerald', background: 'linear-gradient(135deg, #10b981, #047857)' },
  { id: 'sunset', label: 'Sunset', background: 'linear-gradient(135deg, #f59e0b, #ef4444)' },
  { id: 'coral', label: 'Coral', background: 'linear-gradient(135deg, #f472b6, #ec4899)' },
  { id: 'teal', label: 'Teal', background: 'linear-gradient(135deg, #14b8a6, #0f766e)' },
  { id: 'amber', label: 'Amber', background: 'linear-gradient(135deg, #fcd34d, #f59e0b)' },
]

function Profile() {
  const navigate = useNavigate()
  const {
    user,
    updateUser,
    recommendations,
    updateRecommendation,
    removeRecommendation,
  } = useAuth()

  const [formValues, setFormValues] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: user?.password || '',
    avatar: user?.avatar || 'indigo',
    photo: user?.photo || '',
  })
  const [saved, setSaved] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [editingPlanId, setEditingPlanId] = useState(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [pendingDeleteId, setPendingDeleteId] = useState(null)

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

  const profileStats = useMemo(() => {
    const totalSaved = recommendations?.length || 0

    const totalBudget = (recommendations || []).reduce(
      (sum, rec) => sum + Number(rec.budget || 0),
      0
  )
    const averageBudget = totalSaved ? totalBudget / totalSaved : 0
    const latestSaved = recommendations?.[0]?.createdAt
    const riskCounts = (recommendations || []).reduce((counts, rec) => {
      const risk = rec.riskLevel || rec.riskTolerance || 'unknown'
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
    formValues.password !== (user?.password || '')
  ), [formValues.email, formValues.name, formValues.password, user])

  function handleChange(key, value) {
    setSaved(false)
    setFormValues((prev) => ({ ...prev, [key]: value }))
  }

  function handleAvatarSelect(avatar) {
    const next = { ...formValues, avatar }
    setFormValues(next)
    updateUser(next)
    setSaved(true)
    setPickerOpen(false)
  }

  function handlePhotoUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const next = { ...formValues, photo: reader.result }
      setFormValues(next)
      updateUser(next)
      setSaved(true)
      setPickerOpen(false)
    }
    reader.readAsDataURL(file)
  }

  function handlePhotoRemove() {
    const next = { ...formValues, photo: '' }
    setFormValues(next)
    updateUser(next)
    setSaved(true)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  function handleSave(e) {
    e.preventDefault()
    updateUser(formValues)
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

  function handleSaveRename(id) {
    updateRecommendation(id, { title: editingTitle.trim() })
    handleCancelRename()
  }

  function handleRequestDelete(id) {
    setEditingPlanId(null)
    setEditingTitle('')
    setPendingDeleteId(id)
  }

  function handleConfirmDelete(id) {
    removeRecommendation(id)
    setPendingDeleteId(null)
  }

  const avatarOption =
    AVATAR_OPTIONS.find((option) => option.id === formValues.avatar) || AVATAR_OPTIONS[0]
  const avatarInitials = getInitials(formValues.name || user?.name)
  const pendingDeletePlan = recommendations?.find((rec) => rec.id === pendingDeleteId)
  const pendingDeleteIndex = recommendations?.findIndex((rec) => rec.id === pendingDeleteId) ?? -1

  return (
    <main className="profile-page">
      <nav className="profile-nav">
        <span className="profile-logo">
          Sprout<span>Fund</span>
        </span>

        <div className="profile-nav-actions">
          <ThemeToggle />
          <button className="profile-nav-btn" onClick={() => navigate('/dashboard')}>
            Back to dashboard
          </button>
          <UserMenu />
        </div>
      </nav>

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
              <label>PASSWORD</label>
              <input
                type="password"
                value={formValues.password}
                onChange={(e) => handleChange('password', e.target.value)}
              />
            </div>

            <div className="profile-actions">
              <button type="submit" className="profile-save-btn">
                Save changes
              </button>
              {hasUnsavedChanges && <span className="profile-unsaved">Unsaved changes...</span>}
              {saved && !hasUnsavedChanges && <span className="profile-saved">Saved locally</span>}
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

          {recommendations?.length ? (
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
                      <span>{rec.riskLevel || 'No risk'}</span>
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
              This will permanently delete "{getPlanTitle(pendingDeletePlan, pendingDeleteIndex)}".
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
