import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useTranslation } from 'react-i18next'

export default function ForgotPassword() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password'
    })
    if (error) setMessage(error.message)
    else setMessage(t('check_email_reset'))
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{t('forgot_password')}</h2>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm">{t('email')}</label>
          <input className="w-full p-2 border rounded" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        {message && <div className="text-sm text-gray-700">{message}</div>}
        <div>
          <button className="bg-finora text-white px-4 py-2 rounded">{t('send_reset_link')}</button>
        </div>
      </form>
    </div>
  )
}
