import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const { t } = useTranslation()
  const { user, signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await signIn(email, password)
    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{t('login')}</h2>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm">{t('email')}</label>
          <input className="w-full p-2 border rounded" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm">{t('password')}</label>
          <input type="password" className="w-full p-2 border rounded" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        {error && <div className="text-red-600">{error}</div>}
        <div className="flex items-center justify-between">
          <button className="bg-finora text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Loading...' : t('login')}</button>
          <Link to="/forgot-password" className="text-sm text-gray-600">{t('forgot_password')}</Link>
        </div>
      </form>
    </div>
  )
}
