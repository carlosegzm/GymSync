import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import pt from './locales/pt.json';
import en from './locales/en.json';
import es from './locales/es.json';

i18n
    .use(LanguageDetector)      // detecta idioma do browser automaticamente
    .use(initReactI18next)
    .init({
        resources: {
            pt: { translation: pt },
            en: { translation: en },
            es: { translation: es },
        },
        fallbackLng: 'pt',      // se o idioma não for suportado, cai em pt
        interpolation: {
            escapeValue: false, // React já escapa por padrão
        },
        detection: {
            order: ['navigator', 'htmlTag'],
            caches: [],         // não salva no localStorage — sempre usa o browser
        },
    });

export default i18n;