import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as StoreProvider, useDispatch } from "react-redux"; // Renombrado como StoreProvider
import { Provider as PaperProvider } from "react-native-paper"; // IMPORTACIÓN NECESARIA
import { ConfigureStore } from "./src/redux/configureStore";
import AppNavigator from "./src/presentation/navigation/AppNavigator";
import {
  fetchCamisetas,
  fetchComentarios,
  fetchCabeceras,
  fetchNovedades,
} from "./src/redux/ActionCreators";
import "./src/i18n/index";

const store = ConfigureStore();

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCamisetas());
    dispatch(fetchComentarios());
    dispatch(fetchCabeceras());
    dispatch(fetchNovedades());
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