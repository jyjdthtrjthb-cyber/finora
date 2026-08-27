import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import { useUpgradeModal } from '../components/UpgradeModalProvider'
import { financialRules, type FinancialRule } from '../data/financialRules'
import {
  calculateBudget503020,
  calculateCompoundComparison,
  calculateDti,
  calculateEmergencyCoverage,
  calculateEmergencyFund,
  calculateFeeImpact,
  calculateGoalCompletion,
  calculateHousingAffordability,
  calculatePortfolioConcentration,
  calculatePurchaseMonths,
  calculateSavingsRate,
  calculateSixtyThirtyTenFifteen,
  calculateTenPercent
} from '../lib/financialCalculations'

const languageOrder = ['en', 'ru', 'uz'] as const

type Calculators = {
  'pay-yourself-first': 'pay-yourself-first'
  'emergency-fund': 'emergency-fund'
  'budget-503020': 'budget-503020'
  'housing-affordability': 'housing-affordability'
  'dti-calculator': 'dti-calculator'
  'savings-rate': 'savings-rate'
  'future-savings': 'future-savings'
  'goal-completion': 'goal-completion'
  'purchase-cost': 'purchase-cost'
  'investment-fees': 'investment-fees'
  'compound-growth': 'compound-growth'
  'sixty-thirty-ten-fifteen': 'sixty-thirty-ten-fifteen'
  'emergency-vs-investing': 'emergency-vs-investing'
  'compare-debts': 'compare-debts'
  'portfolio-concentration': 'portfolio-concentration'
  'automate-savings': 'automate-savings'
}

function getLangKey(lang: string) {
  if (lang.startsWith('ru')) return 'ru'
  if (lang.startsWith('uz')) return 'uz'
  return 'en'
}

function getLocalized(rule: FinancialRule, key: keyof FinancialRule, lang: string) {
  const value = rule[key] as any
  if (typeof value === 'string') return value
  if (value && typeof value === 'object') return value[lang] || value.en
  return ''
}

function formatNumber(value: number) {
  return Number(value || 0).toLocaleString('ru-RU')
}

function RuleCalculator({ rule, lang }: { rule: FinancialRule; lang: 'en' | 'ru' | 'uz' }) {
  const [income, setIncome] = useState('10000000')
  const [expenses, setExpenses] = useState('4000000')
  const [goalTarget, setGoalTarget] = useState('120000000')
  const [goalCurrent, setGoalCurrent] = useState('30000000')
  const [goalMonthly, setGoalMonthly] = useState('3000000')
  const [monthlyDebt, setMonthlyDebt] = useState('2000000')
  const [grossIncome, setGrossIncome] = useState('10000000')
  const [savings, setSavings] = useState('2000000')
  const [netIncome, setNetIncome] = useState('10000000')
  const [monthlySavings, setMonthlySavings] = useState('5000000')
  const [price, setPrice] = useState('5000000')
  const [initialInvestment, setInitialInvestment] = useState('1000000')
  const [annualContribution, setAnnualContribution] = useState('1200000')
  const [returnRate, setReturnRate] = useState('8')
  const [feeA, setFeeA] = useState('0.5')
  const [feeB, setFeeB] = useState('1.5')
  const [years, setYears] = useState('10')
  const [assetA, setAssetA] = useState('90')
  const [assetB, setAssetB] = useState('10')
  const [debtName, setDebtName] = useState('Debt A')
  const [debtBalance, setDebtBalance] = useState('8000000')
  const [debtRate, setDebtRate] = useState('29')
  const [debtMinimum, setDebtMinimum] = useState('300000')
  const [feeMonthlyContribution, setFeeMonthlyContribution] = useState('100000')
  const [emergencySavings, setEmergencySavings] = useState('12000000')
  const [essentials, setEssentials] = useState('4000000')

  const currentKey = rule.interactiveAction

  if (!currentKey) return null

  const result = useMemo(() => {
    switch (currentKey) {
      case 'pay-yourself-first':
        return { value: calculateTenPercent(Number(income || 0)) }
      case 'emergency-fund':
        return calculateEmergencyFund(Number(expenses || 0))
      case 'budget-503020':
        return calculateBudget503020(Number(income || 0))
      case 'housing-affordability':
        return { value: calculateHousingAffordability(Number(income || 0)) }
      case 'dti-calculator':
        return { value: calculateDti(Number(monthlyDebt || 0), Number(grossIncome || 0)) }
      case 'savings-rate':
        return { value: calculateSavingsRate(Number(savings || 0), Number(netIncome || 0)) }
      case 'goal-completion':
        return calculateGoalCompletion(Number(goalTarget || 0), Number(goalCurrent || 0), Number(goalMonthly || 0))
      case 'purchase-cost':
        return { value: calculatePurchaseMonths(Number(price || 0), Number(monthlySavings || 0)) }
      case 'portfolio-concentration':
        return calculatePortfolioConcentration(Number(assetA || 0), Number(assetB || 0))
      case 'investment-fees':
        return calculateFeeImpact(Number(initialInvestment || 0), Number(annualContribution || 0), Number(returnRate || 0), Number(feeA || 0), Number(feeB || 0), Number(years || 0))
      case 'compound-growth':
        return calculateCompoundComparison(Number(feeMonthlyContribution || 0), 20, 30)
      case 'sixty-thirty-ten-fifteen':
        return calculateSixtyThirtyTenFifteen(Number(income || 0))
      case 'emergency-vs-investing':
        return calculateEmergencyCoverage(Number(emergencySavings || 0), Number(essentials || 0))
      case 'compare-debts':
        return {
          debtName,
          debtBalance: Number(debtBalance || 0),
          rate: Number(debtRate || 0),
          minimum: Number(debtMinimum || 0)
        }
      default:
        return null
    }
  }, [currentKey, income, expenses, goalTarget, goalCurrent, goalMonthly, monthlyDebt, grossIncome, savings, netIncome, monthlySavings, price, initialInvestment, annualContribution, returnRate, feeA, feeB, years, assetA, assetB, debtName, debtBalance, debtRate, debtMinimum, feeMonthlyContribution, emergencySavings, essentials])

  const labelMap: Record<string, { title: string; value: string }> = {
    'pay-yourself-first': { title: '10% target', value: `${formatNumber((result as any)?.value || 0)} UZS` },
    'emergency-fund': { title: '3-month / 6-month', value: `${formatNumber((result as any)?.threeMonths || 0)} / ${formatNumber((result as any)?.sixMonths || 0)} UZS` },
    'budget-503020': { title: '50/30/20', value: `${formatNumber((result as any)?.needs || 0)} / ${formatNumber((result as any)?.wants || 0)} / ${formatNumber((result as any)?.savingsDebt || 0)} UZS` },
    'housing-affordability': { title: '28% target', value: `${formatNumber((result as any)?.value || 0)} UZS` },
    'dti-calculator': { title: 'DTI', value: `${(result as any)?.value || 0}%` },
    'savings-rate': { title: 'Savings rate', value: `${(result as any)?.value || 0}%` },
    'goal-completion': { title: 'Months needed', value: `${(result as any)?.monthsLabel || 0} months` },
    'purchase-cost': { title: 'Months to save', value: `${(result as any)?.value || 0} months` },
    'portfolio-concentration': { title: 'Concentration', value: `${(result as any)?.concentration || 'N/A'}` },
    'investment-fees': { title: 'Difference', value: `${formatNumber((result as any)?.difference || 0)} UZS` },
    'compound-growth': { title: 'Difference', value: `${formatNumber((result as any)?.difference || 0)} UZS` },
    'sixty-thirty-ten-fifteen': { title: '60/30/10 + 15', value: `${formatNumber((result as any)?.essentials || 0)} / ${formatNumber((result as any)?.niceToHaves || 0)} / ${formatNumber((result as any)?.nearTerm || 0)} / ${formatNumber((result as any)?.retirement || 0)} UZS` },
    'emergency-vs-investing': { title: 'Months covered', value: `${(result as any)?.monthsCovered || 0} months` },
    'compare-debts': { title: 'Highest rate', value: `${(result as any)?.debtName || 'Debt A'} • ${(result as any)?.rate || 0}%` },
    'automate-savings': { title: 'Auto transfer', value: `${formatNumber(calculateTenPercent(Number(income || 0)))} UZS` }
  }

  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{labelMap[currentKey]?.title}</div>
        <div className="text-sm font-bold text-slate-900">{labelMap[currentKey]?.value}</div>
      </div>

      {currentKey === 'pay-yourself-first' && (
        <div className="grid gap-3 md:grid-cols-1">
          <label className="text-sm font-medium text-slate-700">Monthly income</label>
          <input value={income} onChange={e => setIncome(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900" />
        </div>
      )}

      {currentKey === 'emergency-fund' && (
        <div className="grid gap-3 md:grid-cols-1">
          <label className="text-sm font-medium text-slate-700">Essential monthly expenses</label>
          <input value={expenses} onChange={e => setExpenses(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900" />
        </div>
      )}

      {currentKey === 'budget-503020' && (
        <div className="grid gap-3 md:grid-cols-1">
          <label className="text-sm font-medium text-slate-700">Monthly income</label>
          <input value={income} onChange={e => setIncome(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900" />
        </div>
      )}

      {currentKey === 'housing-affordability' && (
        <div className="grid gap-3 md:grid-cols-1">
          <label className="text-sm font-medium text-slate-700">Gross monthly income</label>
          <input value={income} onChange={e => setIncome(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900" />
        </div>
      )}

      {currentKey === 'dti-calculator' && (
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-700">Debt payments</label>
            <input value={monthlyDebt} onChange={e => setMonthlyDebt(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Gross income</label>
            <input value={grossIncome} onChange={e => setGrossIncome(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900" />
          </div>
        </div>
      )}

      {currentKey === 'savings-rate' && (
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-700">Savings</label>
            <input value={savings} onChange={e => setSavings(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Net income</label>
            <input value={netIncome} onChange={e => setNetIncome(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900" />
          </div>
        </div>
      )}

      {currentKey === 'goal-completion' && (
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="text-sm font-medium text-slate-700">Target</label>
            <input value={goalTarget} onChange={e => setGoalTarget(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Current</label>
            <input value={goalCurrent} onChange={e => setGoalCurrent(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Monthly</label>
            <input value={goalMonthly} onChange={e => setGoalMonthly(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900" />
          </div>
        </div>
      )}

      {currentKey === 'purchase-cost' && (
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-700">Price</label>
            <input value={price} onChange={e => setPrice(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Monthly savings</label>
            <input value={monthlySavings} onChange={e => setMonthlySavings(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900" />
          </div>
        </div>
      )}

      {currentKey === 'portfolio-concentration' && (
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-700">Asset A (%)</label>
            <input value={assetA} onChange={e => setAssetA(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Asset B (%)</label>
            <input value={assetB} onChange={e => setAssetB(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900" />
          </div>
        </div>
      )}

      {currentKey === 'investment-fees' && (
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="text-sm font-medium text-slate-700">Initial</label>
            <input value={initialInvestment} onChange={e => setInitialInvestment(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Annual contribution</label>
            <input value={annualContribution} onChange={e => setAnnualContribution(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Years</label>
            <input value={years} onChange={e => setYears(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Return rate</label>
            <input value={returnRate} onChange={e => setReturnRate(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Fee A</label>
            <input value={feeA} onChange={e => setFeeA(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Fee B</label>
            <input value={feeB} onChange={e => setFeeB(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900" />
          </div>
        </div>
      )}

      {currentKey === 'compound-growth' && (
        <div className="grid gap-3 md:grid-cols-1">
          <label className="text-sm font-medium text-slate-700">Monthly contribution</label>
          <input value={feeMonthlyContribution} onChange={e => setFeeMonthlyContribution(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900" />
        </div>
      )}

      {currentKey === 'sixty-thirty-ten-fifteen' && (
        <div className="grid gap-3 md:grid-cols-1">
          <label className="text-sm font-medium text-slate-700">Income</label>
          <input value={income} onChange={e => setIncome(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900" />
        </div>
      )}

      {currentKey === 'emergency-vs-investing' && (
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-700">Monthly essential expenses</label>
            <input value={essentials} onChange={e => setEssentials(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Current emergency savings</label>
            <input value={emergencySavings} onChange={e => setEmergencySavings(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900" />
          </div>
        </div>
      )}

      {currentKey === 'compare-debts' && (
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-700">Debt name</label>
            <input value={debtName} onChange={e => setDebtName(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Balance</label>
            <input value={debtBalance} onChange={e => setDebtBalance(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Interest rate</label>
            <input value={debtRate} onChange={e => setDebtRate(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Minimum payment</label>
            <input value={debtMinimum} onChange={e => setDebtMinimum(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900" />
          </div>
        </div>
      )}
    </div>
  )
}

export default function MoneyWisdom() {
  const { t, i18n } = useTranslation()
  const { subscriptionStatus } = useAuth()
  const { openUpgrade } = useUpgradeModal()
  const lang = getLangKey(i18n.language || 'en') as 'en' | 'ru' | 'uz'
  const isPro = subscriptionStatus === 'pro'

  const sortedRules = useMemo(() => [...financialRules], [])

  return (
    <div className="mx-auto max-w-7xl py-6 md:py-10">
      <div className="mb-8 rounded-[28px] border border-[#F8D66D]/30 bg-gradient-to-br from-[#0F172A] via-[#111827] to-[#1E293B] p-6 text-white shadow-[0_25px_60px_rgba(15,23,42,0.35)] md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FDE68A]">{t('money_wisdom')}</p>
        <h1 className="mt-3 text-3xl font-black md:text-5xl">{t('money_wisdom_title')}</h1>
        <p className="mt-4 max-w-3xl text-base text-slate-300 md:text-lg">{t('money_wisdom_subtitle')}</p>
      </div>

      <div className="space-y-6">
        {sortedRules.map((rule) => {
          const isLocked = rule.isPro && !isPro
          const previewText = rule.teaser?.[lang] || rule.shortDescription[lang]
          const mainTitle = rule.title[lang]

          return (
            <article key={rule.id} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.05)] md:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#FFF8D6] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#7C4A00]">{rule.isPro ? 'PRO' : 'FREE'}</span>
                    <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">#{rule.id}</span>
                  </div>
                  <h2 className="mt-3 text-2xl font-black text-slate-900">{mainTitle}</h2>
                </div>
                <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">{rule.category}</div>
              </div>

                  {isLocked ? (
                <div className="mt-5 rounded-2xl border border-[#F8D66D]/40 bg-[#FFFDF1] p-5">
                  <div className="inline-flex rounded-full bg-slate-900 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#FDE68A]">🔒 PRO</div>
                  <p className="mt-3 text-lg font-bold text-slate-900">{mainTitle}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{previewText}</p>
                  <button type="button" onClick={() => openUpgrade({ featureTitle: rule.title[lang] })} className="mt-4 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#F59E0B] to-[#D4AF37] px-4 py-2 text-sm font-bold text-slate-900 shadow-[0_10px_30px_rgba(245,158,11,0.35)]">
                    {t('unlock_with_finora_pro')}
                  </button>
                </div>
              ) : (
                <>
                  <p className="mt-4 text-base leading-7 text-slate-700">{rule.shortDescription[lang]}</p>

                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{t('rule_formula')}</div>
                      <div className="mt-2 text-base font-semibold text-slate-900">{rule.formula[lang]}</div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{t('rule_source')}</div>
                      <div className="mt-2 text-base font-semibold text-slate-900">{rule.source[lang]}</div>
                    </div>
                  </div>

                  <div className="mt-5 space-y-4 text-slate-700">
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{t('rule_explanation')}</div>
                      <p className="mt-2 leading-7">{rule.fullExplanation[lang]}</p>
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{t('rule_example')}</div>
                      <p className="mt-2 leading-7">{rule.example[lang]}</p>
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{t('rule_why_it_matters')}</div>
                      <p className="mt-2 leading-7">{rule.whyItMatters[lang]}</p>
                    </div>
                  </div>

                  {rule.interactiveAction && <RuleCalculator rule={rule} lang={lang} />}
                </>
              )}
            </article>
          )
        })}
      </div>

      {/* Upgrade modal is provided globally by UpgradeModalProvider */}
    </div>
  )
}
