import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { CurrencyCode, CURRENCIES } from '../lib/currency'

type CurrencyContextType = {
  currency: CurrencyCode
  setCurrency: (c: CurrencyCode) => Promise<boolean>
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('finora_currency')
      if (stored && (stored === 'UZS' || stored === 'USD' || stored === 'EUR' || stored === 'RUB')) return stored as CurrencyCode
    }
    return 'UZS'
  })

  useEffect(() => {
    let mounted = true
    if (!user?.id) return
    ;(async () => {
      try {
        const { data } = await supabase.from('profiles').select('currency_preference').eq('id', user.id).maybeSingle()
        if (!mounted) return
        const pref = data?.currency_preference
        if (pref && (pref === 'UZS' || pref === 'USD' || pref === 'EUR' || pref === 'RUB')) {
          setCurrencyState(pref)
          if (typeof window !== 'undefined') window.localStorage.setItem('finora_currency', pref)
        }
      } catch {
        // ignore, keep default
      }
    })()
    return () => { mounted = false }
  }, [user?.id])

  const setCurrency = async (next: CurrencyCode) => {
    const prev = currency
    setCurrencyState(next)
    if (typeof window !== 'undefined') window.localStorage.setItem('finora_currency', next)

    if (!user?.id) return true

    try {
      const { error } = await supabase.from('profiles').upsert({ id: user.id, currency_preference: next }, { onConflict: 'id' })
      if (error) {
        // revert
        setCurrencyState(prev)
        if (typeof window !== 'undefined') window.localStorage.setItem('finora_currency', prev)
        return false
      }
      return true
    } catch {
      setCurrencyState(prev)
      if (typeof window !== 'undefined') window.localStorage.setItem('finora_currency', prev)
      return false
    }
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error('useCurrency must be used inside CurrencyProvider')
  return ctx
}

export default CurrencyProvider
