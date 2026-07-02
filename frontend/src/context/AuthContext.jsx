import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

// localStorage so the JWT and user info survive a page refresh without re-hitting the server
const TOKEN_KEY = 'sproutfund_token'
const USER_KEY = 'sproutfund_user'
const RECOMMENDATIONS_KEY = 'sproutfund_recommendations'

export function AuthProvider({ children }) {
  // Read from storage on first render so the app boots already authenticated
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY)
    return stored ? JSON.parse(stored) : null
  })
  const [recommendations, setRecommendations] = useState(() => {
    const stored = localStorage.getItem(RECOMMENDATIONS_KEY)
    return stored ? JSON.parse(stored) : []
  })

  const login = useCallback((authData) => {
    const nextUser = {
      name: authData.name,
      email: authData.email,
      avatar: authData.avatar || 'indigo',
      photo: authData.photo || '',
    }
    localStorage.setItem(TOKEN_KEY, authData.token)
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
    setToken(authData.token)
    setUser(nextUser)
  }, [])

  const updateUser = useCallback((updatedUser) => {
    const nextUser = {
      name: updatedUser.name,
      email: updatedUser.email,
      password: updatedUser.password,
      avatar: updatedUser.avatar ?? user?.avatar ?? 'indigo',
      photo: updatedUser.photo ?? user?.photo ?? '',
    }
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
    setUser(nextUser)
  }, [user])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const addRecommendation = useCallback((recommendation) => {
    const newRec = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      title: recommendation.title || '',
      budget: recommendation.budget,
      timeline: recommendation.timeline,
      riskLevel: recommendation.riskLevel,
      riskTolerance: recommendation.riskTolerance || recommendation.riskLevel,
      strategies: recommendation.strategies,
      disclaimer: recommendation.disclaimer || '',
    }
    const updated = [newRec, ...recommendations]
    localStorage.setItem(RECOMMENDATIONS_KEY, JSON.stringify(updated))
    setRecommendations(updated)
    return newRec
  }, [recommendations])

  const updateRecommendation = useCallback((id, updates) => {
    const updated = recommendations.map((recommendation) => (
      recommendation.id === id
        ? { ...recommendation, ...updates, updatedAt: new Date().toISOString() }
        : recommendation
    ))
    localStorage.setItem(RECOMMENDATIONS_KEY, JSON.stringify(updated))
    setRecommendations(updated)
  }, [recommendations])

  const removeRecommendation = useCallback((id) => {
    const updated = recommendations.filter((recommendation) => recommendation.id !== id)
    localStorage.setItem(RECOMMENDATIONS_KEY, JSON.stringify(updated))
    setRecommendations(updated)
  }, [recommendations])

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, login, logout, updateUser, recommendations, addRecommendation, updateRecommendation, removeRecommendation }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
