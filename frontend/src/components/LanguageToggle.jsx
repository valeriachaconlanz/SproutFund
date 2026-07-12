import { useTranslation } from 'react-i18next'
import './LanguageToggle.css'

function LanguageToggle() {
  const { t, i18n } = useTranslation()
  const isEnglish = i18n.language === 'en'

  function toggleLanguage() {
    i18n.changeLanguage(isEnglish ? 'es' : 'en')
  }

  return (
    <button
      className="language-toggle"
      onClick={toggleLanguage}
      aria-label={isEnglish ? t('language.switchToSpanish') : t('language.switchToEnglish')}
    >
      {isEnglish ? 'ES' : 'EN'}
    </button>
  )
}

export default LanguageToggle
