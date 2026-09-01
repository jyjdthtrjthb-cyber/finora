import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useTranslation } from 'react-i18next'
import { useCurrency } from '../context/CurrencyContext'

const categories = ['Food','Transport','Housing','Education','Entertainment','Shopping','Health','Family','Other']
const STORAGE_KEY = 'finora_onboarding_state'
const COMPLETED_KEY = 'finora_hasCompletedOnboarding'

const CURRENCY_OPTIONS = ['UZS','USD','EUR','RUB'] as const
type CurrencyOpt = typeof CURRENCY_OPTIONS[number]

export default function Onboarding() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()
  const TOTAL_STEPS = 5
  const [step, setStep] = useState(1)
  const { setCurrency: setGlobalCurrency } = useCurrency()

  const [currency, setCurrency] = useState<CurrencyOpt>(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('finora_currency')
      if (stored && (stored === 'UZS' || stored === 'USD' || stored === 'EUR' || stored === 'RUB')) return stored as CurrencyOpt
    }
    return 'UZS'
  })
  const [income, setIncome] = useState<number | ''>('')
  const [spending, setSpending] = useState<Record<string, number>>(() => categories.reduce((acc, c) => ({ ...acc, [c]: 0 }), {} as Record<string, number>))
  const [savings, setSavings] = useState<number | ''>('')
  const [goal, setGoal] = useState('Emergency Fund')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const next = () => setStep((s) => Math.min(TOTAL_STEPS, s + 1))
  const prev = () => setStep((s) => Math.max(1, s - 1))

  const persistOnboarding = () => {
    const onboardingState = { currency, income, spending, savings, goal, hasCompletedOnboarding: true }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(onboardingState))
      window.localStorage.setItem(COMPLETED_KEY, 'true')
      window.localStorage.setItem('finora_currency', currency)
    }
  }

  const validateStep = (s: number) => {
    const errs: Record<string, string> = {}
    if (s === 1) {
      if (!currency) errs.currency = t('required_field')
      else if (!(currency === 'UZS' || currency === 'USD' || currency === 'EUR' || currency === 'RUB')) errs.currency = t('invalid_number')
    }
    if (s === 2) {
      Object.entries(spending).forEach(([k, v]) => {
        if (v == null || Number.isNaN(Number(v)) || Number(v) < 0) errs[k] = t('invalid_number')
      })
    }
    if (s === 3) {
      if (savings === '' || savings == null) errs.savings = t('required_field')
      else if (Number(savings) < 0) errs.savings = t('invalid_number')
      else if (income !== '' && Number(savings) > Number(income)) errs.savings = t('invalid_number')
    }
    if (s === 4) {
      if (income === '' || income === null) errs.income = t('required_field')
      else if (Number(income) < 0) errs.income = t('invalid_number')
    }
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setError(null)
    if (!user) return setError(t('required_field'))

    const isValid = validateStep(1) && validateStep(2) && validateStep(3) && validateStep(4)
    if (!isValid) return

    const preferredLocale = typeof window !== 'undefined' ? (window.localStorage.getItem('finora_lang') || 'ru') : 'ru'

    setLoading(true)
    try {
      // attempt to persist to Supabase, but do not block onboarding if any DB operation fails
      try {
        const { error } = await supabase.from('profiles').upsert({
          id: user.id,
          currency: currency,
          monthly_income: income || 0,
          monthly_savings: savings || 0,
          preferred_locale: preferredLocale,
          onboarding_completed: true
        }, { onConflict: 'id' })
        if (error) console.warn('Onboarding: profiles.upsert error', error)
      } catch (err) {
        console.warn('Onboarding: profiles.upsert failed', err)
      }

      const month = new Date().toISOString().slice(0, 10)
      const budgetRows = Object.entries(spending).map(([category, amount]) => ({
        user_id: user.id,
        month,
        category,
        planned: amount
      }))
      if (budgetRows.length) {
        try { await supabase.from('budgets').insert(budgetRows) } catch (err) { console.warn('Onboarding: budgets.insert failed', err) }
      }

      try { await supabase.from('savings').upsert({ user_id: user.id, monthly_contribution: savings || 0 }, { onConflict: 'user_id' }) } catch (err) { console.warn('Onboarding: savings.upsert failed', err) }
      try { await supabase.from('financial_goals').insert({ user_id: user.id, name: goal, target_amount: 0, current_amount: 0, monthly_contribution: savings || 0 }) } catch (err) { console.warn('Onboarding: financial_goals.insert failed', err) }

      // persist locally and continue regardless of DB errors
      persistOnboarding()
      setLoading(false)
      navigate('/dashboard', { replace: true })
    } finally {
      // ensure loading is turned off if something unexpected happens
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{t('onboarding_title')}</h2>
      <form onSubmit={submit} className="space-y-4">
        <div className="mb-4">{t('onboarding_step', { step, total: TOTAL_STEPS })}</div>
        {step === 1 && (
          <div>
            <div className="mb-2 text-sm font-medium">{t('choose_currency')}</div>
            <div className="grid grid-cols-2 gap-2">
              {CURRENCY_OPTIONS.map((c) => (
                <button key={c} type="button" onClick={() => setCurrency(c)} className={`p-3 rounded border ${currency === c ? 'border-slate-900 bg-slate-100' : 'border-slate-200 bg-white'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <label className="block text-sm">{t('income_label')}</label>
            <input type="number" className="w-full p-2 border rounded mt-1" value={income} onChange={e => setIncome(e.target.value === '' ? '' : Number(e.target.value))} />
            {fieldErrors.income && <div className="text-red-600 text-sm">{fieldErrors.income}</div>}
          </div>
        )}
        {step === 3 && (
          <div>
            <div className="text-sm mb-2">{t('spend_label')}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {categories.map(cat => (
                <div key={cat}>
                  <label className="block text-xs">{cat}</label>
                  <input type="number" className="w-full p-2 border rounded mt-1" value={spending[cat]} onChange={e => setSpending(s => ({ ...s, [cat]: e.target.value === '' ? 0 : Number(e.target.value) }))} />
                  {fieldErrors[cat] && <div className="text-red-600 text-sm">{fieldErrors[cat]}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
        {step === 4 && (
          <div>
            <label className="block text-sm">{t('savings_label')}</label>
            <input type="number" className="w-full p-2 border rounded mt-1" value={savings} onChange={e => setSavings(e.target.value === '' ? '' : Number(e.target.value))} />
            {fieldErrors.savings && <div className="text-red-600 text-sm">{fieldErrors.savings}</div>}
          </div>
        )}
        {step === 5 && (
          <div>
            <label className="block text-sm">{t('goal_label')}</label>
            <select className="w-full p-2 border rounded mt-1" value={goal} onChange={e => setGoal(e.target.value)}>
              <option>Car</option>
              <option>House</option>
              <option>Travel</option>
              <option>Phone</option>
              <option>Education</option>
              <option>Emergency Fund</option>
              <option>Child Future</option>
              <option>Other</option>
            </select>
          </div>
        )}

        {error && <div className="text-red-600 mt-4">{error}</div>}
        <div className="flex gap-2 mt-4">
          {step > 1 && (
            <button type="button" onClick={prev} className="px-4 py-2 border rounded">{t('back')}</button>
          )}
          {step < TOTAL_STEPS && (
            <button
              type="button"
              onClick={async () => {
                if (!validateStep(step)) return
                // If on currency step, persist immediately
                if (step === 1) {
                  try {
                    if (user?.id) {
                      const { error } = await supabase.from('profiles').upsert({ id: user.id, currency: currency }, { onConflict: 'id' })
                      if (error) {
                        // non-blocking: show error but allow onboarding to continue
                        setError(error.message)
                      }
                    }
                    // update global currency immediately
                    try { await setGlobalCurrency(currency) } catch { /* ignore */ }
                    if (typeof window !== 'undefined') window.localStorage.setItem('finora_currency', currency)
                  } catch (e: any) {
                    // non-blocking: store locally and continue
                    if (typeof window !== 'undefined') window.localStorage.setItem('finora_currency', currency)
                  }
                }
                next()
              }}
              className="px-4 py-2 bg-finora text-white rounded"
            >
              {t('next')}
            </button>
          )}
          {step === TOTAL_STEPS && (
            <button type="submit" className="px-4 py-2 bg-finora text-white rounded" disabled={loading}>
              {loading ? 'Saving...' : t('finish')}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
