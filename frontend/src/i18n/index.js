import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import es from './locales/es.json'

const STORAGE_KEY = 'sproutfund_language'
const SUPPORTED_LANGUAGES = ['en', 'es']

// Called before init so the correct language is known before the first render,
// avoiding a flash of the wrong language on load
function getInitialLanguage() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (SUPPORTED_LANGUAGES.includes(stored)) return stored

  const browserLang = navigator.language?.slice(0, 2)
  return SUPPORTED_LANGUAGES.includes(browserLang) ? browserLang : 'en'
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

// data-theme on <html> follows the same pattern in ThemeContext; lang keeps that consistent
document.documentElement.setAttribute('lang', i18n.language)

i18n.on('languageChanged', (lng) => {
  localStorage.setItem(STORAGE_KEY, lng)
  document.documentElement.setAttribute('lang', lng)
})

export default i18n
