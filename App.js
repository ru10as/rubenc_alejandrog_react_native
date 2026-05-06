import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider, useDispatch } from 'react-redux';
import { ConfigureStore } from './src/redux/configureStore';
import AppNavigator from './src/presentation/navigation/AppNavigator';
import { fetchCamisetas, fetchComentarios, fetchCabeceras, fetchNovedades } from './src/redux/ActionCreators';
import { importarDatos } from './src/api/migrador'; // De esta forma podemos importar datos desde json


const store = ConfigureStore();

function AppContent() {
    const dispatch = useDispatch();
    
    useEffect(() => {
        // 1. COMENTA ESTA LÍNEA. Ya no la necesitas, los datos ya viven en la nube.
        // importarDatos(); 

        // 2. Ahora sí, lanza las peticiones de lectura
        dispatch(fetchCamisetas());
        dispatch(fetchComentarios());
        dispatch(fetchCabeceras());
        dispatch(fetchNovedades());
    }, [dispatch]);

    return <AppNavigator />;
}

export default function App() {
    return (
        <Provider store={store}>
            <SafeAreaProvider>
                <AppContent />
                <StatusBar style="auto" />
            </SafeAreaProvider>
        </Provider>
    );
}
