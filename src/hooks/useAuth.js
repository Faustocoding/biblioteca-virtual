import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useAuth() {
  // undefined = todavía no sabemos, null = no hay sesión, objeto = sesión activa
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function signUp(email, password) {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
  }

  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function setPassword(password) {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw error
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return {
    session,
    user: session?.user ?? null,
    loading: session === undefined,
    signUp,
    signIn,
    setPassword,
    signOut,
  }
}
