import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as StoreProvider, useDispatch } from "react-redux";
import { Provider as PaperProvider } from "react-native-paper";
import * as Notifications from 'expo-notifications';
import { onAuthStateChanged } from "firebase/auth";
import { ConfigureStore } from "./src/redux/configureStore";
import AppNavigator from "./src/presentation/navigation/AppNavigator";
import {
  fetchCamisetas,
  fetchComentarios,
  fetchCabeceras,
  fetchNovedades,
  restoreSession,
} from "./src/redux/ActionCreators";
import { auth } from "./src/api/firebaseConfig";
import { configureGoogleSignIn } from "./src/api/googleAuth";
import "./src/i18n/index";

// Configuración global de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const store = ConfigureStore();
configureGoogleSignIn();

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCamisetas());
    dispatch(fetchComentarios());
    dispatch(fetchCabeceras());
    dispatch(fetchNovedades());

    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') console.log('Permisos de notificaciones denegados');
    };
    requestPermissions();

    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log("Notificación recibida:", notification);
    });

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      dispatch(restoreSession(firebaseUser));
    });

    return () => {
      subscription.remove();
      unsubscribeAuth();
    };
  }, [dispatch]);

  return <AppNavigator />;
}

export default function App() {
  return (
    <StoreProvider store={store}>
      <PaperProvider>
        <SafeAreaProvider>
          <AppContent />
          <StatusBar style="auto" />
        </SafeAreaProvider>
      </PaperProvider>
    </StoreProvider>
  );
}