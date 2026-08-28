import { describe, expect, it } from 'vitest'
import { proFeatures, proFeatureList, getProPlanCopy } from './proFeatures'

describe('pro plan metadata', () => {
  it('uses the current Finora Pro pricing and feature list', () => {
    expect(proFeatures.price).toBe('100,000 UZS / month')
    expect(proFeatures.trial).toBe('7-day free trial')
    expect(proFeatureList.length).toBeGreaterThanOrEqual(10)
    expect(getProPlanCopy('en').headline).toContain('Finora Pro')
    expect(getProPlanCopy('ru').price).toContain('100 000')
  })
})
