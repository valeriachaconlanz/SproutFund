import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

// localStorage so the JWT and user info survive a page refresh without re-hitting the server
const TOKEN_KEY = 'sproutfund_token'
const USER_KEY = 'sproutfund_user'

export function AuthProvider({ children }) {
  // Read from storage on first render so the app boots already authenticated
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY)
    return stored ? JSON.parse(stored) : null
  })

  const login = useCallback((authData) => {
    localStorage.setItem(TOKEN_KEY, authData.token)
    localStorage.setItem(USER_KEY, JSON.stringify({ name: authData.name, email: authData.email }))
    setToken(authData.token)
    setUser({ name: authData.name, email: authData.email })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
