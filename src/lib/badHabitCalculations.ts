export type SpendingTotals = { daily: number; weekly: number; monthly: number; yearly: number }

export function calculateDailyWeeklyMonthlyYearly(quantityPerDay: number, pricePerUnit: number, daysPerWeek = 7, monthlyOverride = 0): SpendingTotals {
  const safeQuantity = Number.isFinite(quantityPerDay) && quantityPerDay > 0 ? quantityPerDay : 0
  const safePrice = Number.isFinite(pricePerUnit) && pricePerUnit > 0 ? pricePerUnit : 0
  const safeDays = Number.isFinite(daysPerWeek) && daysPerWeek >= 1 && daysPerWeek <= 7 ? daysPerWeek : 7

  const daily = safeQuantity * safePrice * (safeDays / 7)
  const weekly = daily * safeDays
  // use 30-day month approximation to match other calculators
  const monthlyFromCalc = daily * 30
  const monthly = monthlyOverride > 0 ? monthlyOverride : monthlyFromCalc
  const yearly = daily * 365

  return {
    daily: Math.max(0, Number.isFinite(daily) ? Number(daily) : 0),
    weekly: Math.max(0, Number.isFinite(weekly) ? Number(weekly) : 0),
    monthly: Math.max(0, Number.isFinite(monthly) ? Number(monthly) : 0),
    yearly: Math.max(0, Number.isFinite(yearly) ? Number(yearly) : 0)
  }
}

export function longTermSavings(monthlyAmount: number, years: number) {
  const total = Math.round(Math.max(0, monthlyAmount) * 12 * years)
  return { years, total }
}

export function futureValueSeries(monthlyAmount: number, annualRatePercent: number, years: number) {
  const r = (annualRatePercent || 0) / 100
  const n = 12
  const months = years * 12
  let balance = 0
  for (let i = 0; i < months; i++) {
    balance = (balance + monthlyAmount) * (1 + r / n)
  }
  return { years, total: Math.round(balance) }
}

export class ReductionScheduleRow {
  label: string
  value: number
  constructor(label: string, value: number) {
    this.label = label
    this.value = value
  }

  static generateSimple(start: number, decreaseBy: number, everyDays: number) {
    const rows: ReductionScheduleRow[] = []
    if (decreaseBy <= 0) {
      rows.push(new ReductionScheduleRow('No reduction configured', start))
      return rows
    }
    let current = start
    let week = 0
    while (current > 0 && rows.length < 520) {
      rows.push(new ReductionScheduleRow(`Week ${week + 1}: ${Math.max(0, Math.round(current))}`, Math.max(0, Math.round(current))))
      current = current - decreaseBy
      if (current <= 0) {
        rows.push(new ReductionScheduleRow(`Goal reached: ${Math.max(0, Math.round(current))}`, Math.max(0, Math.round(current))))
        break
      }
      week += 1
    }
    return rows
  }
}
