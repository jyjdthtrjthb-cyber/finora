export function futureValueMonthly(contribution: number, annualRatePercent: number, months: number) {
  const c = Number(contribution) || 0
  const r = (Number(annualRatePercent) || 0) / 100
  const m = Number(months) || 0
  if (m <= 0 || c <= 0) return 0
  const monthlyRate = r / 12
  if (monthlyRate === 0) return c * m
  const fv = c * (Math.pow(1 + monthlyRate, m) - 1) / monthlyRate
  return fv
}

export function seriesFutureValues(contribution: number, annualRatePercent: number, years: number) {
  const result: Array<{ year: number; months: number; contributions: number; futureValue: number }> = []
  for (let y = 1; y <= years; y += 1) {
    const months = y * 12
    const contributions = contribution * months
    const futureValue = futureValueMonthly(contribution, annualRatePercent, months)
    result.push({ year: y, months, contributions, futureValue })
  }
  return result
}
