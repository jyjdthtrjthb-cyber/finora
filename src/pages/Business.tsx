import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useCurrency } from '../context/CurrencyContext'
import { formatMoney as libFormatMoney } from '../lib/currency'

interface ProfitAllocation {
  teamOperations: number
  marketing: number
  growth: number
  owner: number
}

export default function Business() {
  const { t } = useTranslation()
  const { currency } = useCurrency()
  const [profit, setProfit] = useState('')

  const allocation = useMemo((): ProfitAllocation | null => {
    const value = Number(profit || 0)
    if (!Number.isFinite(value) || value < 0) {
      return null
    }
    if (value === 0) {
      return {
        teamOperations: 0,
        marketing: 0,
        growth: 0,
        owner: 0
      }
    }
    return {
      teamOperations: value * 0.5,
      marketing: value * 0.3,
      growth: value * 0.15,
      owner: value * 0.05
    }
  }, [profit])

  const isValidInput = () => {
    const value = Number(profit || 0)
    return Number.isFinite(value) && value >= 0
  }

  const getTotalAllocation = (): number => {
    if (!allocation) return 0
    return allocation.teamOperations + allocation.marketing + allocation.growth + allocation.owner
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_35px_rgba(15,23,42,0.07)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">{t('business_label')}</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">{t('business_title')}</h1>
        <p className="mt-3 text-base text-slate-700">{t('business_subtitle')}</p>
      </div>

      {/* Perfect Business Model Section */}
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_35px_rgba(15,23,42,0.07)]">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">{t('business_example_framework')}</p>
          <h2 className="mt-2 text-2xl font-black text-slate-900">{t('business_perfect_model')}</h2>
          <p className="mt-3 text-sm text-slate-600">{t('business_model_explanation')}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Team & Operations */}
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-4">
            <div className="text-lg font-black text-slate-900">50%</div>
            <h3 className="mt-2 font-bold text-slate-900">{t('business_team_operations')}</h3>
            <p className="mt-2 text-xs text-slate-600">{t('business_team_desc')}</p>
          </div>

          {/* Marketing & Advertising */}
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-4">
            <div className="text-lg font-black text-slate-900">30%</div>
            <h3 className="mt-2 font-bold text-slate-900">{t('business_marketing_advertising')}</h3>
            <p className="mt-2 text-xs text-slate-600">{t('business_marketing_desc')}</p>
          </div>

          {/* Growth & Reserve */}
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-4">
            <div className="text-lg font-black text-slate-900">15%</div>
            <h3 className="mt-2 font-bold text-slate-900">{t('business_growth_reserve')}</h3>
            <p className="mt-2 text-xs text-slate-600">{t('business_growth_desc')}</p>
          </div>

          {/* Owner */}
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-[#FFF8D6] to-[#FFEDAB] p-4">
            <div className="text-lg font-black text-[#7C4A00]">5%</div>
            <h3 className="mt-2 font-bold text-[#7C4A00]">{t('business_owner')}</h3>
            <p className="mt-2 text-xs text-[#8B6914]">{t('business_owner_desc')}</p>
          </div>
        </div>
      </div>

      {/* Business Profit Calculator */}
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_35px_rgba(15,23,42,0.07)]">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">{t('calculator')}</p>
          <h2 className="mt-2 text-2xl font-black text-slate-900">{t('business_calculator_title')}</h2>
        </div>

        {/* Input Section */}
        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              {t('business_profit_label')}
            </label>
            <input
              type="number"
              value={profit}
              onChange={(e) => setProfit(e.target.value)}
              placeholder="0"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-900 outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
            />
            <p className="mt-1 text-xs text-slate-500">{t('business_profit_helper')}</p>
          </div>

          {/* Quick action buttons for test values */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              {t('business_quick_examples')}
            </label>
            <div className="flex flex-wrap gap-2">
              {[100, 1000, 10000, 100000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setProfit(String(val))}
                  className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-200"
                >
                  {libFormatMoney(val, currency)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error/Validation Message */}
        {profit !== '' && !isValidInput() && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {t('business_invalid_input')}
          </div>
        )}

        {/* Results Section */}
        {profit !== '' && isValidInput() && allocation && (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-slate-700">
              {t('business_profit_input')}: {libFormatMoney(Number(profit), currency)}
            </p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Team & Operations Result */}
              <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  {t('business_team_operations')}
                </div>
                <div className="mt-3 text-2xl font-black text-slate-900">
                  {libFormatMoney(allocation.teamOperations, currency)}
                </div>
                <div className="mt-1 text-xs text-slate-500">50% {t('business_of_profit')}</div>
              </div>

              {/* Marketing Result */}
              <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  {t('business_marketing_advertising')}
                </div>
                <div className="mt-3 text-2xl font-black text-slate-900">
                  {libFormatMoney(allocation.marketing, currency)}
                </div>
                <div className="mt-1 text-xs text-slate-500">30% {t('business_of_profit')}</div>
              </div>

              {/* Growth Result */}
              <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  {t('business_growth_reserve')}
                </div>
                <div className="mt-3 text-2xl font-black text-slate-900">
                  {libFormatMoney(allocation.growth, currency)}
                </div>
                <div className="mt-1 text-xs text-slate-500">15% {t('business_of_profit')}</div>
              </div>

              {/* Owner Result */}
              <div className="rounded-2xl border-2 border-[#D4AF37] bg-[#FFF8D6] p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-[#7C4A00]">
                  {t('business_owner')}
                </div>
                <div className="mt-3 text-2xl font-black text-[#7C4A00]">
                  {libFormatMoney(allocation.owner, currency)}
                </div>
                <div className="mt-1 text-xs text-[#8B6914]">5% {t('business_of_profit')}</div>
              </div>
            </div>

            {/* Verification - Total should equal input */}
            <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
              ✓ {t('business_total_allocation')}: {libFormatMoney(getTotalAllocation(), currency)} = {t('business_profit_input')}: {libFormatMoney(Number(profit), currency)}
            </div>
          </div>
        )}

        {/* Empty State */}
        {profit === '' && (
          <div className="rounded-lg bg-slate-50 p-6 text-center">
            <p className="text-sm text-slate-600">{t('business_enter_profit')}</p>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
        <div className="rounded-lg border border-slate-300 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {t('business_disclaimer_label')}
          </p>
          <p className="mt-3 text-sm text-slate-700">{t('business_disclaimer_text')}</p>
        </div>
      </div>
    </div>
  )
}
