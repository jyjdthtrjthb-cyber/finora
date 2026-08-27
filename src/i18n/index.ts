import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '../locales/en.json'
import ru from '../locales/ru.json'
import uz from '../locales/uz.json'

const resources = {
  en: { translation: en },
  ru: { translation: ru },
  uz: { translation: uz }
}

const savedLanguage = typeof window !== 'undefined' ? window.localStorage.getItem('finora_lang') : null
const initialLanguage = savedLanguage && ['en', 'ru', 'uz'].includes(savedLanguage) ? savedLanguage : 'ru'

i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: 'ru',
  interpolation: { escapeValue: false }
})

export default i18n
