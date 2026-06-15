import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from '../components/ThemeToggle'
import './Auth.css'

const API = 'http://localhost:8080/api/auth'

function Auth() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

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
    if (mode === 'register' && !fields.name.trim()) e.name = 'Name is required.'
    if (!fields.email.trim()) e.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = 'Enter a valid email address.'
    if (!fields.password) e.password = 'Password is required.'
    else if (mode === 'register' && fields.password.length < 8) e.password = 'Password must be at least 8 characters.'
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

    const endpoint = mode === 'login' ? '/login' : '/register'
    const body = mode === 'login'
      ? { email: fields.email, password: fields.password }
      : { name: fields.name, email: fields.email, password: fields.password }

    try {
      const res = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()

      if (!res.ok) {
        setServerError(data.error || 'Something went wrong. Please try again.')
        return
      }

      login(data)
      navigate(from, { replace: true })
    } catch {
      setServerError('Unable to connect to the server. Please try again.')
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
      <nav className="auth-nav">
        <span className="auth-logo">Sprout<span>Fund</span></span>
        <ThemeToggle />
      </nav>

      <div className="auth-container">
        <div className="auth-card">

          <div className="auth-tabs">
            <button
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => switchMode('login')}
              type="button"
            >
              Sign In
            </button>
            <button
              className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => switchMode('register')}
              type="button"
            >
              Create Account
            </button>
          </div>

          <div className="auth-header">
            <h1 className="auth-title">
              {mode === 'login' ? 'Welcome back' : 'Start your journey'}
            </h1>
            <p className="auth-sub">
              {mode === 'login'
                ? 'Sign in to access your investment plan.'
                : 'Create an account to get your personalized investment strategy.'}
            </p>
          </div>

          {serverError && (
            <div className="auth-server-error">{serverError}</div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>

            {mode === 'register' && (
              <div className="auth-field">
                <label className="auth-label" htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  className={`auth-input ${errors.name ? 'input-error' : ''}`}
                  placeholder="Jane Smith"
                  value={fields.name}
                  onChange={e => set('name', e.target.value)}
                  autoComplete="name"
                />
                {errors.name && <p className="auth-error">{errors.name}</p>}
              </div>
            )}

            <div className="auth-field">
              <label className="auth-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className={`auth-input ${errors.email ? 'input-error' : ''}`}
                placeholder="you@example.com"
                value={fields.email}
                onChange={e => set('email', e.target.value)}
                autoComplete="email"
              />
              {errors.email && <p className="auth-error">{errors.email}</p>}
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className={`auth-input ${errors.password ? 'input-error' : ''}`}
                placeholder={mode === 'register' ? 'At least 8 characters' : '••••••••'}
                value={fields.password}
                onChange={e => set('password', e.target.value)}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
              {errors.password && <p className="auth-error">{errors.password}</p>}
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading
                ? 'Please wait...'
                : mode === 'login' ? 'Sign In →' : 'Create Account →'}
            </button>
          </form>

          <p className="auth-switch">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              className="auth-switch-btn"
              onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
            >
              {mode === 'login' ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>

        <div className="auth-side">
          <div className="auth-side-content">
            <p className="auth-side-label">Why SproutFund?</p>
            <ul className="auth-side-list">
              <li>Personalized strategies based on your budget</li>
              <li>Clear, jargon-free recommendations</li>
              <li>Built for first-time investors</li>
              <li>Free to use, no credit card required</li>
            </ul>
          </div>
          <div className="auth-tips-section">
            <button
              type="button"
              className="auth-tips-btn"
              onClick={() => navigate('/tips')}
            >
              Browse Market Tips
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth
