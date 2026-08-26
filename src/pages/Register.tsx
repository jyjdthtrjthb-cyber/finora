import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useTranslation } from 'react-i18next'

export default function Register() {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password !== confirm) return setError(t('password_mismatch'))

    setLoading(true)
    const redirectTo = `${window.location.origin}/`

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
        data: { full_name: name }
      }
    })

    if (error) {
      setLoading(false)
      setError(error.message)
      return
    }

    // If Supabase signs the user in immediately, skip email-verification screen.
    if (data?.session) {
      try {
        const userId = data.user?.id
        if (userId) {
          await supabase.from('profiles').upsert({
            id: userId,
            full_name: name,
            preferred_locale: 'ru',
            onboarding_completed: false
          }, { onConflict: 'id' })
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Failed to upsert profile row', e)
      }

      setLoading(false)
      navigate('/dashboard', { replace: true })
      return
    }

    // If email confirmation is required by the project, sign in right away anyway so the user is not stuck.
    const signInResult = await supabase.auth.signInWithPassword({ email, password })
    if (signInResult.error) {
      setLoading(false)
      setError(signInResult.error.message)
      return
    }

    try {
      const userId = signInResult.data?.user?.id
      if (userId) {
        await supabase.from('profiles').upsert({
          id: userId,
          full_name: name,
          preferred_locale: 'ru',
          onboarding_completed: false
        }, { onConflict: 'id' })
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Failed to upsert profile row after auto sign-in', e)
    }

    setLoading(false)
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{t('signup')}</h2>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm">Name</label>
          <input className="w-full p-2 border rounded" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm">{t('email')}</label>
          <input className="w-full p-2 border rounded" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm">{t('password')}</label>
          <input type="password" className="w-full p-2 border rounded" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm">{t('confirm_password')}</label>
          <input type="password" className="w-full p-2 border rounded" value={confirm} onChange={e => setConfirm(e.target.value)} />
        </div>
        {error && <div className="text-red-600">{error}</div>}
        <div>
          <button className="bg-finora text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Loading...' : t('signup')}</button>
        </div>
      </form>
    </div>
  )
}
