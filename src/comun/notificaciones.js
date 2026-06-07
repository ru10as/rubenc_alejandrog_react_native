import * as Notifications from 'expo-notifications'; // Importamos la herramienta de Expo para gestionar notificaciones push
import * as Device from 'expo-device';
import Constants from 'expo-constants'; // Importamos las configuraciones del proyecto
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../api/firebaseConfig'; // Importamos la instancia de la base de datos

export async function registrarTokenPush(uid) {
  if (!Device.isDevice) return; // Esto solo funciona en moviles reales

  // Canal obligatorio para Android 8+
  await Notifications.setNotificationChannelAsync('default', {
    name: 'default',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
  });

  // Pedir permiso para enviarle notificaciones
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;

  // Obtener token
  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
  
  console.log('Token de notificacion obtenido:', token);

  // 4. Guardar en Firestore (donde tu servidor lo buscara)
  await setDoc(doc(db, 'usuarios', uid), {
    pushToken: token,
    tokenActualizadoEn: serverTimestamp()
  }, { merge: true });
}