import React, { useMemo, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useTranslation } from 'react-i18next'
import { useCurrency } from '../context/CurrencyContext'
import { formatMoney as libFormatMoney } from '../lib/currency'
import { proFeatures } from '../data/proFeatures'

function calcProjection(monthly: number, rate: number, years: number) {
  const months = years * 12
  const r = rate / 100 / 12
  let balance = 0
  const data = [] as any[]
  for (let m = 1; m <= months; m++) {
    balance = (balance + monthly) * (1 + r)
    if (m % Math.ceil(months / 10) === 0 || m === months) {
      data.push({ name: `M${m}`, value: Math.round(balance) })
    }
  }
  return { final: Math.round(balance), data }
}

const scenarios = [
  { nameKey: 'scenario_child_fund', monthly: 50000, years: 12, yieldRate: 19, color: '#F8D66D' },
  { nameKey: 'scenario_dream_home', monthly: 100000, years: 10, yieldRate: 19, color: '#F59E0B' },
  { nameKey: 'scenario_daily_savings', monthly: 1500 * 30, years: 8, yieldRate: 19, color: '#EAB308' }
]

const featureList = [
  'feature_automated_expense_categorization',
  'feature_compound_interest_simulator',
  'feature_goal_predictor'
]

export default function Landing() {
  const { t } = useTranslation()
  const { currency } = useCurrency()
  const [monthly, setMonthly] = useState(5000000)
  const [rate, setRate] = useState(10)
  const [years, setYears] = useState(10)
  const { final, data } = useMemo(() => calcProjection(monthly, rate, years), [monthly, rate, years])

  return (
    <div className="max-w-7xl mx-auto py-4 md:py-10">
      <section className="overflow-hidden rounded-[30px] border border-[#F8D66D]/20 bg-[#0F172A] shadow-[0_30px_80px_rgba(15,23,42,0.75)]">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
          <div className="p-6 md:p-8 xl:p-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD700]/20 bg-[#111827]/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#FDE68A]">
              {t('landing_badge')}
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight md:text-5xl xl:text-6xl">
              <span
                className="inline-block"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #FFF099 0%, #FFD700 50%, #D4AF37 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent'
                }}
              >
                {t('hero_headline')}
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
              {t('hero_subtitle')}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/register" className="rounded-xl bg-gradient-to-r from-[#FFD700] via-[#F59E0B] to-[#D4AF37] px-5 py-3 text-sm font-bold text-slate-900 shadow-[0_10px_30px_rgba(245,158,11,0.45)] transition hover:translate-y-[-1px]">
                {t('get_started')}
              </a>
              <a href="/login" className="rounded-xl border border-[#FFD700]/35 bg-white/5 px-5 py-3 text-sm font-semibold text-[#FDE68A] transition hover:bg-white/10">
                {t('try_finora_free')}
              </a>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-400">{t('monthly_label')}</div>
                <div className="mt-2 text-xl font-bold text-white">{libFormatMoney(monthly, currency)}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-400">{t('growth_label')}</div>
                <div className="mt-2 text-xl font-bold text-[#FFD700]">{rate}% / {t('year')}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-400">{t('years_label')}</div>
                <div className="mt-2 text-xl font-bold text-white">{years} {t('years')}</div>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6 xl:p-8">
            <div className="h-full rounded-[28px] border border-[#FFD700]/20 bg-slate-950/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] md:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">{t('projection')}</p>
                  <h2 className="mt-1 text-xl font-bold text-white">{t('future_value')}</h2>
                </div>
                <div className="rounded-full border border-[#FFD700]/20 bg-[#FFD700]/10 px-2.5 py-1 text-xs font-semibold text-[#FDE68A]">
                  {t('table_projected_yield_19')}
                </div>
              </div>

              <div className="mt-4 h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <XAxis dataKey="name" tick={{ fill: '#cbd5e1', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#cbd5e1', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#111827', border: '1px solid rgba(255,215,0,0.25)', borderRadius: 12, color: '#fff' }}
                      formatter={(value: number) => `${libFormatMoney(Number(value), currency)}`}
                    />
                    <Line type="monotone" dataKey="value" stroke="#FFD700" strokeWidth={3} dot={false} activeDot={{ r: 5, fill: '#FDE68A' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80">
                <table className="min-w-full text-left text-sm text-slate-200">
                  <thead className="bg-slate-800/80 text-[11px] uppercase tracking-[0.16em] text-slate-400">
                    <tr>
                      <th className="px-3 py-2">{t('table_scenario_goal')}</th>
                      <th className="px-3 py-2">{t('table_monthly_deposit')}</th>
                      <th className="px-3 py-2">{t('table_projected_yield_19')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scenarios.map((item) => {
                      const result = calcProjection(item.monthly, item.yieldRate, item.years)
                      return (
                        <tr key={item.nameKey} className="border-t border-white/5">
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-2">
                              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                              <span className="font-medium text-white">{t(item.nameKey)}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2 text-slate-300">{libFormatMoney(item.monthly, currency)}</td>
                          <td className="px-3 py-2 font-semibold text-[#FDE68A]">{libFormatMoney(result.final, currency)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[28px] border border-[#F8D66D]/30 bg-gradient-to-br from-[#111827] via-[#0F172A] to-[#1E293B] p-6 text-white shadow-[0_20px_50px_rgba(15,23,42,0.25)] md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FDE68A]">Finora Pro</p>
            <h3 className="mt-2 text-3xl font-black text-white">{t('unlock_finora_pro')}</h3>
            <div className="mt-2 text-2xl font-black text-[#FFD700]">{proFeatures.price}</div>
            <div className="mt-1 text-sm text-slate-200">{t('seven_day_trial')}</div>
          </div>
          <a href="/login" className="inline-flex rounded-xl bg-gradient-to-r from-[#FFD700] via-[#F59E0B] to-[#D4AF37] px-4 py-3 text-sm font-black text-slate-900 shadow-[0_10px_30px_rgba(245,158,11,0.35)]">
            {t('unlock_with_finora_pro')}
          </a>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {proFeatures.features.map((feature) => (
            <div key={feature.key} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
              <div className="text-lg">{feature.icon}</div>
              <div className="mt-2 font-medium">{t(feature.key)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.08)] md:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">{t('planner')}</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">{t('savings_simulator')}</h3>
            </div>
            <div className="rounded-full bg-[#FFF8D6] px-3 py-1 text-sm font-semibold text-[#B7791F]">{t('final_estimate')}</div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">{t('monthly_savings_uzs')}</label>
              <input type="number" value={monthly} onChange={e => setMonthly(Number(e.target.value))} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none ring-0 transition focus:border-[#D4AF37] focus:bg-white" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">{t('annual_interest_rate')}</label>
                <input type="number" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none transition focus:border-[#D4AF37] focus:bg-white" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">{t('years_label')}</label>
                <input type="number" value={years} onChange={e => setYears(Number(e.target.value))} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-900 outline-none transition focus:border-[#D4AF37] focus:bg-white" />
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-gradient-to-r from-[#FFF8D6] via-[#FDE68A] to-[#F8D66D] p-4 text-slate-900 shadow-inner">
            <div className="text-sm font-medium uppercase tracking-[0.18em] text-[#7C4A00]">{t('projected_total')}</div>
            <div className="mt-2 text-3xl font-black">{final.toLocaleString('ru-RU')} UZS</div>
          </div>
        </div>

        <div className="rounded-[28px] border border-[#F8D66D]/30 bg-gradient-to-br from-[#111827] via-[#0F172A] to-[#1E293B] p-6 text-white shadow-[0_20px_50px_rgba(15,23,42,0.25)] md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FDE68A]">{t('features')}</p>
          <h3 className="mt-3 text-2xl font-bold text-white">{t('built_for_smarter')}</h3>

          <div className="mt-6 space-y-4">
            {featureList.map((feature) => (
              <div key={feature} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#FFD700]/15 text-[#FFD700]">✓</div>
                <div className="text-sm font-medium text-slate-200">{t(feature)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
