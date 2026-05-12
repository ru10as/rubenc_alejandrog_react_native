import i18n from 'i18next'; // Traemos la libreria o motor principal 
import { initReactI18next } from 'react-i18next'; // Importamos el puente para React entienda i18next
import * as Localization from 'expo-localization'; // Importa la herramienta de expo para lectura de ajuste de idiomas del telefono

import es from './es.json'; // Carga de diccionarios 
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
    lng: deviceLanguage,
    fallbackLng: 'es',
    compatibilityJSON: 'v3',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;