import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, Area, AreaChart } from 'recharts'
import { useUpgradeModal } from './UpgradeModalProvider'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { calculateDailyWeeklyMonthlyYearly, longTermSavings, futureValueSeries, ReductionScheduleRow } from '../lib/badHabitCalculations'

type Category = {
  key: string
  label: string
  unitLabel: string
}

const categories: Category[] = [
  { key: 'smoking', label: 'Smoking', unitLabel: 'cigarettes per day' },
  { key: 'alcohol', label: 'Alcohol', unitLabel: 'units per day' },
  { key: 'sweets', label: 'Sweets', unitLabel: 'servings per day' },
  { key: 'fast_food', label: 'Fast Food', unitLabel: 'meals per week' },
  { key: 'sugary_drinks', label: 'Sugary Drinks', unitLabel: 'drinks per day' },
  { key: 'other', label: 'Other', unitLabel: 'units per day' }
]

export default function BadHabitPanel() {
  const { t } = useTranslation()
  const { openUpgrade } = useUpgradeModal()
  const { subscriptionStatus } = useAuth()
  const isPro = subscriptionStatus === 'pro'

  const [category, setCategory] = useState<string>('smoking')
  const [customName, setCustomName] = useState<string>('')
  const [quantity, setQuantity] = useState<string>('')
  const [price, setPrice] = useState<string>('')
  const [daysPerWeek, setDaysPerWeek] = useState<string>('7')
  const [monthlyOverride, setMonthlyOverride] = useState<string>('')
  const [investmentEnabled, setInvestmentEnabled] = useState<boolean>(false)
  const [annualReturn, setAnnualReturn] = useState<string>('7')
  const [reductionMode, setReductionMode] = useState<'quit' | 'gradual'>('gradual')
  const [reduceBy, setReduceBy] = useState<string>('1')
  const [reduceEveryDays, setReduceEveryDays] = useState<string>('7')

  const selectedCategory = categories.find(c => c.key === category)!
  const unitLabel = category === 'other' ? t('units_per_day') : t(`${category}_unit_label`, selectedCategory.unitLabel)

  const parsedQuantity = Math.max(0, Number(quantity) || 0)
  const parsedPrice = Math.max(0, Number(price) || 0)
  const parsedDays = Math.min(7, Math.max(1, Number(daysPerWeek) || 7))
  const monthlyFromInputs = parsedPrice && parsedQuantity ? ((parsedQuantity * (parsedDays / 7)) * 30) * parsedPrice : 0
  const parsedMonthly = monthlyOverride ? Math.max(0, Number(monthlyOverride) || 0) : monthlyFromInputs

  const { daily, weekly, monthly, yearly } = useMemo(() => calculateDailyWeeklyMonthlyYearly(parsedQuantity, parsedPrice, parsedDays, parsedMonthly), [parsedQuantity, parsedPrice, parsedDays, parsedMonthly])

  const longTerm = useMemo(() => ({
    '1': longTermSavings(monthly, 1),
    '5': longTermSavings(monthly, 5),
    '10': longTermSavings(monthly, 10),
    '20': longTermSavings(monthly, 20)
  }), [monthly])

  const investmentSeries = useMemo(() => {
    if (!investmentEnabled) return null
    const rate = Number(annualReturn) || 0
    return {
      '1': futureValueSeries(monthly, rate, 1),
      '5': futureValueSeries(monthly, rate, 5),
      '10': futureValueSeries(monthly, rate, 10),
      '20': futureValueSeries(monthly, rate, 20)
    }
  }, [investmentEnabled, annualReturn, monthly])

  const chartData = useMemo(() => {
    const years = [1,5,10,20]
    return years.map(y => ({ year: String(y), saved: longTerm[String(y).replace('','')]?.total || longTerm[String(y)]?.total || longTerm[String(y)]?.total || 0, invest: investmentSeries ? investmentSeries[String(y)]?.total || 0 : 0 }))
  }, [longTerm, investmentSeries])

  const reductionSchedule = useMemo(() => {
    if (reductionMode !== 'gradual') return [] as ReductionScheduleRow[]
    const start = Math.max(0, parsedQuantity)
    const dec = Math.max(0, Number(reduceBy) || 0)
    const every = Math.max(1, Number(reduceEveryDays) || 7)
    return ReductionScheduleRow.generateSimple(start, dec, every)
  }, [reductionMode, parsedQuantity, reduceBy, reduceEveryDays])
  const navigate = useNavigate()

  if (!isPro) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_35px_rgba(15,23,42,0.07)]">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">{t('bad_habit_title')}</p>
          <h2 className="mt-1 text-2xl font-black text-slate-900">{t('bad_habit_subheading')}</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-700">{t('bad_habit_preview_desc', 'Bad Habit Quitter helps you understand how much money and time you could save by reducing or quitting an expensive habit.')}</p>
            <ul className="mt-3 list-disc pl-5 text-sm text-slate-700">
              <li>{t('preview_track_daily', 'Track daily consumption')}</li>
              <li>{t('preview_calculate_spending', 'Calculate daily/monthly/yearly spending')}</li>
              <li>{t('preview_see_savings', 'See potential savings')}</li>
              <li>{t('preview_projections', 'See 1-year, 5-year and 20-year projections')}</li>
              <li>{t('preview_track_progress', 'Track progress')}</li>
              <li>{t('preview_suggestions', 'Get practical habit-changing suggestions')}</li>
              <li>{t('preview_reduction_plan', 'Create a reduction plan')}</li>
            </ul>
            <div className="mt-4">
              <button onClick={() => openUpgrade({ featureTitle: t('bad_habit_title') })} className="w-full rounded-xl bg-gradient-to-r from-[#FFD700] via-[#F59E0B] to-[#D4AF37] px-4 py-3 text-base font-black text-slate-900">{t('unlock_bad_habit')}</button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h4 className="text-lg font-semibold">{t('pro')}</h4>
            <div className="mt-2 text-sm text-slate-700">{t('pro_list')}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_35px_rgba(15,23,42,0.07)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">{t('bad_habit_title')}</p>
          <h2 className="mt-1 text-2xl font-black text-slate-900">{t('bad_habit_subheading')}</h2>
        </div>
        {!isPro && (
          <div className="rounded-full bg-[#FFF8D6] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#7C4A00]">PRO</div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-slate-700">{t('habit_category')}</label>
          <select className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map(c => (
              <option key={c.key} value={c.key}>{t(`habit_${c.key}`)}</option>
            ))}
          </select>

          {category === 'other' && (
            <input placeholder={t('habit_other_placeholder')} value={customName} onChange={(e) => setCustomName(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3" />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">{t('consumption_label', { unit: t(unitLabel) })}</label>
          <input type="number" min={0} step="0.1" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">{t('price_per_unit')}</label>
          <input type="number" min={0} step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">{t('days_per_week')}</label>
          <input type="number" min={1} max={7} step={1} value={daysPerWeek} onChange={(e) => setDaysPerWeek(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">{t('monthly_override')}</label>
          <input type="number" min={0} step="0.01" value={monthlyOverride} onChange={(e) => setMonthlyOverride(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3" />
          <div className="mt-2 text-xs text-slate-500">{t('monthly_override_help')}</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">{t('investment_scenario')}</label>
          <div className="mt-2 flex items-center gap-2">
            <input type="checkbox" checked={investmentEnabled} onChange={(e) => setInvestmentEnabled(e.target.checked)} />
            <input type="number" min={0} step="0.1" value={annualReturn} onChange={(e) => setAnnualReturn(e.target.value)} className="w-20 rounded-xl border border-slate-200 bg-slate-50 p-2" />
            <div className="text-sm text-slate-500">{t('annual_return_percent')}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{t('your_habit_costs')}</div>
          <div className="mt-2 text-3xl font-black text-slate-900">{Number(monthly).toLocaleString()} UZS / {t('per_month')}</div>
          <div className="mt-1 text-sm text-slate-600">{Number(yearly).toLocaleString()} UZS {t('per_year')}</div>

          <div className="mt-4">
            <h3 className="text-sm font-semibold text-slate-700">{t('if_you_stop')}</h3>
            <div className="mt-2 text-2xl font-black text-[#D4AF37]">{Number(longTerm['20']).toLocaleString()} UZS</div>
            <div className="mt-1 text-sm text-slate-500">{t('over_20_years')}</div>
          </div>

          <div className="mt-4 space-y-2">
            <button onClick={() => { if (!isPro) openUpgrade(); }} className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white font-black">{isPro ? t('open_bad_habit') : t('unlock_bad_habit')}</button>
            {isPro && (
              <div className="flex gap-2">
                <button onClick={() => navigate(`/what-if?amount=${Math.round(monthly)}&frequency=monthly`)} className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium">{t('what_if')}</button>
                <button onClick={() => navigate(`/time-to-freedom?purchasePrice=${Math.round(monthly)}`)} className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium">{t('time_to_freedom')}</button>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value: number) => `${Number(value).toLocaleString()} UZS`} />
                <Area type="monotone" dataKey="saved" stroke="#D4AF37" fill="#FFF1C9" />
                {investmentSeries && <Area type="monotone" dataKey="invest" stroke="#94a3b8" fill="#E6EEF8" />}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900">{t('my_reduction_plan')}</h3>
          <div>
            <label className="mr-2 text-sm">{t('plan_quit')}</label>
            <input type="radio" name="plan" checked={reductionMode === 'quit'} onChange={() => setReductionMode('quit')} />
            <label className="ml-3 mr-2 text-sm">{t('plan_gradual')}</label>
            <input type="radio" name="plan" checked={reductionMode === 'gradual'} onChange={() => setReductionMode('gradual')} />
          </div>
        </div>

        {reductionMode === 'gradual' && (
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-slate-700">{t('current_consumption')}</label>
              <input type="number" min={0} value={quantity} onChange={(e) => setQuantity(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">{t('reduce_by')}</label>
              <input type="number" min={0} value={reduceBy} onChange={(e) => setReduceBy(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">{t('every_days')}</label>
              <input type="number" min={1} value={reduceEveryDays} onChange={(e) => setReduceEveryDays(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3" />
            </div>
          </div>
        )}

        {reductionMode === 'gradual' && (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm text-slate-700">{t('reduction_schedule')}</div>
            <ol className="mt-2 list-decimal pl-5 text-sm text-slate-700">
              {reductionSchedule.slice(0, 20).map((r, idx) => (
                <li key={idx}>{r.label}</li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <h4 className="text-lg font-semibold">{t('practical_tips')}</h4>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
            <li>{t('tip_identify_triggers')}</li>
            <li>{t('tip_remove_access')}</li>
            <li>{t('tip_replace_activity')}</li>
            <li>{t('tip_track_each_day')}</li>
            <li>{t('tip_set_goal')}</li>
            <li>{t('tip_tell_someone')}</li>
            <li>{t('tip_use_money_for_goal')}</li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold">{t('disclaimer_title')}</h4>
          <p className="mt-2 text-sm text-slate-700">{t('disclaimer_text')}</p>
        </div>
      </div>
    </div>
  )
}
