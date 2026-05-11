// src/api/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAB7DxuxgebjQknqwnpXfbY2YAm-GkoDR4",
  authDomain: "the12thman2.firebaseapp.com",
  projectId: "the12thman2",
  storageBucket: "the12thman2.firebasestorage.app",
  messagingSenderId: "35486353245",
  appId: "1:35486353245:web:9797c18128214665340ab4",
  measurementId: "G-P1J47SH1NB"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const storage = getStorage(app);