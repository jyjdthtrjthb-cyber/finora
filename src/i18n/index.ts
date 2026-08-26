import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ru from '../locales/ru.json'
import uz from '../locales/uz.json'

const resources = {
  ru: { translation: ru },
  uz: { translation: uz }
}

const savedLanguage = typeof window !== 'undefined' ? window.localStorage.getItem('finora_lang') : null

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage || 'ru',
  fallbackLng: 'ru',
  interpolation: { escapeValue: false }
})

export default i18n
