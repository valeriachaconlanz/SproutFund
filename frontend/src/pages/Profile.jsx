import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { AVATAR_OPTIONS, getInitials } from '../lib/avatar'
import './Profile.css'

function Profile() {
  const { t } = useTranslation()
  const { user, updateProfile } = useAuth()

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

  const hasUnsavedChanges =
    formValues.name !== (user?.name || '') ||
    formValues.email !== (user?.email || '') ||
    formValues.password.length > 0

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
      setSaveError(error.message || t('profile.saveError'))
      return
    }

    setFormValues((prev) => ({ ...prev, password: '' }))
    setSaved(true)
  }

  const avatarOption =
    AVATAR_OPTIONS.find((option) => option.id === formValues.avatar) ||
    AVATAR_OPTIONS[0]

  const avatarInitials = getInitials(formValues.name || user?.name)

  return (
    <main className="profile-page">
      <div className="profile-shell single-column">
        <section className="profile-panel profile-account-panel">
          <div className="profile-panel-heading">
            <p className="profile-label">
              {t('profile.accountSettings')}
            </p>

            <h1>{user?.name || t('profile.defaultUser')}</h1>

            <p className="profile-email">
              {user?.email || t('profile.noEmail')}
            </p>
          </div>

          <div className="profile-avatar-row">
            <div className="profile-avatar-wrapper">
              <button
                type="button"
                className="profile-avatar"
                style={{ background: avatarOption.background }}
                onClick={() => setPickerOpen((current) => !current)}
                aria-label={t('profile.changeAvatar')}
              >
                {formValues.photo ? (
                  <img
                    className="profile-avatar-photo"
                    src={formValues.photo}
                    alt={`${user?.name || t('profile.user')} profile`}
                  />
                ) : (
                  <span>{avatarInitials}</span>
                )}

                <div className="avatar-hover-overlay">
                  <span>{t('profile.changeAvatar')}</span>
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
                className={`profile-photo-action ${
                  formValues.photo ? 'remove' : ''
                }`}
                onClick={(e) => {
                  e.stopPropagation()

                  if (formValues.photo) {
                    handlePhotoRemove()
                  } else {
                    fileInputRef.current?.click()
                  }
                }}
                aria-label={
                  formValues.photo
                    ? t('profile.removePhoto')
                    : t('profile.uploadPhoto')
                }
              >
                {formValues.photo ? 'x' : '+'}
              </button>

              <div
                ref={pickerRef}
                className={`avatar-picker ${
                  pickerOpen ? 'open' : ''
                }`}
              >
                {pickerOpen && (
                  <>
                    <p className="avatar-picker-label">
                      {t('profile.avatarColor')}
                    </p>

                    <div className="avatar-options-grid">
                      {AVATAR_OPTIONS.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          className={`avatar-option ${
                            formValues.avatar === option.id
                              ? 'selected'
                              : ''
                          }`}
                          style={{ background: option.background }}
                          onClick={() =>
                            handleAvatarSelect(option.id)
                          }
                        >
                          <span className="avatar-option-initials">
                            {avatarInitials}
                          </span>

                          <span className="avatar-option-label">
                            {option.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="profile-avatar-copy">
              <strong>{t('profile.profilePicture')}</strong>

              <span>
                {t('profile.profilePictureDesc')}
              </span>
            </div>
          </div>

          <form className="profile-form" onSubmit={handleSave}>
            <div className="profile-field">
              <label>{t('profile.fullName')}</label>

              <input
                value={formValues.name}
                onChange={(e) =>
                  handleChange('name', e.target.value)
                }
              />
            </div>

            <div className="profile-field">
              <label>{t('profile.email')}</label>

              <input
                type="email"
                value={formValues.email}
                onChange={(e) =>
                  handleChange('email', e.target.value)
                }
              />
            </div>

            <div className="profile-field">
              <label>{t('profile.newPassword')}</label>

              <input
                type="password"
                placeholder={t('profile.passwordPlaceholder')}
                value={formValues.password}
                onChange={(e) =>
                  handleChange('password', e.target.value)
                }
                autoComplete="new-password"
              />
            </div>

            <div className="profile-actions">
              <button
                type="submit"
                className="profile-save-btn"
              >
                {t('profile.saveChanges')}
              </button>

              {hasUnsavedChanges && (
                <span className="profile-unsaved">
                  {t('profile.unsaved')}
                </span>
              )}

              {saved && !hasUnsavedChanges && (
                <span className="profile-saved">
                  {t('profile.saved')}
                </span>
              )}

              {saveError && (
                <span className="profile-error">
                  {saveError}
                </span>
              )}
            </div>
          </form>
        </section>
      </div>
    </main>
  )
}

export default Profile