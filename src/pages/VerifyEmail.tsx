import React from 'react'
import { useTranslation } from 'react-i18next'

export default function VerifyEmail() {
  const { t } = useTranslation()

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{t('verify_email')}</h2>
      <p>{t('verify_email_message')}</p>
    </div>
  )
}
