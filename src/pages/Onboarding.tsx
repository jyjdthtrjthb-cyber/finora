import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useTranslation } from 'react-i18next'

const categories = ['Food','Transport','Housing','Education','Entertainment','Shopping','Health','Family','Other']
const STORAGE_KEY = 'finora_onboarding_state'
const COMPLETED_KEY = 'finora_hasCompletedOnboarding'

export default function Onboarding() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [income, setIncome] = useState<number | ''>('')
  const [spending, setSpending] = useState<Record<string, number>>(() => categories.reduce((acc, c) => ({ ...acc, [c]: 0 }), {} as Record<string, number>))
  const [savings, setSavings] = useState<number | ''>('')
  const [goal, setGoal] = useState('Emergency Fund')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const next = () => setStep((s) => Math.min(4, s + 1))
  const prev = () => setStep((s) => Math.max(1, s - 1))

  const persistOnboarding = () => {
    const onboardingState = { income, spending, savings, goal, hasCompletedOnboarding: true }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(onboardingState))
      window.localStorage.setItem(COMPLETED_KEY, 'true')
    }
  }

  const validateStep = (s: number) => {
    const errs: Record<string, string> = {}
    if (s === 1) {
      if (income === '' || income === null) errs.income = t('required_field')
      else if (Number(income) < 0) errs.income = t('invalid_number')
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
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setError(null)
    if (!user) return setError(t('required_field'))

    const isValid = validateStep(1) && validateStep(2) && validateStep(3)
    if (!isValid) return

    setLoading(true)
    try {
      await supabase.from('profiles').upsert({
        id: user.id,
        monthly_income: income || 0,
        monthly_savings: savings || 0,
        preferred_locale: 'ru',
        onboarding_completed: true
      }, { onConflict: 'id' })

      const month = new Date().toISOString().slice(0, 10)
      const budgetRows = Object.entries(spending).map(([category, amount]) => ({
        user_id: user.id,
        month,
        category,
        planned: amount
      }))
      if (budgetRows.length) await supabase.from('budgets').insert(budgetRows)

      await supabase.from('savings').upsert({ user_id: user.id, monthly_contribution: savings || 0 }, { onConflict: 'user_id' })
      await supabase.from('financial_goals').insert({
        user_id: user.id,
        name: goal,
        target_amount: 0,
        current_amount: 0,
        monthly_contribution: savings || 0
      })

      persistOnboarding()
      setLoading(false)
      navigate('/dashboard', { replace: true })
    } catch (e: any) {
      setLoading(false)
      setError(e?.message || 'Failed')
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{t('onboarding_title')}</h2>
      <form onSubmit={submit} className="space-y-4">
        <div className="mb-4">{t('onboarding_step', { step, total: 4 })}</div>
        {step === 1 && (
          <div>
            <label className="block text-sm">{t('income_label')}</label>
            <input type="number" className="w-full p-2 border rounded mt-1" value={income} onChange={e => setIncome(e.target.value === '' ? '' : Number(e.target.value))} />
            {fieldErrors.income && <div className="text-red-600 text-sm">{fieldErrors.income}</div>}
          </div>
        )}
        {step === 2 && (
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
        {step === 3 && (
          <div>
            <label className="block text-sm">{t('savings_label')}</label>
            <input type="number" className="w-full p-2 border rounded mt-1" value={savings} onChange={e => setSavings(e.target.value === '' ? '' : Number(e.target.value))} />
            {fieldErrors.savings && <div className="text-red-600 text-sm">{fieldErrors.savings}</div>}
          </div>
        )}
        {step === 4 && (
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
          {step < 4 && (
            <button type="button" onClick={() => { if (validateStep(step)) next() }} className="px-4 py-2 bg-finora text-white rounded">{t('next')}</button>
          )}
          {step === 4 && (
            <button type="submit" className="px-4 py-2 bg-finora text-white rounded" disabled={loading}>
              {loading ? 'Saving...' : t('finish')}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
