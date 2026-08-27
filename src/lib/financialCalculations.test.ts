import { describe, expect, it } from 'vitest'
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
} from './financialCalculations'

describe('financial calculations', () => {
  it('calculates 10% savings target', () => {
    expect(calculateTenPercent(10000000)).toBe(1000000)
  })

  it('calculates emergency fund targets', () => {
    expect(calculateEmergencyFund(4000000)).toEqual({
      threeMonths: 12000000,
      sixMonths: 24000000
    })
  })

  it('calculates the 50/30/20 budget split', () => {
    expect(calculateBudget503020(10000000)).toEqual({
      needs: 5000000,
      wants: 3000000,
      savingsDebt: 2000000
    })
  })

  it('calculates housing affordability rule', () => {
    expect(calculateHousingAffordability(10000000)).toBe(2800000)
  })

  it('calculates debt-to-income ratio', () => {
    expect(calculateDti(2000000, 10000000)).toBe(20)
  })

  it('calculates savings rate', () => {
    expect(calculateSavingsRate(2000000, 10000000)).toBe(20)
  })

  it('calculates goal completion timing', () => {
    expect(calculateGoalCompletion(120000000, 30000000, 3000000)).toEqual({
      remaining: 90000000,
      monthsNeeded: 30,
      monthsLabel: '30',
      complete: false
    })
  })

  it('calculates purchase months needed', () => {
    expect(calculatePurchaseMonths(5000000, 1000000)).toBe(5)
  })

  it('calculates portfolio concentration', () => {
    expect(calculatePortfolioConcentration(90, 10)).toEqual({
      concentration: 'High concentration',
      percentageA: 90,
      percentageB: 10
    })
  })

  it('calculates fee impact difference', () => {
    expect(calculateFeeImpact(1000000, 1200000, 8, 0.5, 1.5, 10)).toMatchObject({
      difference: expect.any(Number)
    })
  })

  it('calculates compound comparison with a later start', () => {
    expect(calculateCompoundComparison(100000, 20, 30)).toMatchObject({
      startAt20: expect.any(Number),
      startAt30: expect.any(Number),
      difference: expect.any(Number)
    })
  })

  it('calculates the 60/30/10 plus retirement split', () => {
    expect(calculateSixtyThirtyTenFifteen(10000000)).toEqual({
      essentials: 6000000,
      niceToHaves: 3000000,
      nearTerm: 1000000,
      retirement: 1500000
    })
  })

  it('calculates emergency coverage progress', () => {
    expect(calculateEmergencyCoverage(12000000, 4000000)).toEqual({
      monthsCovered: 3,
      progress: 50
    })
  })
})
