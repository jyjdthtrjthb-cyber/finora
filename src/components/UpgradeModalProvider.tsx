import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { proFeatures, getProPlanCopy } from '../data/proFeatures'

type UpgradeContextType = {
  openUpgrade: (opts?: { featureTitle?: string }) => void
  closeUpgrade: () => void
}

const UpgradeContext = createContext<UpgradeContextType | undefined>(undefined)

export const UpgradeModalProvider = ({ children }: { children: React.ReactNode }) => {
  const { t, i18n } = useTranslation()
  const { activatePro, refreshSubscription } = useAuth()
  const [open, setOpen] = useState(false)
  const [featureTitle, setFeatureTitle] = useState<string | undefined>(undefined)
  const [promo, setPromo] = useState('')
  const [notice, setNotice] = useState<string | null>(null)
  const [noticeType, setNoticeType] = useState<'success' | 'error' | 'info'>('info')
  const [loading, setLoading] = useState(false)

  const language = (i18n.language || 'en').startsWith('ru') ? 'ru' : (i18n.language || 'en').startsWith('uz') ? 'uz' : 'en'
  const planCopy = useMemo(() => getProPlanCopy(language), [language])

  const closeUpgrade = () => {
    setOpen(false)
    setPromo('')
    setNotice(null)
    setNoticeType('info')
    setLoading(false)
  }

  const openUpgrade = (opts?: { featureTitle?: string }) => {
    setFeatureTitle(opts?.featureTitle)
    setNotice(null)
    setNoticeType('info')
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeUpgrade()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  const validatePromo = async (code: string) => {
    const trimmed = code.trim()
    if (!trimmed) {
      setNotice(t('invalid_promo'))
      setNoticeType('error')
      return false
    }

    setLoading(true)
    setNotice(null)
    setNoticeType('info')

    try {
      const { data, error } = await supabase.rpc('validate_promo', { code: trimmed }) as any

      if (error) {
        setNotice(t('invalid_promo'))
        setNoticeType('error')
        setLoading(false)
        return false
      }

      if (data?.valid) {
        const ok = await activatePro()
        if (ok) {
          await refreshSubscription()
          setNotice(t('pro_activated_success'))
          setNoticeType('success')
          setPromo('')
          setLoading(false)
          setOpen(false)
          return true
        }
      }

      setNotice(t('invalid_promo'))
      setNoticeType('error')
      setLoading(false)
      return false
    } catch (err: any) {
      setNotice(t('promo_server_missing'))
      setNoticeType('error')
      setLoading(false)
      return false
    }
  }

  return (
    <UpgradeContext.Provider value={{ openUpgrade, closeUpgrade }}>
      {children}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 sm:p-4" onClick={(event) => {
          if (event.target === event.currentTarget) closeUpgrade()
        }}>
          <div className="relative w-[min(95vw,760px)] max-h-[90vh] overflow-hidden rounded-[28px] border border-[#F8D66D]/30 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.4)]">
            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white/95 px-4 pb-3 pt-4 backdrop-blur-sm sm:px-6">
              <div className="pr-10">
                <div className="inline-flex rounded-full bg-slate-900 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#FDE68A]">FINORA PRO</div>
                <h3 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl">{planCopy.modalTitle}</h3>
                <div className="mt-2 text-xl font-black text-[#7C4A00] sm:text-2xl">{proFeatures.price}</div>
                <div className="mt-1 text-sm text-slate-600">{planCopy.trial}</div>
              </div>
              <button type="button" aria-label={t('close')} onClick={closeUpgrade} className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-xl font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">×</button>
            </div>

            <div className="max-h-[calc(90vh-88px)] overflow-y-auto px-4 pb-5 pt-4 sm:px-6">
              {featureTitle && (
                <div className="mb-4 rounded-2xl border border-[#F8D66D]/30 bg-[#FFFDF1] px-3 py-2 text-sm font-semibold text-slate-700">
                  {t('unlock_with_finora_pro')}: {featureTitle}
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm font-semibold text-slate-900">{t('pro_marketing_intro')}</div>
                  <ul className="mt-3 space-y-2 text-sm text-slate-700">
                    {proFeatures.features.map((feature) => (
                      <li key={feature.key} className="flex items-start gap-2">
                        <span className="mt-0.5 text-base">{feature.icon}</span>
                        <span>{t(feature.key)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{t('pro_comparison')}</div>
                  <div className="mt-3 space-y-3 text-sm text-slate-700">
                    <div>
                      <strong>{t('free')}:</strong>
                      <ul className="mt-1 list-inside list-disc pl-1">
                        <li>5 goals</li>
                        <li>10 Money Wisdom rules</li>
                        <li>basic functionality</li>
                      </ul>
                    </div>
                    <div>
                      <strong>{t('pro')}:</strong>
                      <ul className="mt-1 list-inside list-disc pl-1">
                        <li>15 goals</li>
                        <li>20 Money Wisdom rules</li>
                        <li>advanced features</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={() => window.open(proFeatures.telegramUrl, '_blank', 'noopener,noreferrer')} className="rounded-xl bg-gradient-to-r from-[#FFD700] via-[#F59E0B] to-[#D4AF37] px-4 py-3 text-sm font-bold text-slate-900 shadow-[0_10px_30px_rgba(245,158,11,0.25)]">{t('contact_on_telegram')}</button>
                <button type="button" onClick={() => window.open(proFeatures.telegramUrl, '_blank', 'noopener,noreferrer')} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">{t('purchase_pro')}</button>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault()
                if (!promo.trim()) return
                await validatePromo(promo)
              }} className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <label className="mb-2 block text-sm font-medium text-slate-700">{t('promo_placeholder')}</label>
                <input
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  placeholder={t('promo_placeholder')}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none transition focus:border-[#D4AF37]"
                  autoComplete="off"
                  disabled={loading}
                />
                <div className="mt-3 flex gap-2">
                  <button type="submit" disabled={loading} className="flex-1 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#F59E0B] to-[#D4AF37] px-4 py-3 text-sm font-bold text-slate-900 disabled:cursor-not-allowed disabled:opacity-70">
                    {loading ? t('checking_promo') : t('continue')}
                  </button>
                </div>
                {notice && (
                  <div className={`mt-3 rounded-lg border px-3 py-2 text-sm font-medium ${noticeType === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-700'}`}>
                    {notice}
                  </div>
                )}
              </form>

              <div className="mt-4 text-center text-xs text-slate-500">{t('pro_contact_note')}</div>
              <div className="mt-2 text-center text-lg font-black text-[#7C4A00]">{proFeatures.price}</div>
              <div className="text-center text-sm text-slate-600">{planCopy.trial}</div>
            </div>
          </div>
        </div>
      )}
    </UpgradeContext.Provider>
  )
}

export const useUpgradeModal = () => {
  const ctx = useContext(UpgradeContext)
  if (!ctx) throw new Error('useUpgradeModal must be used inside UpgradeModalProvider')
  return ctx
}

export default UpgradeModalProvider
