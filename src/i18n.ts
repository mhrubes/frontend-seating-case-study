import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// import translations
import translationEN from './locales/en.json';
import translationCZ from './locales/cs.json';

// the translations
const resources = {
  en: {
    translation: translationEN,
  },
  cz: {
    translation: translationCZ,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'cz', // default language
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
