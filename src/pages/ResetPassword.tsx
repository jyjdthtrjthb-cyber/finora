import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function ResetPassword() {
  const { t } = useTranslation()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const navigate = useNavigate()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) return setMessage(t('password_mismatch'))
    const { error } = await supabase.auth.updateUser({ password })
    if (error) setMessage(error.message)
    else navigate('/login')
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{t('reset_password')}</h2>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm">{t('new_password')}</label>
          <input className="w-full p-2 border rounded" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm">{t('confirm_new_password')}</label>
          <input className="w-full p-2 border rounded" value={confirm} onChange={e => setConfirm(e.target.value)} />
        </div>
        {message && <div className="text-red-600">{message}</div>}
        <div>
          <button className="bg-finora text-white px-4 py-2 rounded">{t('set_new_password')}</button>
        </div>
      </form>
    </div>
  )
}
