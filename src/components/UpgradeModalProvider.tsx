import React, { createContext, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

type UpgradeContextType = {
  openUpgrade: (opts?: { featureTitle?: string }) => void
}

const UpgradeContext = createContext<UpgradeContextType | undefined>(undefined)

export const UpgradeModalProvider = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation()
  const { activatePro } = useAuth()
  const [open, setOpen] = useState(false)
  const [featureTitle, setFeatureTitle] = useState<string | undefined>(undefined)
  const [promo, setPromo] = useState('')
  const [notice, setNotice] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const openUpgrade = (opts?: { featureTitle?: string }) => {
    setFeatureTitle(opts?.featureTitle)
    setOpen(true)
  }

  const validatePromo = async (code: string) => {
    setLoading(true)
    setNotice(null)
    try {
      const { data, error } = await supabase.rpc('validate_promo', { code }) as any
      if (error) {
        setNotice(t('invalid_promo'))
        setLoading(false)
        return false
      }

      // Expect server to return { valid: true }
      if (data?.valid) {
        const ok = await activatePro()
        setLoading(false)
        return ok
      }

      setNotice(t('invalid_promo'))
      setLoading(false)
      return false
    } catch (err: any) {
      // If RPC or server function is missing, show admin instruction
      setNotice(t('promo_server_missing'))
      setLoading(false)
      return false
    }
  }

  return (
    <UpgradeContext.Provider value={{ openUpgrade }}>
      {children}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-2xl rounded-[28px] border border-[#F8D66D]/30 bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.4)]">
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex rounded-full bg-slate-900 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#FDE68A]">FINORA PRO</div>
                <h3 className="mt-4 text-3xl font-black text-slate-900">{t('get_finora_pro')}</h3>
                <div className="mt-3 text-2xl font-black text-[#7C4A00]">100,000 UZS / month</div>
                <div className="mt-1 text-sm text-slate-600">{t('seven_day_trial')}</div>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="text-xl text-slate-500">×</button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-semibold">{t('pro_marketing_intro')}</div>
                <ul className="mt-3 list-inside list-disc text-sm text-slate-700">
                  <li>{t('pro_feature_more_goals')}</li>
                  <li>{t('pro_feature_debt_management')}</li>
                  <li>{t('pro_feature_bank_growth')}</li>
                  <li>{t('pro_feature_child_fund')}</li>
                  <li>{t('pro_feature_multiple_currencies')}</li>
                  <li>{t('pro_feature_business_roi')}</li>
                  <li>{t('pro_feature_advanced_analytics')}</li>
                  <li>{t('pro_feature_what_if')}</li>
                  <li>{t('pro_feature_money_wisdom')}</li>
                  <li>{t('pro_feature_long_term')}</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{t('pro_comparison')}</div>
                <div className="mt-3 text-sm text-slate-700">
                  <strong>{t('free')}:</strong> {t('free_list')}
                </div>
                <div className="mt-3 text-sm text-slate-700">
                  <strong>{t('pro')}:</strong> {t('pro_list')}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <button type="button" onClick={() => { /* placeholder for purchase flow: keep manual contact */ window.open('https://t.me/Bilol_44', '_blank') }} className="rounded-xl bg-gradient-to-r from-[#FFD700] via-[#F59E0B] to-[#D4AF37] px-4 py-3 text-sm font-bold text-slate-900">{t('contact_on_telegram')}</button>
              <button type="button" onClick={() => { /* manual purchase preserved: open contact */ window.open('https://t.me/Bilol_44', '_blank') }} className="rounded-xl border border-slate-200 px-4 py-3 font-medium text-slate-700">{t('purchase_pro')}</button>
            </div>

            <form onSubmit={async (e) => { e.preventDefault(); if (!promo) return; const ok = await validatePromo(promo); if (ok) { setNotice(t('pro_activated')); setPromo(''); setOpen(false) } }} className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <label className="mb-2 block text-sm font-medium text-slate-700">{t('promo_placeholder')}</label>
              <input value={promo} onChange={(e) => setPromo(e.target.value)} placeholder={t('promo_placeholder')} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none focus:border-[#D4AF37]" />
              <div className="mt-3 flex gap-2">
                <button type="submit" className="flex-1 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#F59E0B] to-[#D4AF37] px-4 py-3 font-bold text-slate-900">{t('continue')}</button>
              </div>
              {notice && <div className="mt-3 text-sm font-medium text-[#7C4A00]">{notice}</div>}
            </form>

            <div className="mt-4 text-xs text-slate-500">{t('pro_contact_note')}</div>
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
