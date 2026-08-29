export type TimeToFreedomInput = {
  monthlyIncome?: number
  hourlyIncome?: number
  hoursPerMonth?: number
  purchasePrice: number
  hoursPerDay?: number
}

export type TimeToFreedomResult = {
  hourlyIncome: number
  hoursRequired: number
  daysRequired: number
  percentOfMonthly?: number
}

export function calculateTimeToFreedom(input: TimeToFreedomInput): TimeToFreedomResult {
  const hoursPerDay = Number(input.hoursPerDay) || 8
  const hoursPerMonth = Number(input.hoursPerMonth) || (hoursPerDay * 20)
  const purchase = Number(input.purchasePrice) || 0

  let hourly = 0
  if (typeof input.hourlyIncome === 'number' && Number.isFinite(input.hourlyIncome) && input.hourlyIncome > 0) {
    hourly = input.hourlyIncome
  } else if (typeof input.monthlyIncome === 'number' && Number.isFinite(input.monthlyIncome) && hoursPerMonth > 0) {
    hourly = input.monthlyIncome / hoursPerMonth
  } else {
    hourly = 0
  }

  const hoursRequired = hourly > 0 ? purchase / hourly : Infinity
  const daysRequired = Number.isFinite(hoursRequired) ? hoursRequired / hoursPerDay : Infinity

  const percentOfMonthly = (typeof input.monthlyIncome === 'number' && input.monthlyIncome > 0)
    ? (purchase / input.monthlyIncome) * 100
    : undefined

  return {
    hourlyIncome: Number(Number(hourly || 0)),
    hoursRequired: Number(Number.isFinite(hoursRequired) ? Math.max(0, hoursRequired) : Infinity),
    daysRequired: Number(Number.isFinite(daysRequired) ? Math.max(0, daysRequired) : Infinity),
    percentOfMonthly: percentOfMonthly === undefined ? undefined : Number(percentOfMonthly)
  }
}
