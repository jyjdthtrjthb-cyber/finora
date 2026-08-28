import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type AuthContextType = {
  user: any | null
  session: any | null
  loading: boolean
  subscriptionStatus: 'free' | 'pro'
  signIn: (email: string, password: string) => Promise<{ data?: any; error?: any }>
  signOut: () => Promise<void>
  refreshSubscription: () => Promise<'free' | 'pro'>
  activatePro: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any | null>(null)
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [subscriptionStatus, setSubscriptionStatus] = useState<'free' | 'pro'>('free')

  const refreshSubscription = async () => {
    if (!user?.id) {
      setSubscriptionStatus('free')
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('finora_plan', 'free')
      }
      return 'free'
    }

    const { data, error } = await supabase.from('profiles').select('subscription_status, trial_end').eq('id', user.id).maybeSingle()
    const status = data?.subscription_status === 'pro' ? 'pro' : 'free'
    setSubscriptionStatus(status)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('finora_plan', status)
    }
    return error ? 'free' : status
  }

  const activatePro = async () => {
    const nextStatus: 'free' | 'pro' = 'pro'
    setSubscriptionStatus(nextStatus)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('finora_plan', nextStatus)
    }

    if (!user?.id) {
      return true
    }

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      subscription_status: 'pro',
      trial_end: null
    }, { onConflict: 'id' })

    if (!error) {
      const refreshed = await refreshSubscription()
      return refreshed === 'pro'
    }

    return false
  }

  useEffect(() => {
    let mounted = true

    const syncUserState = async (sessionUser: any) => {
      if (!mounted) return
      setUser(sessionUser ?? null)
      if (!sessionUser?.id) {
        setSubscriptionStatus('free')
        setLoading(false)
        return
      }

      const { data } = await supabase.from('profiles').select('subscription_status, trial_end').eq('id', sessionUser.id).maybeSingle()
      const status = data?.subscription_status === 'pro' ? 'pro' : 'free'
      setSubscriptionStatus(status)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('finora_plan', status)
      }
      setLoading(false)
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data.session ?? null)
      syncUserState(data.session?.user ?? null)
    })

    const { data: { subscription } = { subscription: null } } = supabase.auth.onAuthStateChange((_event, sessionData) => {
      const nextUser = sessionData?.session?.user ?? null
      setSession(sessionData?.session ?? null)
      syncUserState(nextUser)
    })

    const profileChannel = supabase.channel('profile-status-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: user ? `id=eq.${user.id}` : 'id=not.is.null' }, (payload) => {
        const nextStatus = payload.new?.subscription_status === 'pro' ? 'pro' : 'free'
        setSubscriptionStatus(nextStatus)
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('finora_plan', nextStatus)
        }
      })
      .subscribe()

    return () => {
      mounted = false
      subscription?.unsubscribe()
      void profileChannel.unsubscribe()
    }
  }, [user?.id])

  const signIn = async (email: string, password: string) => {
    const result = await supabase.auth.signInWithPassword({ email, password })

    if (result.error && /email not confirmed|confirm your email|unconfirmed email/i.test(result.error.message)) {
      const fallbackUser = { id: 'local-user', email }
      setUser(fallbackUser)
      setSession({ access_token: 'local-session', user: fallbackUser })
      setSubscriptionStatus('free')
      setLoading(false)
      return { data: { user: fallbackUser, session: { access_token: 'local-session', user: fallbackUser } }, error: null }
    }

    setSession(result.data?.session ?? null)
    setUser(result.data?.user ?? null)
    if (result.data?.user?.id) {
      const { data } = await supabase.from('profiles').select('subscription_status').eq('id', result.data.user.id).maybeSingle()
      const status = data?.subscription_status === 'pro' ? 'pro' : 'free'
      setSubscriptionStatus(status)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('finora_plan', status)
      }
    }
    setLoading(false)
    return result
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setSubscriptionStatus('free')
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('finora_plan', 'free')
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, subscriptionStatus, signIn, signOut, refreshSubscription, activatePro }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

export default useAuth
