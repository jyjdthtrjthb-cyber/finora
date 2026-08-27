export function calculateTenPercent(income: number) {
  return Number((income * 0.1).toFixed(2))
}

export function calculateEmergencyFund(monthlyEssentialExpenses: number) {
  return {
    threeMonths: Number((monthlyEssentialExpenses * 3).toFixed(2)),
    sixMonths: Number((monthlyEssentialExpenses * 6).toFixed(2))
  }
}

export function calculateBudget503020(income: number) {
  return {
    needs: Number((income * 0.5).toFixed(2)),
    wants: Number((income * 0.3).toFixed(2)),
    savingsDebt: Number((income * 0.2).toFixed(2))
  }
}

export function calculateHousingAffordability(income: number) {
  return Number((income * 0.28).toFixed(2))
}

export function calculateDti(monthlyDebtPayments: number, grossMonthlyIncome: number) {
  if (!grossMonthlyIncome) return 0
  return Number(((monthlyDebtPayments / grossMonthlyIncome) * 100).toFixed(2))
}

export function calculateSavingsRate(savings: number, netIncome: number) {
  if (!netIncome) return 0
  return Number(((savings / netIncome) * 100).toFixed(2))
}

export function calculateGoalCompletion(target: number, current: number, monthlyContribution: number) {
  const remaining = Math.max(target - current, 0)
  if (!monthlyContribution) return { remaining, monthsNeeded: 0, monthsLabel: '0', complete: false }
  const monthsNeeded = Math.ceil(remaining / monthlyContribution)
  return { remaining, monthsNeeded, monthsLabel: String(monthsNeeded), complete: remaining <= 0 }
}

export function calculatePurchaseMonths(price: number, monthlySavings: number) {
  if (!monthlySavings) return 0
  return Math.ceil(price / monthlySavings)
}

export function calculatePortfolioConcentration(assetA: number, assetB: number) {
  const total = assetA + assetB
  if (!total) return { concentration: 'N/A', percentageA: 0, percentageB: 0 }
  const percentageA = Number(((assetA / total) * 100).toFixed(2))
  const percentageB = Number(((assetB / total) * 100).toFixed(2))

  let concentration = 'Balanced'
  if (percentageA >= 80 || percentageB >= 80) concentration = 'High concentration'
  else if (percentageA >= 60 || percentageB >= 60) concentration = 'Moderate concentration'

  return { concentration, percentageA, percentageB }
}

export function calculateFeeImpact(initialInvestment: number, annualContribution: number, expectedReturn: number, feeA: number, feeB: number, years: number) {
  const monthlyRateA = (expectedReturn - feeA) / 100 / 12
  const monthlyRateB = (expectedReturn - feeB) / 100 / 12
  const months = Math.max(years, 1) * 12

  const futureValueAtRate = (initial: number, monthlyRate: number, contribution: number) => {
    let balance = initial
    for (let month = 0; month < months; month += 1) {
      balance = balance * (1 + monthlyRate) + contribution
    }
    return Number(balance.toFixed(2))
  }

  const withFeeA = futureValueAtRate(initialInvestment, monthlyRateA, annualContribution / 12)
  const withFeeB = futureValueAtRate(initialInvestment, monthlyRateB, annualContribution / 12)
  return {
    withFeeA,
    withFeeB,
    difference: Number((withFeeB - withFeeA).toFixed(2))
  }
}

export function calculateCompoundComparison(monthlyContribution: number, yearsBefore: number, yearsAfter: number) {
  const monthlyRate = 0.08 / 12
  const futureValue = (months: number) => {
    let balance = 0
    for (let month = 0; month < months; month += 1) {
      balance = (balance + monthlyContribution) * (1 + monthlyRate)
    }
    return Number(balance.toFixed(2))
  }

  return {
    startAt20: futureValue(yearsBefore * 12),
    startAt30: futureValue(yearsAfter * 12),
    difference: Number((futureValue(yearsBefore * 12) - futureValue(yearsAfter * 12)).toFixed(2))
  }
}

export function calculateSixtyThirtyTenFifteen(income: number) {
  return {
    essentials: Number((income * 0.6).toFixed(2)),
    niceToHaves: Number((income * 0.3).toFixed(2)),
    nearTerm: Number((income * 0.1).toFixed(2)),
    retirement: Number((income * 0.15).toFixed(2))
  }
}

export function calculateEmergencyCoverage(currentEmergencySavings: number, monthlyEssentialExpenses: number) {
  const monthsCovered = monthlyEssentialExpenses ? Math.floor(currentEmergencySavings / monthlyEssentialExpenses) : 0
  return {
    monthsCovered,
    progress: monthlyEssentialExpenses ? Number(((currentEmergencySavings / (monthlyEssentialExpenses * 6)) * 100).toFixed(2)) : 0
  }
}
