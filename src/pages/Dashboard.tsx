import React, { useEffect, useMemo, useState } from 'react'
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuth } from '../hooks/useAuth'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

type Goal = {
  id: number
  name: string
  target: number
  current: number
  monthly: number
}

type TabKey = 'home' | 'account' | 'goals' | 'calculators'

type Debt = {
  id: string
  name: string
  total: number
  remaining: number
  rate: number
  payment: number
  dueDate?: string
}

function calculateCompoundProjection(initialDeposit: number, monthlyInvestment: number, annualRate: number, years: number) {
  const months = years * 12
  const monthlyRate = annualRate / 100 / 12
  let balance = initialDeposit
  let contributions = initialDeposit

  for (let month = 1; month <= months; month += 1) {
    balance = (balance + monthlyInvestment) * (1 + monthlyRate)
    contributions += monthlyInvestment
  }

  return {
    total: Math.round(balance),
    contributions: Math.round(contributions),
    interest: Math.round(balance - contributions)
  }
}

function formatMoney(value: number) {
  return Number(value || 0).toLocaleString('ru-RU')
}

function getGoalProgress(goal: Goal) {
  if (goal.target <= 0) return 0
  return Math.min(100, (goal.current / goal.target) * 100)
}

function getGoalCountdown(goal: Goal) {
  const remaining = Math.max(goal.target - goal.current, 0)
  if (!goal.monthly || remaining <= 0) return { text: '0 d', value: 0 }
  const monthsRemaining = remaining / goal.monthly
  const daysRemaining = monthsRemaining * 30
  if (monthsRemaining >= 1) return { text: `${Math.ceil(monthsRemaining)} ${monthsRemaining > 1 ? 'mo' : 'mo'}`, value: Math.ceil(monthsRemaining) }
  return { text: `${Math.ceil(daysRemaining)} d`, value: Math.ceil(daysRemaining) }
}

export default function Dashboard() {
  const { user, signOut, subscriptionStatus, activatePro, refreshSubscription } = useAuth()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const [activeTab, setActiveTab] = useState<TabKey>('home')
  const [profile, setProfile] = useState<any>(null)
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false)
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)
  const [isDeleteGoalOpen, setIsDeleteGoalOpen] = useState(false)
  const [isDebtDeleteOpen, setIsDebtDeleteOpen] = useState(false)
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null)
  const [debtToDelete, setDebtToDelete] = useState<Debt | null>(null)
  const [savingAccount, setSavingAccount] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [promoCode, setPromoCode] = useState('')
  const [promoNotice, setPromoNotice] = useState<string | null>(null)
  const [goalForm, setGoalForm] = useState({ name: '', target: '', current: '', monthly: '' })
  const [accountDraft, setAccountDraft] = useState({
    monthly_income: '',
    monthly_expenses: '',
    savings_target: '',
    bank_yield_rate: '19',
    currency_preference: 'UZS'
  })
  const [initialDeposit, setInitialDeposit] = useState(1000000)
  const [monthlyInvestment, setMonthlyInvestment] = useState(200000)
  const [annualRate, setAnnualRate] = useState(19)
  const [years, setYears] = useState(10)
  const [portfolio, setPortfolio] = useState({ uzs: '2500000', usd: '150', eur: '80', rub: '25000' })
  const [businessModel, setBusinessModel] = useState({ initialInvestment: '15000000', fixedExpenses: '2400000', avgProfit: '32000' })
  const [debtSpeedup, setDebtSpeedup] = useState({ totalLoan: '35000000', annualRate: '14', minimumPayment: '760000', extraPayment: '200000' })
  const [childFund, setChildFund] = useState({ currentAge: 5, targetAge: 20, currentSavings: 500000, monthly: 150000, annualRate: 11 })
  const [debtDraft, setDebtDraft] = useState({ name: 'Автокредит', total: '5000000', rate: '12', payment: '270000' })
  const [debts, setDebts] = useState<Debt[]>([])
  const [goals, setGoals] = useState<Goal[]>(() => {
    if (typeof window === 'undefined') return []
    const stored = window.localStorage.getItem('finora_goals')
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return []
      }
    }
    return [
      { id: 1, name: 'Emergency Fund', target: 6000000, current: 2500000, monthly: 250000 },
      { id: 2, name: 'Travel', target: 4000000, current: 1800000, monthly: 200000 }
    ]
  })

  const isPro = subscriptionStatus === 'pro' || (profile?.subscription_status === 'pro') || (typeof window !== 'undefined' && window.localStorage.getItem('finora_plan') === 'pro')
  const limit = isPro ? 15 : 5
  const debtLimit = isPro ? 5 : 2
  const debtCategories = [
    { value: 'Автокредит', label: t('debt_auto_loan') },
    { value: 'Телефон', label: t('debt_phone') },
    { value: 'Обучение', label: t('debt_education') },
    { value: 'Ипотека', label: t('debt_mortgage') },
    { value: 'Личный долг', label: t('debt_personal') },
    { value: 'Другое', label: t('debt_other') }
  ]

  const generateDebtId = () => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID()
    }
    return `debt-${Date.now()}-${Math.random().toString(16).slice(2)}`
  }

  const getDebtPayoffMonths = (debt: Debt) => {
    if (!debt.payment || debt.remaining <= 0) return 0
    return Math.ceil(debt.remaining / debt.payment)
  }

  const getDebtCompletionDate = (debt: Debt) => {
    const months = getDebtPayoffMonths(debt)
    if (!months) return t('debt_paid_off')
    const date = new Date()
    date.setMonth(date.getMonth() + months)
    return date.toLocaleDateString('ru-RU', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const persistDebts = (nextDebts: Debt[]) => {
    setDebts(nextDebts)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('finora_debts', JSON.stringify(nextDebts))
    }
  }

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 2600)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    const storedProfile = (() => {
      if (typeof window === 'undefined') return null
      try {
        const raw = window.localStorage.getItem('finora_user_profile')
        return raw ? JSON.parse(raw) : null
      } catch {
        return null
      }
    })()

    if (!user) {
      if (storedProfile) {
        setProfile(storedProfile)
        setAccountDraft({
          monthly_income: String(storedProfile.monthly_income ?? 0),
          monthly_expenses: String(storedProfile.monthly_expenses ?? 0),
          savings_target: String(storedProfile.savings_target ?? storedProfile.monthly_savings ?? 0),
          bank_yield_rate: String(storedProfile.bank_yield_rate ?? storedProfile.bank_annual_yield ?? 19),
          currency_preference: storedProfile.currency_preference ?? 'UZS'
        })
      }
      return
    }

    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle().then((res) => {
      if (!res.error && res.data) {
        const mergedProfile = {
          ...storedProfile,
          ...res.data,
          monthly_income: res.data.monthly_income ?? storedProfile?.monthly_income ?? 0,
          monthly_expenses: res.data.monthly_expenses ?? storedProfile?.monthly_expenses ?? 0,
          savings_target: res.data.savings_target ?? res.data.monthly_savings ?? storedProfile?.savings_target ?? storedProfile?.monthly_savings ?? 0,
          bank_yield_rate: res.data.bank_yield_rate ?? res.data.bank_annual_yield ?? storedProfile?.bank_yield_rate ?? 19,
          currency_preference: res.data.currency_preference ?? storedProfile?.currency_preference ?? 'UZS'
        }
        setProfile(mergedProfile)
        setAccountDraft({
          monthly_income: String(mergedProfile.monthly_income ?? 0),
          monthly_expenses: String(mergedProfile.monthly_expenses ?? 0),
          savings_target: String(mergedProfile.savings_target ?? mergedProfile.monthly_savings ?? 0),
          bank_yield_rate: String(mergedProfile.bank_yield_rate ?? mergedProfile.bank_annual_yield ?? 19),
          currency_preference: mergedProfile.currency_preference ?? 'UZS'
        })
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('finora_user_profile', JSON.stringify(mergedProfile))
        }
      } else if (storedProfile) {
        setProfile(storedProfile)
        setAccountDraft({
          monthly_income: String(storedProfile.monthly_income ?? 0),
          monthly_expenses: String(storedProfile.monthly_expenses ?? 0),
          savings_target: String(storedProfile.savings_target ?? storedProfile.monthly_savings ?? 0),
          bank_yield_rate: String(storedProfile.bank_yield_rate ?? storedProfile.bank_annual_yield ?? 19),
          currency_preference: storedProfile.currency_preference ?? 'UZS'
        })
      }
    })
  }, [user])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('finora_plan', isPro ? 'pro' : 'free')
    }
  }, [isPro])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('finora_goals', JSON.stringify(goals))
    }
  }, [goals])

  useEffect(() => {
    const storedDebts = (() => {
      if (typeof window === 'undefined') return []
      try {
        const raw = window.localStorage.getItem('finora_debts')
        return raw ? JSON.parse(raw) : []
      } catch {
        return []
      }
    })()

    if (storedDebts.length > 0) {
      setDebts(storedDebts)
      return
    }

    if (!user?.id) return

    supabase.from('debts').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).then(({ data, error }) => {
      if (!error && data) {
        const mapped = data.map((item: any) => ({
          id: String(item.id),
          name: item.name,
          total: Number(item.total_amount ?? 0),
          remaining: Number(item.remaining_amount ?? item.total_amount ?? 0),
          rate: Number(item.interest_rate ?? 0),
          payment: Number(item.monthly_payment ?? 0),
          dueDate: item.due_date ?? undefined
        }))
        setDebts(mapped)
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('finora_debts', JSON.stringify(mapped))
        }
      }
    })
  }, [user])

  const yearlyData = useMemo(() => {
    const timeline = [1, 3, 5, 10, 20]
    return timeline.map((value) => {
      const result = calculateCompoundProjection(initialDeposit, monthlyInvestment, annualRate, value)
      return {
        year: `${value}y`,
        total: result.total,
        contributions: result.contributions,
        interest: result.interest
      }
    })
  }, [initialDeposit, monthlyInvestment, annualRate])

  const currentProjection = useMemo(
    () => calculateCompoundProjection(initialDeposit, monthlyInvestment, annualRate, years),
    [initialDeposit, monthlyInvestment, annualRate, years]
  )

  const debtOutcome = useMemo(() => {
    const loan = Number(debtDraft.total) || 0
    const rate = Number(debtDraft.rate) || 0
    const payment = Number(debtDraft.payment) || 0
    if (!loan || !payment) return { months: 0, totalPaid: 0 }

    let balance = loan
    const monthlyRate = rate / 100 / 12
    let months = 0
    while (balance > 0 && months < 600) {
      const interest = balance * monthlyRate
      const principal = payment - interest
      if (principal <= 0) break
      balance = Math.max(0, balance - principal)
      months += 1
    }

    return { months, totalPaid: months * payment }
  }, [debtDraft])

  const childProjection = useMemo(() => {
    const futureYears = Math.max(childFund.targetAge - childFund.currentAge, 0)
    if (!futureYears) return { total: childFund.currentSavings, contributions: childFund.currentSavings, interest: 0 }

    const months = futureYears * 12
    const monthlyRate = childFund.annualRate / 100 / 12
    let balance = childFund.currentSavings
    let contributions = childFund.currentSavings

    for (let month = 1; month <= months; month += 1) {
      balance = (balance + childFund.monthly) * (1 + monthlyRate)
      contributions += childFund.monthly
    }

    return {
      total: Math.round(balance),
      contributions: Math.round(contributions),
      interest: Math.round(balance - contributions)
    }
  }, [childFund])

  const navTabs: Array<{ key: TabKey; label: string; icon: string }> = [
    { key: 'home', label: t('home_tab'), icon: '🏠' },
    { key: 'account', label: t('account_tab'), icon: '👤' },
    { key: 'goals', label: t('goals_tab'), icon: '🎯' },
    { key: 'calculators', label: t('calculators_tab'), icon: '🧮' }
  ]

  const persistGoals = (nextGoals: Goal[]) => {
    setGoals(nextGoals)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('finora_goals', JSON.stringify(nextGoals))
    }
  }

  const updateGoal = (goalId: number, deltaAmount: number) => {
    const nextGoals = goals.map((goal) =>
      goal.id === goalId ? { ...goal, current: Math.min(goal.target, goal.current + deltaAmount) } : goal
    )
    persistGoals(nextGoals)
  }

  const deleteGoal = () => {
    if (!goalToDelete) return
    const nextGoals = goals.filter((goal) => goal.id !== goalToDelete.id)
    persistGoals(nextGoals)
    setGoalToDelete(null)
    setIsDeleteGoalOpen(false)
  }

  const addGoal = () => {
    const trimmedName = goalForm.name.trim()
    const targetValue = Number(goalForm.target)
    const currentValue = Number(goalForm.current)
    const monthlyValue = Number(goalForm.monthly)

    if (!trimmedName || !Number.isFinite(targetValue) || targetValue <= 0) {
      return
    }

    if (!isPro && goals.length >= 5) {
      setIsGoalModalOpen(false)
      setIsUpgradeOpen(true)
      return
    }

    const nextGoals = [
      ...goals,
      {
        id: Date.now(),
        name: trimmedName,
        target: targetValue,
        current: Number.isFinite(currentValue) ? currentValue : 0,
        monthly: Number.isFinite(monthlyValue) ? monthlyValue : 0
      }
    ]
    persistGoals(nextGoals)
    setGoalForm({ name: '', target: '', current: '', monthly: '' })
    setIsGoalModalOpen(false)
  }

  const addDebt = async (event?: React.FormEvent) => {
    event?.preventDefault()

    const name = debtDraft.name.trim() || t('debt_other')
    const total = Number(debtDraft.total) || 0
    const payment = Number(debtDraft.payment) || 0
    const rate = Number(debtDraft.rate) || 0

    if (total <= 0 || payment <= 0) return

    if (debts.length >= debtLimit) {
      setPromoNotice(isPro ? t('debt_limit_pro') : t('debt_limit_free'))
      setIsUpgradeOpen(true)
      return
    }

    const newDebt: Debt = {
      id: generateDebtId(),
      name,
      total,
      remaining: total,
      rate,
      payment,
      dueDate: new Date(Date.now() + Math.ceil(total / payment) * 30 * 24 * 60 * 60 * 1000).toISOString()
    }

    const nextDebts = [...debts, newDebt]
    persistDebts(nextDebts)

    if (user?.id) {
      try {
        await supabase.from('debts').upsert({
          id: newDebt.id,
          user_id: user.id,
          name: newDebt.name,
          total_amount: newDebt.total,
          remaining_amount: newDebt.remaining,
          interest_rate: newDebt.rate,
          monthly_payment: newDebt.payment,
          due_date: newDebt.dueDate ? newDebt.dueDate.slice(0, 10) : new Date().toISOString().slice(0, 10)
        }, { onConflict: 'id' })
      } catch {
        // fallback already kept in localStorage; no-op
      }
    }

    setDebtDraft({ name: debtCategories[0]?.value || 'Автокредит', total: '', payment: '', rate: '0' })
    setPromoNotice(t('debt_added_success'))
  }

  const makeDebtPayment = (debtId: string) => {
    const nextDebts = debts.map((debt) => {
      if (debt.id !== debtId) return debt
      const nextRemaining = Math.max(0, debt.remaining - debt.payment)
      return { ...debt, remaining: nextRemaining }
    })
    persistDebts(nextDebts)

    if (user?.id) {
      const debt = debts.find((item) => item.id === debtId)
      if (debt) {
        const updated = { ...debt, remaining: Math.max(0, debt.remaining - debt.payment) }
        void supabase.from('debts').upsert({
          id: updated.id,
          user_id: user.id,
          name: updated.name,
          total_amount: updated.total,
          remaining_amount: updated.remaining,
          interest_rate: updated.rate,
          monthly_payment: updated.payment,
          due_date: updated.dueDate ? updated.dueDate.slice(0, 10) : new Date().toISOString().slice(0, 10)
        }, { onConflict: 'id' })
      }
    }
  }

  const removeDebt = async () => {
    if (!debtToDelete) return
    const nextDebts = debts.filter((debt) => debt.id !== debtToDelete.id)
    persistDebts(nextDebts)

    if (user?.id && debtToDelete.id) {
      try {
        await supabase.from('debts').delete().eq('id', debtToDelete.id)
      } catch {
        // local fallback remains authoritative
      }
    }

    setDebtToDelete(null)
    setIsDebtDeleteOpen(false)
  }

  const saveAccount = async () => {
    const payload = {
      monthly_income: Number(accountDraft.monthly_income || 0),
      monthly_expenses: Number(accountDraft.monthly_expenses || 0),
      savings_target: Number(accountDraft.savings_target || 0),
      bank_yield_rate: Number(accountDraft.bank_yield_rate || 0),
      currency_preference: accountDraft.currency_preference || 'UZS'
    }

    const localProfile = {
      ...(profile ?? {}),
      ...payload,
      monthly_savings: payload.savings_target,
      bank_annual_yield: payload.bank_yield_rate
    }

    setProfile(localProfile)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('finora_user_profile', JSON.stringify(localProfile))
      window.localStorage.setItem('finora_profile', JSON.stringify(localProfile))
    }

    if (!user?.id) {
      setToast(t('profile_updated_success'))
      setIsAccountModalOpen(false)
      return
    }

    setSavingAccount(true)

    try {
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        monthly_income: payload.monthly_income,
        monthly_expenses: payload.monthly_expenses,
        monthly_savings: payload.savings_target,
        bank_annual_yield: payload.bank_yield_rate
      }, { onConflict: 'id' })

      if (error) {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('finora_user_profile', JSON.stringify(localProfile))
        }
        setToast(t('profile_updated_success'))
      } else {
        setToast(t('profile_updated_success'))
      }
    } catch (error) {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('finora_user_profile', JSON.stringify(localProfile))
      }
      setToast(t('profile_updated_success'))
    } finally {
      setSavingAccount(false)
      setIsAccountModalOpen(false)
    }
  }

  const applyPromoCode = async (event?: React.FormEvent) => {
    event?.preventDefault()
    const validCode = 'Liverpool@0'
    const trimmedCode = promoCode.trim()

    if (trimmedCode !== validCode) {
      setPromoNotice(t('invalid_promo'))
      return
    }

    if (!user?.id) {
      setPromoNotice(t('session_missing'))
      return
    }

    const activated = await activatePro()
    if (activated) {
      setProfile((prev: any) => ({ ...prev, subscription_status: 'pro', trial_end: null }))
      await refreshSubscription()
      setPromoNotice(t('pro_activated'))
      setPromoCode('')
      setIsUpgradeOpen(false)
      return
    }

    setPromoNotice(t('session_missing'))
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  const balanceHealth = Math.max(0, Math.min(100, Math.round(((Number(profile?.monthly_savings || 0) || 0) / Math.max(Number(profile?.monthly_income || 0), 1)) * 100)))

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-10">
      <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_35px_rgba(15,23,42,0.07)] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">{t('dashboard')}</p>
          <h1 className="mt-2 text-3xl font-black text-slate-900">{t('welcome_back')}</h1>
        </div>
        <div className="flex items-center gap-3">
          {isPro && (
            <span className="rounded-full border border-[#D4AF37] bg-[#FFF8D6] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#7C4A00]">
              FINORA PRO
            </span>
          )}
          <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700">
            {profile?.full_name || user?.email || 'Finora User'}
          </div>
          <button onClick={handleLogout} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            {t('logout')}
          </button>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-3 shadow-[0_18px_35px_rgba(15,23,42,0.07)]">
        <div className="flex flex-wrap gap-2">
          {navTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                activeTab === tab.key
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'home' && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{t('monthly_income')}</div>
              <div className="mt-3 text-2xl font-black text-slate-900">
                {formatMoney(Number(profile?.monthly_income || 0))} <span className="text-sm font-medium text-slate-500">UZS</span>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{t('monthly_expenses')}</div>
              <div className="mt-3 text-2xl font-black text-slate-900">
                {formatMoney(Number(profile?.monthly_expenses || 0))} <span className="text-sm font-medium text-slate-500">UZS</span>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{t('net_savings_health')}</div>
              <div className="mt-3 text-2xl font-black text-slate-900">{balanceHealth}%</div>
              <div className="mt-1 text-sm text-slate-500">{t('financial_health')}</div>
            </div>
          </div>

          {isPro && (
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_35px_rgba(15,23,42,0.07)]">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">{t('budget_optimizer')}</p>
                  <h3 className="mt-2 text-2xl font-black text-slate-900">{t('budget_50_30_20')}</h3>
                </div>
                <span className="rounded-full bg-[#FFF8D6] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#7C4A00]">PRO</span>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{t('needs')}</div>
                  <div className="mt-2 text-xl font-black text-slate-900">{formatMoney((Number(profile?.monthly_income || 0) * 0.5))} UZS</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{t('wants')}</div>
                  <div className="mt-2 text-xl font-black text-slate-900">{formatMoney((Number(profile?.monthly_income || 0) * 0.3))} UZS</div>
                </div>
                <div className="rounded-2xl bg-[#FFF8D6] p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-[#7C4A00]">{t('wealth_savings')}</div>
                  <div className="mt-2 text-xl font-black text-[#7C4A00]">{formatMoney((Number(profile?.monthly_income || 0) * 0.2))} UZS</div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-700">
                {Number(profile?.monthly_expenses || 0) > Number(profile?.monthly_income || 0) * 0.5
                  ? t('budget_over_50')
                  : t('budget_on_track')}
              </div>
            </div>
          )}

          <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_35px_rgba(15,23,42,0.07)]">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">{t('calculator')}</p>
                  <h2 className="mt-2 text-2xl font-black text-slate-900">{t('banking_growth')}</h2>
                </div>
                <div className="rounded-full bg-[#FFF8D6] px-3 py-1 text-xs font-semibold text-[#8B5E00]">19% {t('deposit')}</div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">{t('initial_deposit')}</label>
                  <input type="number" value={initialDeposit} onChange={(e) => setInitialDeposit(Number(e.target.value) || 0)} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-[#D4AF37]" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">{t('monthly_investment')}</label>
                  <input type="number" value={monthlyInvestment} onChange={(e) => setMonthlyInvestment(Number(e.target.value) || 0)} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-[#D4AF37]" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">{t('annual_rate')}</label>
                  <input type="number" value={annualRate} onChange={(e) => setAnnualRate(Number(e.target.value) || 0)} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-[#D4AF37]" />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <label className="text-sm font-medium text-slate-700">{t('years')}</label>
                <input type="range" min={1} max={20} value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full accent-[#D4AF37]" />
                <span className="w-12 text-right text-sm font-semibold text-slate-700">{years}y</span>
              </div>

              <div className="mt-6 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yearlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="year" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip formatter={(value: number) => `${formatMoney(Number(value))} UZS`} />
                    <Bar dataKey="contributions" fill="#94a3b8" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="interest" fill="#D4AF37" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <aside className="rounded-[28px] border border-[#F8D66D]/30 bg-gradient-to-br from-[#111827] via-[#0F172A] to-[#1E293B] p-5 text-white shadow-[0_20px_50px_rgba(15,23,42,0.2)]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FDE68A]">{t('pro')}</p>
              <h3 className="mt-2 text-2xl font-black text-white">{t('golden_pro')}</h3>
              <div className="mt-4 rounded-2xl border border-[#FFD700]/20 bg-[#FFD700]/10 p-4 text-center">
                <div className="text-3xl font-black text-[#FFD700]">100 000 UZS</div>
                <div className="mt-1 text-sm text-slate-200">{t('per_month')}</div>
              </div>
              <button type="button" onClick={() => setIsUpgradeOpen(true)} className="mt-5 w-full rounded-xl bg-gradient-to-r from-[#FFD700] via-[#F59E0B] to-[#D4AF37] px-4 py-3 text-base font-black text-slate-900">
                {t('upgrade_pro_button')}
              </button>

              <div className="mt-6 space-y-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">{t('goal_limit_pro')}</div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">{t('feature_compound_interest_simulator')}</div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">{t('feature_goal_predictor')}</div>
              </div>
            </aside>
          </div>
        </>
      )}

      {activeTab === 'account' && (
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_35px_rgba(15,23,42,0.07)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">{t('account_tab')}</p>
              <h2 className="mt-2 text-2xl font-black text-slate-900">{t('financial_profile')}</h2>
            </div>
            <button type="button" onClick={() => setIsAccountModalOpen(true)} className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">
              {t('edit_profile')}
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{t('monthly_income')}</div>
              <div className="mt-2 text-2xl font-black text-slate-900">{formatMoney(Number(profile?.monthly_income || 0))} UZS</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{t('total_expenses')}</div>
              <div className="mt-2 text-2xl font-black text-slate-900">{formatMoney(Number(profile?.monthly_expenses || 0))} UZS</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{t('monthly_savings_target')}</div>
              <div className="mt-2 text-2xl font-black text-slate-900">{formatMoney(Number(profile?.monthly_savings || 0))} UZS</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'goals' && (
        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_35px_rgba(15,23,42,0.07)]">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">{t('goals')}</p>
              <h2 className="mt-2 text-2xl font-black text-slate-900">{t('financial_goals')}</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {goals.length}/{limit}
              </span>
              <button type="button" onClick={() => setIsGoalModalOpen(true)} className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
                {t('add_goal')}
              </button>
            </div>
          </div>

          {!isPro && (
            <div className="mb-5 rounded-2xl border border-[#F9E5A8] bg-[#FFF8D6] p-3 text-sm font-medium text-[#7C4A00]">
              {t('goal_limit_free')}
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            {goals.map((goal) => {
              const progress = getGoalProgress(goal)
              const countdown = getGoalCountdown(goal)

              return (
                <div key={goal.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-lg font-bold text-slate-900">{goal.name}</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{formatMoney(goal.monthly)} UZS / {t('month')}</div>
                    </div>
                    <div className="text-sm font-semibold text-[#B7791F]">{progress.toFixed(0)}%</div>
                  </div>
                  <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#FFD700] via-[#F59E0B] to-[#D4AF37]" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                    <span>{formatMoney(goal.current)} UZS</span>
                    <span>{formatMoney(goal.target)} UZS</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-xs uppercase tracking-[0.18em] text-slate-500">{countdown.text}</span>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => updateGoal(goal.id, 100000)} className="rounded-xl bg-gradient-to-r from-[#FFD700] via-[#F59E0B] to-[#D4AF37] px-3 py-2 text-xs font-bold text-slate-900">
                        {t('add_funds')}
                      </button>
                      <button type="button" onClick={() => {
                        setGoalToDelete(goal)
                        setIsDeleteGoalOpen(true)
                      }} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700">
                        {t('delete')}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {activeTab === 'calculators' && (
        <div className="space-y-6">
          {isPro && (
            <>
              <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_35px_rgba(15,23,42,0.07)]">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">PRO</p>
                    <h2 className="mt-2 text-2xl font-black text-slate-900">{t('multi_currency_portfolio')}</h2>
                  </div>
                  <span className="rounded-full bg-[#FFF8D6] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#7C4A00]">PRO</span>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">UZS</label>
                    <input type="number" value={portfolio.uzs} onChange={(e) => setPortfolio((prev) => ({ ...prev, uzs: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-[#D4AF37]" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">USD</label>
                    <input type="number" value={portfolio.usd} onChange={(e) => setPortfolio((prev) => ({ ...prev, usd: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-[#D4AF37]" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">EUR</label>
                    <input type="number" value={portfolio.eur} onChange={(e) => setPortfolio((prev) => ({ ...prev, eur: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-[#D4AF37]" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">RUB</label>
                    <input type="number" value={portfolio.rub} onChange={(e) => setPortfolio((prev) => ({ ...prev, rub: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-[#D4AF37]" />
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{t('converted_total_uzs')}</div>
                    <div className="mt-2 text-2xl font-black text-slate-900">{formatMoney(Number((Number(portfolio.uzs) + Number(portfolio.usd) * 12800 + Number(portfolio.eur) * 13800 + Number(portfolio.rub) * 155).toFixed(0)))} UZS</div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-500">USD</div>
                    <div className="mt-2 text-2xl font-black text-slate-900">{formatMoney(Number(portfolio.usd) * 12800)} UZS</div>
                  </div>
                  <div className="rounded-2xl bg-[#FFF8D6] p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-[#7C4A00]">{t('hedge_status')}</div>
                    <div className="mt-2 text-xl font-black text-[#7C4A00]">{t('inflation_defense')}</div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-lg font-black text-slate-900">{t('inflation_defense')}</h3>
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    {[1, 3, 5].map((year) => {
                      const uzsPower = (Number(portfolio.uzs) || 0) / Math.pow(1.09, year)
                      const usdPower = ((Number(portfolio.usd) * 12800) || 0) / Math.pow(1.025, year)

                      return (
                        <div key={year} className="rounded-2xl bg-white p-4 shadow-sm">
                          <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{year} {t('years')}</div>
                          <div className="mt-2 text-sm text-slate-700">UZS: {formatMoney(uzsPower)} UZS</div>
                          <div className="mt-1 text-sm text-slate-700">USD: {formatMoney(usdPower)} UZS</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </section>

              <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_35px_rgba(15,23,42,0.07)]">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">PRO</p>
                    <h2 className="mt-2 text-2xl font-black text-slate-900">{t('business_roi')}</h2>
                  </div>
                  <span className="rounded-full bg-[#FFF8D6] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#7C4A00]">PRO</span>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">{t('initial_investment')}</label>
                    <input type="number" value={businessModel.initialInvestment} onChange={(e) => setBusinessModel((prev) => ({ ...prev, initialInvestment: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-[#D4AF37]" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">{t('fixed_business_expenses')}</label>
                    <input type="number" value={businessModel.fixedExpenses} onChange={(e) => setBusinessModel((prev) => ({ ...prev, fixedExpenses: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-[#D4AF37]" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">{t('profit_per_sale')}</label>
                    <input type="number" value={businessModel.avgProfit} onChange={(e) => setBusinessModel((prev) => ({ ...prev, avgProfit: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-[#D4AF37]" />
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{t('break_even_point')}</div>
                    <div className="mt-2 text-2xl font-black text-slate-900">
                      {formatMoney(Math.max(0, Number(businessModel.fixedExpenses) / Math.max(Number(businessModel.avgProfit), 1)))} {t('sales_per_month')}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-[#FFF8D6] p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-[#7C4A00]">{t('roi_payoff_horizon')}</div>
                    <div className="mt-2 text-2xl font-black text-[#7C4A00]">
                      {Math.max(1, Math.ceil(Number(businessModel.initialInvestment) / Math.max((Number(businessModel.avgProfit) * Math.max(Number(businessModel.fixedExpenses) / Math.max(Number(businessModel.avgProfit), 1) * 1.25) - Number(businessModel.fixedExpenses)), 1)))} {t('months')}
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_35px_rgba(15,23,42,0.07)]">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">PRO</p>
                    <h2 className="mt-2 text-2xl font-black text-slate-900">{t('debt_speedup')}</h2>
                  </div>
                  <span className="rounded-full bg-[#FFF8D6] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#7C4A00]">PRO</span>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">{t('total_loan_amount')}</label>
                    <input type="number" value={debtSpeedup.totalLoan} onChange={(e) => setDebtSpeedup((prev) => ({ ...prev, totalLoan: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-[#D4AF37]" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">{t('annual_interest_rate')}</label>
                    <input type="number" value={debtSpeedup.annualRate} onChange={(e) => setDebtSpeedup((prev) => ({ ...prev, annualRate: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-[#D4AF37]" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">{t('monthly_payment')}</label>
                    <input type="number" value={debtSpeedup.minimumPayment} onChange={(e) => setDebtSpeedup((prev) => ({ ...prev, minimumPayment: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-[#D4AF37]" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">{t('extra_monthly_contribution')}</label>
                    <input type="number" value={debtSpeedup.extraPayment} onChange={(e) => setDebtSpeedup((prev) => ({ ...prev, extraPayment: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-[#D4AF37]" />
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{t('standard_payoff')}</div>
                    <div className="mt-2 text-xl font-black text-slate-900">{Math.ceil(Number(debtSpeedup.totalLoan) / Math.max(Number(debtSpeedup.minimumPayment), 1))} {t('months')}</div>
                  </div>
                  <div className="rounded-2xl bg-[#FFF8D6] p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-[#7C4A00]">{t('fast_track')}</div>
                    <div className="mt-2 text-xl font-black text-[#7C4A00]">{Math.ceil(Number(debtSpeedup.totalLoan) / Math.max(Number(debtSpeedup.minimumPayment) + Number(debtSpeedup.extraPayment), 1))} {t('months')}</div>
                  </div>
                </div>

                <div className="mt-6 h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: t('payoff_timeline'), standard: Math.ceil(Number(debtSpeedup.totalLoan) / Math.max(Number(debtSpeedup.minimumPayment), 1)), fast: Math.ceil(Number(debtSpeedup.totalLoan) / Math.max(Number(debtSpeedup.minimumPayment) + Number(debtSpeedup.extraPayment), 1)) },
                      { name: t('interest_saved'), standard: Math.round((Number(debtSpeedup.totalLoan) * Number(debtSpeedup.annualRate) / 100) / 12), fast: Math.round(((Number(debtSpeedup.totalLoan) * Number(debtSpeedup.annualRate) / 100) / 12) * 0.7) }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip formatter={(value: number) => `${formatMoney(Number(value))} UZS`} />
                      <Bar dataKey="standard" fill="#94a3b8" radius={[8,8,0,0]} />
                      <Bar dataKey="fast" fill="#D4AF37" radius={[8,8,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                  {t('interest_saved_summary', { amount: formatMoney(Math.max(0, ((Number(debtSpeedup.totalLoan) * Number(debtSpeedup.annualRate) / 100) / 12) * 0.3)) })}
                </div>
              </section>
            </>
          )}

          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_35px_rgba(15,23,42,0.07)]">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">{t('calculator')}</p>
                <h2 className="mt-2 text-2xl font-black text-slate-900">{t('banking_growth')}</h2>
              </div>
              <div className="rounded-full bg-[#FFF8D6] px-3 py-1 text-xs font-semibold text-[#8B5E00]">19% {t('deposit')}</div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">{t('initial_deposit')}</label>
                <input type="number" value={initialDeposit} onChange={(e) => setInitialDeposit(Number(e.target.value) || 0)} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-[#D4AF37]" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">{t('monthly_investment')}</label>
                <input type="number" value={monthlyInvestment} onChange={(e) => setMonthlyInvestment(Number(e.target.value) || 0)} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-[#D4AF37]" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">{t('annual_rate')}</label>
                <input type="number" value={annualRate} onChange={(e) => setAnnualRate(Number(e.target.value) || 0)} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-[#D4AF37]" />
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-100 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{t('contributions')}</div>
                <div className="mt-2 text-xl font-black text-slate-900">{formatMoney(currentProjection.contributions)} UZS</div>
              </div>
              <div className="rounded-2xl bg-slate-100 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{t('interest_earned')}</div>
                <div className="mt-2 text-xl font-black text-[#B7791F]">{formatMoney(currentProjection.interest)} UZS</div>
              </div>
              <div className="rounded-2xl bg-[#FFF8D6] p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-[#7C4A00]">{t('final_amount')}</div>
                <div className="mt-2 text-xl font-black text-[#7C4A00]">{formatMoney(currentProjection.total)} UZS</div>
              </div>
            </div>

            <div className="mt-6 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip formatter={(value: number) => `${formatMoney(Number(value))} UZS`} />
                  <Bar dataKey="contributions" fill="#94a3b8" radius={[8,8,0,0]} />
                  <Bar dataKey="interest" fill="#D4AF37" radius={[8,8,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_35px_rgba(15,23,42,0.07)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">{t('child_future_fund')}</p>
                <h2 className="mt-2 text-2xl font-black text-slate-900">{t('child_fund')}</h2>
              </div>
              {!isPro && <span className="rounded-full bg-[#FFF8D6] px-3 py-1 text-xs font-semibold text-[#7C4A00]">{t('pro_required')}</span>}
            </div>

            {isPro ? (
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">{t('child_age')}</label>
                  <input type="number" value={childFund.currentAge} onChange={(e) => setChildFund((prev) => ({ ...prev, currentAge: Number(e.target.value) || 0 }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-[#D4AF37]" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">{t('target_age')}</label>
                  <input type="number" value={childFund.targetAge} onChange={(e) => setChildFund((prev) => ({ ...prev, targetAge: Number(e.target.value) || 0 }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-[#D4AF37]" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">{t('monthly_contribution')}</label>
                  <input type="number" value={childFund.monthly} onChange={(e) => setChildFund((prev) => ({ ...prev, monthly: Number(e.target.value) || 0 }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-[#D4AF37]" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">{t('annual_rate')}</label>
                  <input type="number" value={childFund.annualRate} onChange={(e) => setChildFund((prev) => ({ ...prev, annualRate: Number(e.target.value) || 0 }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-[#D4AF37]" />
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
                {t('pro_required_desc')}
              </div>
            )}

            {isPro && (
              <div className="mt-6 rounded-2xl bg-[#FFF8D6] p-4">
                <div className="text-sm font-medium uppercase tracking-[0.18em] text-[#7C4A00]">{t('projected_total')}</div>
                <div className="mt-2 text-3xl font-black text-slate-900">{formatMoney(childProjection.total)} UZS</div>
              </div>
            )}
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_35px_rgba(15,23,42,0.07)]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">{t('debt_manager')}</p>
              <h2 className="mt-2 text-2xl font-black text-slate-900">{t('debt_manager')}</h2>
            </div>

            <form onSubmit={addDebt} className="mt-5 space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">{t('loan_name')}</label>
                  <select value={debtDraft.name} onChange={(e) => setDebtDraft((prev) => ({ ...prev, name: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-[#D4AF37]">
                    {debtCategories.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">{t('total_amount')}</label>
                  <input type="number" value={debtDraft.total} onChange={(e) => setDebtDraft((prev) => ({ ...prev, total: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-[#D4AF37]" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">{t('monthly_payment')}</label>
                  <input type="number" value={debtDraft.payment} onChange={(e) => setDebtDraft((prev) => ({ ...prev, payment: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-[#D4AF37]" />
                </div>
              </div>

              <div className="flex items-end justify-between gap-3">
                <div className="w-full max-w-xs">
                  <label className="mb-1 block text-sm font-medium text-slate-700">{t('annual_rate')}</label>
                  <input type="number" value={debtDraft.rate} onChange={(e) => setDebtDraft((prev) => ({ ...prev, rate: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-[#D4AF37]" />
                </div>
                <button type="submit" className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
                  {t('add_debt')}
                </button>
              </div>
            </form>

            <div className="mt-6 space-y-4">
              {debts.length > 0 ? debts.map((debt) => {
                const payoffMonths = getDebtPayoffMonths(debt)
                const progress = debt.total > 0 ? Math.max(0, (debt.remaining / debt.total) * 100) : 0
                return (
                  <div key={debt.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-lg font-black text-slate-900">{debt.name}</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">{t('debt_closes_in', { months: payoffMonths })}</div>
                      </div>
                      <div className="rounded-full bg-[#FFF8D6] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#7C4A00]">{debt.rate}%</div>
                    </div>

                    <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#FFD700] via-[#F59E0B] to-[#D4AF37]" style={{ width: `${100 - progress}%` }} />
                    </div>

                    <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                      <span>{formatMoney(debt.remaining)} UZS</span>
                      <span>{formatMoney(debt.total)} UZS</span>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="text-sm text-slate-600">{t('payoff_estimate')}: {payoffMonths} {t('months')} · {getDebtCompletionDate(debt)}</div>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => makeDebtPayment(debt.id)} className="rounded-xl bg-gradient-to-r from-[#FFD700] via-[#F59E0B] to-[#D4AF37] px-3 py-2 text-xs font-bold text-slate-900">
                          {t('make_payment')}
                        </button>
                        <button type="button" onClick={() => {
                          setDebtToDelete(debt)
                          setIsDebtDeleteOpen(true)
                        }} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700">
                          {t('delete')}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              }) : <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">{t('debt_empty')}</div>}
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <div className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">{t('payoff_estimate')}</div>
              <div className="mt-2 text-2xl font-black text-slate-900">{debtOutcome.months} {t('months')}</div>
              <div className="mt-1 text-sm text-slate-600">{formatMoney(debtOutcome.totalPaid)} UZS</div>
            </div>
          </section>
        </div>
      )}

      {isUpgradeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-lg rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">{t('upgrade')}</p>
                <h3 className="mt-2 text-2xl font-black text-slate-900">{t('unlock_pro')}</h3>
              </div>
              <button type="button" onClick={() => setIsUpgradeOpen(false)} className="text-xl text-slate-500">×</button>
            </div>

            <div className="mt-5 rounded-2xl bg-[#FFF8D6] p-4 text-slate-900">
              <div className="text-lg font-black">100 000 UZS / {t('month')}</div>
              <div className="mt-1 text-sm text-slate-700">{t('upgrade_desc')}</div>
            </div>

            <form onSubmit={applyPromoCode} className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <label className="mb-2 block text-sm font-medium text-slate-700">{t('promo_placeholder')}</label>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder={t('promo_placeholder')}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none focus:border-[#D4AF37]"
              />
              <div className="mt-3 flex gap-2">
                <button type="submit" className="flex-1 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#F59E0B] to-[#D4AF37] px-4 py-3 font-bold text-slate-900">
                  {t('continue')}
                </button>
              </div>
              {promoNotice && <div className="mt-3 text-sm font-medium text-[#7C4A00]">{promoNotice}</div>}
            </form>

            <div className="mt-6 flex gap-3">
              <a href="https://t.me/Bilol_44" target="_blank" rel="noreferrer" className="flex-1 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#F59E0B] to-[#D4AF37] px-4 py-3 text-center font-bold text-slate-900">
                {t('contact_telegram')}
              </a>
              <button type="button" onClick={() => setIsUpgradeOpen(false)} className="rounded-xl border border-slate-200 px-4 py-3 font-medium text-slate-700">
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {isDebtDeleteOpen && debtToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-slate-900">{t('delete')}</h3>
              <button type="button" onClick={() => {
                setDebtToDelete(null)
                setIsDebtDeleteOpen(false)
              }} className="text-xl text-slate-500">×</button>
            </div>
            <p className="mt-4 text-sm text-slate-600">{t('delete_goal_confirm', { name: debtToDelete.name })}</p>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={removeDebt} className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-bold text-white">
                {t('delete')}
              </button>
              <button type="button" onClick={() => {
                setDebtToDelete(null)
                setIsDebtDeleteOpen(false)
              }} className="rounded-xl border border-slate-200 px-4 py-3 font-medium text-slate-700">
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {isAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-slate-900">{t('edit_profile')}</h3>
              <button type="button" onClick={() => setIsAccountModalOpen(false)} className="text-xl text-slate-500">×</button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">{t('monthly_income')}</label>
                <input type="number" value={accountDraft.monthly_income} onChange={(e) => setAccountDraft((prev) => ({ ...prev, monthly_income: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-[#D4AF37]" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">{t('total_expenses')}</label>
                <input type="number" value={accountDraft.monthly_expenses} onChange={(e) => setAccountDraft((prev) => ({ ...prev, monthly_expenses: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-[#D4AF37]" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">{t('monthly_savings_target')}</label>
                <input type="number" value={accountDraft.savings_target} onChange={(e) => setAccountDraft((prev) => ({ ...prev, savings_target: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-[#D4AF37]" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">{t('bank_yield_rate')}</label>
                <input type="number" value={accountDraft.bank_yield_rate} onChange={(e) => setAccountDraft((prev) => ({ ...prev, bank_yield_rate: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-[#D4AF37]" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">{t('currency_preference')}</label>
                <select value={accountDraft.currency_preference} onChange={(e) => setAccountDraft((prev) => ({ ...prev, currency_preference: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-[#D4AF37]">
                  <option value="UZS">UZS</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="RUB">RUB</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button type="button" disabled={savingAccount} onClick={saveAccount} className="flex-1 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#F59E0B] to-[#D4AF37] px-4 py-3 font-bold text-slate-900 disabled:cursor-not-allowed disabled:opacity-70">
                {savingAccount ? '⏳' : t('save')}
              </button>
              <button type="button" onClick={() => setIsAccountModalOpen(false)} className="rounded-xl border border-slate-200 px-4 py-3 font-medium text-slate-700">
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed right-4 top-4 z-[60] rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 shadow-lg">
          {toast}
        </div>
      )}

      {isDeleteGoalOpen && goalToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
            <h3 className="text-2xl font-black text-slate-900">{t('delete_goal')}</h3>
            <p className="mt-3 text-sm text-slate-600">{t('delete_goal_confirm', { name: goalToDelete.name })}</p>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={deleteGoal} className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-bold text-white">
                {t('delete')}
              </button>
              <button type="button" onClick={() => {
                setGoalToDelete(null)
                setIsDeleteGoalOpen(false)
              }} className="rounded-xl border border-slate-200 px-4 py-3 font-medium text-slate-700">
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-slate-900">{t('add_goal')}</h3>
              <button type="button" onClick={() => setIsGoalModalOpen(false)} className="text-xl text-slate-500">×</button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">{t('goal_name')}</label>
                <input value={goalForm.name} onChange={(e) => setGoalForm((prev) => ({ ...prev, name: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-[#D4AF37]" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">{t('target_amount')}</label>
                <input type="number" value={goalForm.target} onChange={(e) => setGoalForm((prev) => ({ ...prev, target: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-[#D4AF37]" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">{t('current_saved')}</label>
                <input type="number" value={goalForm.current} onChange={(e) => setGoalForm((prev) => ({ ...prev, current: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-[#D4AF37]" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">{t('monthly_contribution')}</label>
                <input type="number" value={goalForm.monthly} onChange={(e) => setGoalForm((prev) => ({ ...prev, monthly: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none focus:border-[#D4AF37]" />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button type="button" onClick={addGoal} className="flex-1 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#F59E0B] to-[#D4AF37] px-4 py-3 font-bold text-slate-900">
                {t('save')}
              </button>
              <button type="button" onClick={() => setIsGoalModalOpen(false)} className="rounded-xl border border-slate-200 px-4 py-3 font-medium text-slate-700">
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
