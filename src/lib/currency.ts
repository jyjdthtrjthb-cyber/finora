export type CurrencyCode = 'UZS' | 'USD' | 'EUR' | 'RUB'

export const CURRENCIES: Record<CurrencyCode, { code: CurrencyCode; symbol: string; display: string }> = {
  UZS: { code: 'UZS', symbol: "so'm", display: "Uzbekistani Som" },
  USD: { code: 'USD', symbol: '$', display: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', display: 'Euro' },
  RUB: { code: 'RUB', symbol: '₽', display: 'Russian Ruble' }
}

export function formatMoney(amount: number, currency: CurrencyCode = 'UZS') {
  const safe = Number.isFinite(amount) ? amount : 0
  try {
    if (currency === 'UZS') {
      // show no decimals and append so'm
      return `${Number(Math.round(safe)).toLocaleString('ru-RU')} ${CURRENCIES.UZS.symbol}`
    }

    // For other currencies use Intl to format with currency symbol
    const locale = currency === 'USD' ? 'en-US' : currency === 'EUR' ? 'de-DE' : 'ru-RU'
    return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 2 }).format(safe)
  } catch (e) {
    return `${safe.toLocaleString()} ${CURRENCIES[currency].symbol}`
  }
}

export default {
  CURRENCIES,
  formatMoney
}
