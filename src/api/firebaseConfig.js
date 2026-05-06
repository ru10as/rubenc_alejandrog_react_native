// src/api/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Añadimos estas tres importaciones para el Login
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyARBh4fxHvoGvKCV2F6Qg2n8Bakv45jDUU",
  authDomain: "the-12th-man-4ddcf.firebaseapp.com",
  projectId: "the-12th-man-4ddcf",
  storageBucket: "the-12th-man-4ddcf.firebasestorage.app",
  messagingSenderId: "831451288833",
  appId: "1:831451288833:web:e26f50363b3b7b62a27700",
  measurementId: "G-TP6CHEMBGY"
};

// Inicializamos la App
const app = initializeApp(firebaseConfig);

// Exportamos la conexión a la base de datos
export const db = getFirestore(app);

// CONFIGURACIÓN DE AUTH CON PERSISTENCIA
// Esto soluciona el Warning amarillo que te salía antes
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});