import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

function toUser(session) {
  if (!session?.user) return null
  const meta = session.user.user_metadata || {}
  return {
    name: meta.name || '',
    email: session.user.email,
    avatar: meta.avatar || 'indigo',
    photo: meta.photo || '',
  }
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

  // Profile page calls this for name/email/password/avatar/photo edits.
  // avatar/photo live in Supabase user_metadata — there's no dedicated
  // column for them, so they ride along with `data` like `name` does.
  const updateProfile = useCallback(async ({ name, email, password, avatar, photo }) => {
    const payload = {}
    if (email !== undefined) payload.email = email
    if (password) payload.password = password

    const data = {}
    if (name !== undefined) data.name = name
    if (avatar !== undefined) data.avatar = avatar
    if (photo !== undefined) data.photo = photo
    if (Object.keys(data).length > 0) payload.data = data

    const { error } = await supabase.auth.updateUser(payload)
    return { error }
  }, [])

  const value = {
    token: session?.access_token || null,
    user: toUser(session),
    isAuthenticated: !!session,
    loading,
    signIn,
    signUp,
    logout,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
