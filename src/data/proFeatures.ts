export type ProFeatureItem = {
  key: string
  icon: string
}

export const proFeatures = {
  price: '100,000 UZS / month',
  priceRu: '100 000 UZS / месяц',
  trial: '7-day free trial',
  trialRu: '7-дневная бесплатная пробная версия',
  headline: 'Finora Pro',
  telegramUrl: 'https://t.me/Bilol_44',
  freePlan: ['5 goals', '10 Money Wisdom rules', 'basic functionality'],
  proPlan: ['15 goals', '20 Money Wisdom rules', 'advanced features'],
  features: [
    { key: 'pro_feature_goals', icon: '🎯' },
    { key: 'pro_feature_debt_management', icon: '💳' },
    { key: 'pro_feature_bank_growth', icon: '🏦' },
    { key: 'pro_feature_child_fund', icon: '👶' },
    { key: 'pro_feature_multiple_currencies', icon: '💱' },
    { key: 'pro_feature_business_roi', icon: '📈' },
    { key: 'pro_feature_advanced_analytics', icon: '📊' },
    { key: 'pro_feature_what_if', icon: '🔮' },
    { key: 'pro_feature_long_term', icon: '📅' },
    { key: 'pro_feature_money_wisdom', icon: '💡' }
  ] as ProFeatureItem[]
}

export const proFeatureList = proFeatures.features.map((item) => item.key)

export const getProPlanCopy = (lang: 'en' | 'ru' | 'uz' = 'en') => {
  if (lang === 'ru') {
    return {
      headline: 'Finora Pro',
      price: '100 000 UZS / месяц',
      trial: '7-дневная бесплатная пробная версия',
      freeTitle: 'Бесплатно',
      proTitle: 'Pro',
      telegramLabel: 'Связаться в Telegram',
      promoPrompt: 'Есть промокод?',
      modalTitle: 'Разблокировать Finora Pro'
    }
  }

  if (lang === 'uz') {
    return {
      headline: 'Finora Pro',
      price: '100 000 UZS / oy',
      trial: '7 kunlik bepul sinov',
      freeTitle: 'Bepul',
      proTitle: 'Pro',
      telegramLabel: 'Telegram orqali bog‘lanish',
      promoPrompt: 'Promokodingiz bormi?',
      modalTitle: 'Finora Pro ni ochish'
    }
  }

  return {
    headline: 'Finora Pro',
    price: '100,000 UZS / month',
    trial: '7-day free trial',
    freeTitle: 'Free',
    proTitle: 'Pro',
    telegramLabel: 'Contact on Telegram',
    promoPrompt: 'Have a promo code?',
    modalTitle: 'Unlock Finora Pro'
  }
}
