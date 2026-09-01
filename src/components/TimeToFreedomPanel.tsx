import React, { useMemo, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { calculateTimeToFreedom } from '../lib/timeToFreedom'
import { useCurrency } from '../context/CurrencyContext'
import { formatMoney as libFormatMoney } from '../lib/currency'

export default function TimeToFreedomPanel() {
  const { t } = useTranslation()
  const { currency } = useCurrency()
  const storedProfileRaw = typeof window !== 'undefined' ? window.localStorage.getItem('finora_user_profile') : null
  const storedProfile = storedProfileRaw ? JSON.parse(storedProfileRaw) : null

  const [mode, setMode] = useState<'monthly' | 'hourly'>('monthly')
  const [monthlyIncome, setMonthlyIncome] = useState<number>(storedProfile?.monthly_income ?? 5000000)
  const [hoursPerMonth, setHoursPerMonth] = useState<number>(160)
  const [hourlyIncome, setHourlyIncome] = useState<number>(0)
  const [purchasePrice, setPurchasePrice] = useState<number>(2000000)
  const [hoursPerDay, setHoursPerDay] = useState<number>(8)

  const useProfileIncome = () => {
    if (storedProfile?.monthly_income) setMonthlyIncome(Number(storedProfile.monthly_income))
  }

  const input = useMemo(() => {
    if (mode === 'monthly') return { monthlyIncome, hoursPerMonth, purchasePrice, hoursPerDay }
    return { hourlyIncome, purchasePrice, hoursPerDay }
  }, [mode, monthlyIncome, hoursPerMonth, hourlyIncome, purchasePrice, hoursPerDay])

  const result = useMemo(() => calculateTimeToFreedom({
    monthlyIncome: mode === 'monthly' ? Number(input.monthlyIncome) : undefined,
    hourlyIncome: mode === 'hourly' ? Number(input.hourlyIncome) : undefined,
    hoursPerMonth: Number(input.hoursPerMonth),
    purchasePrice: Number(input.purchasePrice),
    hoursPerDay: Number(input.hoursPerDay)
  }), [input, mode])

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const p = params.get('purchasePrice')
      if (p) setPurchasePrice(Number(p))
    } catch (e) {
      // ignore
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900">{t('time_to_freedom_title')}</h2>
          <div className="text-sm text-slate-500">{t('time_to_freedom_sub')}</div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">{t('input_mode')}</label>
            <div className="flex gap-2">
              <button type="button" onClick={() => setMode('monthly')} className={`rounded-xl px-3 py-2 ${mode === 'monthly' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>{t('monthly_income')}</button>
              <button type="button" onClick={() => setMode('hourly')} className={`rounded-xl px-3 py-2 ${mode === 'hourly' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>{t('hourly_income')}</button>
            </div>

            {mode === 'monthly' && (
              <>
                <label className="block text-sm text-slate-700">{t('monthly_income')}</label>
                <div className="flex gap-2">
                  <input value={monthlyIncome} onChange={(e) => setMonthlyIncome(Number(e.target.value || 0))} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900" />
                  <button type="button" onClick={useProfileIncome} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">{t('use_my_income')}</button>
                </div>

                <label className="block text-sm text-slate-700">{t('working_hours_per_month')}</label>
                <input value={hoursPerMonth} onChange={(e) => setHoursPerMonth(Number(e.target.value || 0))} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900" />
              </>
            )}

            {mode === 'hourly' && (
              <>
                <label className="block text-sm text-slate-700">{t('hourly_income')}</label>
                <input value={hourlyIncome} onChange={(e) => setHourlyIncome(Number(e.target.value || 0))} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900" />
              </>
            )}

            <label className="block text-sm text-slate-700">{t('purchase_price')}</label>
            <input value={purchasePrice} onChange={(e) => setPurchasePrice(Number(e.target.value || 0))} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900" />

            <label className="block text-sm text-slate-700">{t('working_hours_per_day')}</label>
            <input value={hoursPerDay} onChange={(e) => setHoursPerDay(Number(e.target.value || 0))} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900" />
          </div>

          <div className="rounded-2xl border border-[#F8D66D]/20 bg-gradient-to-br from-[#111827] via-[#0F172A] to-[#1E293B] p-6 text-white">
            <div className="text-sm uppercase tracking-[0.18em] text-[#FDE68A]">{t('time_cost')}</div>
            <div className="mt-4 text-4xl font-black text-[#FFD700]">{Math.round(result.hoursRequired || 0).toLocaleString('ru-RU')} {t('hours')}</div>
            <div className="mt-2 text-lg font-semibold">{Math.round(result.daysRequired || 0)} {t('working_days')}</div>
            <div className="mt-3 text-sm text-slate-200">{t('instead_of_price')} {libFormatMoney(purchasePrice, currency)}</div>
            {result.hourlyIncome > 0 && (
              <div className="mt-4 text-sm text-slate-200">{t('hourly_income_label')}: {libFormatMoney(Math.round(result.hourlyIncome), currency)}/{t('hour')}</div>
            )}
            {typeof result.percentOfMonthly === 'number' && (
              <div className="mt-2 text-sm text-slate-200">{t('percent_of_month')}: {Math.round(result.percentOfMonthly)}%</div>
            )}
            <div className="mt-4 text-sm text-slate-300">{t('time_to_freedom_explain')}</div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="text-sm font-semibold text-slate-700">{t('comparison')}</div>
        <div className="mt-3">
          <div className="text-sm text-slate-500">{t('purchase_price')}: {libFormatMoney(purchasePrice, currency)}</div>
          <div className="text-sm text-slate-500">{t('monthly_income')}: {libFormatMoney(monthlyIncome, currency)}</div>
          {monthlyIncome > 0 && (
            <div className="mt-2 text-lg font-black text-slate-900">{Math.round((purchasePrice / monthlyIncome) * 100)}% {t('of_monthly_income')}</div>
          )}
        </div>
      </div>
    </div>
  )
}
