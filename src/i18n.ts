import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// import translations
import translationEN from './locales/en.json';
import translationCZ from './locales/cs.json';

i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  .init({
    debug: true,
    fallbackLng: 'cz',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
      transKeepBasicHtmlNodesFor: ['strong']
    },
    resources: {
      en: {
        translation: translationEN
      },
      cz: {
        translation: translationCZ,
      },
    }
  });

export default i18n;