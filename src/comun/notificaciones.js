import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../api/firebaseConfig'; 

export async function registrarTokenPush(uid) {
  if (!Device.isDevice) return; // Esto solo funciona en móviles reales

  // 1. Canal obligatorio para Android 8+
  await Notifications.setNotificationChannelAsync('default', {
    name: 'default',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
  });

  // 2. Pedir permiso
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;

  // 3. Obtener token
  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
  
  // 4. Guardar en Firestore (donde tu servidor lo buscará)
  await setDoc(doc(db, 'usuarios', uid), {
    pushToken: token,
    tokenActualizadoEn: serverTimestamp()
  }, { merge: true });
}