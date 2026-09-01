import React, { useMemo, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { seriesFutureValues, futureValueMonthly } from '../lib/opportunityCost'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { useCurrency } from '../context/CurrencyContext'
import { formatMoney as libFormatMoney } from '../lib/currency'

export default function WhatIfPanel() {
  const { t } = useTranslation()
  const [amount, setAmount] = useState<number>(15000)
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [annualReturn, setAnnualReturn] = useState<number>(7)
  const [years, setYears] = useState<number>(20)
  const { currency } = useCurrency()

  const monthlyEquivalent = useMemo(() => {
    const a = Number(amount) || 0
    if (frequency === 'daily') return a * 30
    if (frequency === 'weekly') return a * (52 / 12)
    return a
  }, [amount, frequency])

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const a = params.get('amount')
      const f = params.get('frequency')
      if (a) setAmount(Number(a))
      if (f && (f === 'daily' || f === 'weekly' || f === 'monthly')) setFrequency(f as any)
    } catch (e) {
      // ignore
    }
  }, [])

  const months = years * 12
  const totalSpent = useMemo(() => monthlyEquivalent * months, [monthlyEquivalent, months])
  const futureValue = useMemo(() => futureValueMonthly(monthlyEquivalent, annualReturn, months), [monthlyEquivalent, annualReturn, months])
  const difference = futureValue - totalSpent

  const chartData = useMemo(() => {
    const series = seriesFutureValues(monthlyEquivalent, annualReturn, years)
    return series.map((s) => ({ year: s.year, spent: s.contributions, invested: Math.round(s.futureValue) }))
  }, [monthlyEquivalent, annualReturn, years])

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900">{t('what_if_title')}</h2>
          <div className="text-sm text-slate-500">{t('what_if_sub')}</div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div>
            <label className="block text-sm text-slate-700">{t('expense_amount')}</label>
            <input type="number" min="0" value={amount} onChange={(e) => setAmount(Number(e.target.value || 0))} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900" />
          </div>

          <div>
            <label className="block text-sm text-slate-700">{t('frequency')}</label>
            <select value={frequency} onChange={(e) => setFrequency(e.target.value as any)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900">
              <option value="daily">{t('daily')}</option>
              <option value="weekly">{t('weekly')}</option>
              <option value="monthly">{t('monthly')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-700">{t('annual_return')}</label>
            <input type="number" min="0" max="100" value={annualReturn} onChange={(e) => setAnnualReturn(Number(e.target.value || 0))} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900" />
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div>
            <label className="block text-sm text-slate-700">{t('period_years')}</label>
            <select value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900">
              <option value={1}>1 {t('year')}</option>
              <option value={5}>5 {t('years')}</option>
              <option value={10}>10 {t('years')}</option>
              <option value={15}>15 {t('years')}</option>
              <option value={20}>20 {t('years')}</option>
              <option value={30}>30 {t('years')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-700">{t('monthly_equivalent')}</label>
            <div className="mt-2 text-xl font-black text-slate-900">{libFormatMoney(Math.round(monthlyEquivalent), currency)}</div>
          </div>

          <div>
            <label className="block text-sm text-slate-700">{t('example_return_note')}</label>
            <div className="mt-2 text-sm text-slate-500">{t('example_return_label')} {annualReturn}%</div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <div className="text-xs text-slate-500">{t('total_spent')}</div>
            <div className="mt-1 text-2xl font-black text-slate-900">{libFormatMoney(Math.round(totalSpent), currency)}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">{t('future_value')}</div>
            <div className="mt-1 text-2xl font-black text-[#7C4A00]">{libFormatMoney(Math.round(futureValue), currency)}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">{t('difference')}</div>
            <div className="mt-1 text-2xl font-black text-slate-900">{libFormatMoney(Math.round(difference), currency)}</div>
          </div>
        </div>

        <div className="mt-6 h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip formatter={(value: number) => `${libFormatMoney(Number(value), currency)}`} />
              <Legend />
              <Line type="monotone" dataKey="spent" stroke="#8884d8" name={t('money_spent')} />
              <Line type="monotone" dataKey="invested" stroke="#D4AF37" name={t('potential_investment')} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 text-sm text-slate-500">{t('investment_disclaimer')}</div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="text-base font-bold">{t('example_card_title')}</h3>
        <p className="mt-2 text-sm text-slate-700">{t('example_card_desc')}</p>
      </div>
    </div>
  )
}
