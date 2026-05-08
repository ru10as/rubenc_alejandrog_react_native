import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// Importamos tus traducciones (asegúrate de que los nombres coincidan)
import es from './es.json';
import en from './en.json';
import eu from './eu.json';

// Detectamos el idioma del dispositivo (o ponemos 'es' por defecto)
const deviceLanguage = Localization.locale ? Localization.locale.split('-')[0] : 'es';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
      eu: { translation: eu },
    },
    lng: deviceLanguage, // Idioma inicial
    fallbackLng: 'es',   // Si no encuentra un texto en inglés, lo pone en español
    compatibilityJSON: 'v3', // ESTO arregla el fallo en Android
    interpolation: {
      escapeValue: false, // React ya protege contra XSS
    },
  });

export default i18n;