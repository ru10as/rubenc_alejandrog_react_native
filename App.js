import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as StoreProvider, useDispatch } from "react-redux";
import { Provider as PaperProvider } from "react-native-paper";
import * as Notifications from 'expo-notifications';
import { ConfigureStore } from "./src/redux/configureStore";
import AppNavigator from "./src/presentation/navigation/AppNavigator";
import {
  fetchCamisetas,
  fetchComentarios,
  fetchCabeceras,
  fetchNovedades,
} from "./src/redux/ActionCreators";
import "./src/i18n/index";

// Configuración global (Fuera de los componentes)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const store = ConfigureStore();

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    // 1. Cargar datos
    dispatch(fetchCamisetas());
    dispatch(fetchComentarios());
    dispatch(fetchCabeceras());
    dispatch(fetchNovedades());

    // 2. Pedir permisos al arrancar
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permisos denegados');
      }
    };
    requestPermissions();

    // 3. Escuchar notificaciones
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log("Notificación recibida:", notification);
    });

    return () => subscription.remove();
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