import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

function toUser(session) {
  if (!session?.user) return null
  return { name: session.user.user_metadata?.name || '', email: session.user.email }
}

export function AuthProvider({ children }) {
  // Supabase persists the session itself (localStorage) and handles token
  // refresh in the background — we just mirror its current session here.
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const signIn = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }, [])

  const signUp = useCallback(async (name, email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    // If email confirmation is required, Supabase returns a user but no
    // session — the caller needs to know so it doesn't treat this as login.
    return { error, needsEmailConfirmation: !error && !data.session }
  }, [])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  const value = {
    token: session?.access_token || null,
    user: toUser(session),
    isAuthenticated: !!session,
    loading,
    signIn,
    signUp,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
