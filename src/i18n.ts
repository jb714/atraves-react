import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
const en = require('./locales/en/translation.json');
const es = require('./locales/es/translation.json');
const sw = require('./locales/sw/translation.json');
const pt = require('./locales/pt/translation.json');
const fr = require('./locales/fr/translation.json');
const de = require('./locales/de/translation.json');
const it = require('./locales/it/translation.json');
const ja = require('./locales/ja/translation.json');
const zh = require('./locales/zh/translation.json');
const ru = require('./locales/ru/translation.json');
const ko = require('./locales/ko/translation.json');
const nl = require('./locales/nl/translation.json');

const resources = {
  en: { translation: en },
  es: { translation: es },
  sw: { translation: sw },
  pt: { translation: pt },
  fr: { translation: fr },
  de: { translation: de },
  it: { translation: it },
  ja: { translation: ja },
  zh: { translation: zh },
  ru: { translation: ru },
  ko: { translation: ko },
  nl: { translation: nl }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: Object.keys(resources),
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    },
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

// Ensure language is properly initialized
const storedLang = localStorage.getItem('i18nextLng');
const localeSwitcherLang = localStorage.getItem('LOCALE_SWITCHER_LANGUAGE');

// Use locale switcher language if available, otherwise fall back to stored language or browser language
const targetLang = localeSwitcherLang || storedLang;
if (targetLang && Object.keys(resources).includes(targetLang)) {
  i18n.changeLanguage(targetLang);
  // Keep i18nextLng in sync with locale switcher
  if (localeSwitcherLang) {
    localStorage.setItem('i18nextLng', localeSwitcherLang);
  }
} else {
  const browserLang = navigator.language.split('-')[0];
  const detectedLang = Object.keys(resources).includes(browserLang) ? browserLang : 'en';
  i18n.changeLanguage(detectedLang);
}

// Listen for changes to LOCALE_SWITCHER_LANGUAGE
window.addEventListener('storage', (e) => {
  if (e.key === 'LOCALE_SWITCHER_LANGUAGE' && e.newValue) {
    i18n.changeLanguage(e.newValue);
    localStorage.setItem('i18nextLng', e.newValue);
  }
});

export default i18n; 