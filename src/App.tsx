import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CurrencyProvider } from './context/CurrencyContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import VerifyEmail from './pages/VerifyEmail'
import Dashboard from './pages/Dashboard'
import Reviews from './pages/Reviews'
// MoneyWisdom is accessible inside the authenticated Dashboard; no public Money Wisdom page
import { useAuth, AuthProvider } from './hooks/useAuth'
import { UpgradeModalProvider } from './components/UpgradeModalProvider'
import Onboarding from './pages/Onboarding'
import { supabase } from './lib/supabase'

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth()
  const [profile, setProfile] = React.useState<any | null>(null)

  React.useEffect(() => {
    let mounted = true
    if (!user) {
      setProfile(null)
      return
    }

    import('./lib/supabase').then(({ supabase }) => {
      supabase.from('profiles').select('onboarding_completed').eq('id', user.id).single().then(res => {
        if (!mounted) return
        if (!res.error) setProfile(res.data)
        else setProfile({ onboarding_completed: false })
      })
    })

    return () => { mounted = false }
  }, [user])

  if (loading) return <div className="p-6">Loading...</div>
  if (!user) return <Navigate to="/login" replace />

  const pathname = typeof window !== 'undefined' ? window.location.pathname : ''
  const onboardingPath = '/onboarding'
  const localOnboardingComplete = typeof window !== 'undefined' && window.localStorage.getItem('finora_hasCompletedOnboarding') === 'true'
  const onboardingComplete = profile?.onboarding_completed === true || localOnboardingComplete

  if (!onboardingComplete && pathname !== onboardingPath) {
    return <Navigate to={onboardingPath} replace />
  }

  if (onboardingComplete && pathname === onboardingPath) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function AppRoutes() {
  const { t, i18n } = useTranslation()
  const { user, subscriptionStatus, signOut } = useAuth()

  const setLanguage = async (lang: 'ru' | 'uz' | 'en') => {
    i18n.changeLanguage(lang)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('finora_lang', lang)
    }

    if (user?.id) {
      try {
        await supabase.from('profiles').upsert({ id: user.id, preferred_locale: lang }, { onConflict: 'id' })
      } catch (error) {
        // ignore profile sync errors and keep the client preference
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="p-6 flex flex-wrap items-center justify-between gap-3">
        <Link to="/" className="text-xl font-bold text-slate-900">{t('brand')}</Link>
        <nav className="flex items-center gap-3">
          {!user && (
            <>
              <Link to="/login" className="text-sm text-gray-700">{t('login')}</Link>
              <Link to="/register" className="text-sm text-gray-700">{t('signup')}</Link>
            </>
          )}
          {user && (
            <>
              <Link to="/dashboard" className="text-sm text-gray-700">{t('dashboard')}</Link>
              <button type="button" onClick={async () => { await signOut(); window.location.href = '/' }} className="text-sm text-gray-700">
                {t('logout')}
              </button>
            </>
          )}

          {subscriptionStatus === 'pro' && (
            <div className="rounded-full border border-[#D4AF37] bg-[#FFF8D6] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#7C4A00] shadow-[0_8px_20px_rgba(212,175,55,0.4)]">
              FINORA PRO
            </div>
          )}
          <div className="ml-2 inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
            <button type="button" onClick={() => void setLanguage('ru')} className={`rounded-full px-2 py-1 text-xs font-semibold ${i18n.language.startsWith('ru') ? 'bg-slate-900 text-white' : 'text-slate-600'}`}>
              RU
            </button>
            <button type="button" onClick={() => void setLanguage('uz')} className={`rounded-full px-2 py-1 text-xs font-semibold ${i18n.language.startsWith('uz') ? 'bg-slate-900 text-white' : 'text-slate-600'}`}>
              UZ
            </button>
            <button type="button" onClick={() => void setLanguage('en')} className={`rounded-full px-2 py-1 text-xs font-semibold ${i18n.language.startsWith('en') ? 'bg-slate-900 text-white' : 'text-slate-600'}`}>
              EN
            </button>
          </div>
        </nav>
      </header>
      <main className="p-6">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/money-wisdom" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
          <Route path="/time-to-freedom" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/what-if" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <UpgradeModalProvider>
          <AppRoutes />
        </UpgradeModalProvider>
      </CurrencyProvider>
    </AuthProvider>
  )
}
