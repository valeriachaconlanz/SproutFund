import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

function Auth() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, signUp } = useAuth()
  const { t } = useTranslation()

  const [mode, setMode] = useState('login')
  const [fields, setFields] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const from = location.state?.from?.pathname || '/'

  function set(key, value) {
    setFields(f => ({ ...f, [key]: value }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }))
    if (serverError) setServerError('')
  }

  function validate() {
    const e = {}
    if (mode === 'register' && !fields.name.trim()) e.name = t('auth.errors.nameRequired')
    if (!fields.email.trim()) e.email = t('auth.errors.emailRequired')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = t('auth.errors.emailInvalid')
    if (!fields.password) e.password = t('auth.errors.passwordRequired')
    else if (mode === 'register' && fields.password.length < 8) e.password = t('auth.errors.passwordTooShort')
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    setServerError('')

    try {
      if (mode === 'login') {
        const { error } = await signIn(fields.email, fields.password)
        if (error) {
          setServerError(error.message || t('auth.errors.invalidCredentials'))
          return
        }
        navigate(from, { replace: true })
      } else {
        const { error, needsEmailConfirmation } = await signUp(fields.name, fields.email, fields.password)
        if (error) {
          setServerError(error.message || t('auth.errors.generic'))
          return
        }
        if (needsEmailConfirmation) {
          setMode('login')
          setServerError(t('auth.emailConfirmation'))
          return
        }
        navigate(from, { replace: true })
      }
    } catch {
      setServerError(t('auth.errors.network'))
    } finally {
      setLoading(false)
    }
  }

  function switchMode(next) {
    setMode(next)
    setErrors({})
    setServerError('')
    setFields({ name: '', email: '', password: '' })
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">

          <div className="auth-tabs">
            <button
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => switchMode('login')}
              type="button"
            >
              {t('auth.signInTab')}
            </button>
            <button
              className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => switchMode('register')}
              type="button"
            >
              {t('auth.createAccountTab')}
            </button>
          </div>

          <div className="auth-header">
            <h1 className="auth-title">
              {mode === 'login' ? t('auth.welcomeBack') : t('auth.startYourJourney')}
            </h1>
            <p className="auth-sub">
              {mode === 'login'
                ? t('auth.signInSubtitle')
                : t('auth.registerSubtitle')}
            </p>
          </div>

          {serverError && (
            <div className="auth-server-error">{serverError}</div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>

            {mode === 'register' && (
              <div className="auth-field">
                <label className="auth-label" htmlFor="name">{t('auth.fullName')}</label>
                <input
                  id="name"
                  type="text"
                  className={`auth-input ${errors.name ? 'input-error' : ''}`}
                  placeholder={t('auth.fullNamePlaceholder')}
                  value={fields.name}
                  onChange={e => set('name', e.target.value)}
                  autoComplete="name"
                />
                {errors.name && <p className="auth-error">{errors.name}</p>}
              </div>
            )}

            <div className="auth-field">
              <label className="auth-label" htmlFor="email">{t('auth.emailAddress')}</label>
              <input
                id="email"
                type="email"
                className={`auth-input ${errors.email ? 'input-error' : ''}`}
                placeholder={t('auth.emailPlaceholder')}
                value={fields.email}
                onChange={e => set('email', e.target.value)}
                autoComplete="email"
              />
              {errors.email && <p className="auth-error">{errors.email}</p>}
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="password">{t('auth.password')}</label>
              <input
                id="password"
                type="password"
                className={`auth-input ${errors.password ? 'input-error' : ''}`}
                placeholder={mode === 'register' ? t('auth.passwordPlaceholderRegister') : '••••••••'}
                value={fields.password}
                onChange={e => set('password', e.target.value)}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
              {errors.password && <p className="auth-error">{errors.password}</p>}
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading
                ? t('auth.pleaseWait')
                : mode === 'login' ? t('auth.signInSubmit') : t('auth.createAccountSubmit')}
            </button>
          </form>

          <p className="auth-switch">
            {mode === 'login' ? t('auth.noAccount') : t('auth.hasAccount')}
            <button
              type="button"
              className="auth-switch-btn"
              onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
            >
              {mode === 'login' ? t('auth.createOne') : t('auth.signInLink')}
            </button>
          </p>
        </div>

        <div className="auth-side">
          <div className="auth-side-content">
            <p className="auth-side-label">{t('auth.whySproutFund')}</p>
            <ul className="auth-side-list">
              {t('auth.benefits', { returnObjects: true }).map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </div>
          <div className="auth-tips-section">
            <button
              type="button"
              className="auth-tips-btn"
              onClick={() => navigate('/tips')}
            >
              {t('auth.browseMarketTips')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth
