import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider, useDispatch } from 'react-redux';
import { ConfigureStore } from './src/redux/configureStore';
import AppNavigator from './src/presentation/navigation/AppNavigator';
import { fetchCamisetas, fetchComentarios, fetchCabeceras, fetchNovedades } from './src/redux/ActionCreators';

const store = ConfigureStore();

function AppContent() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchCamisetas());
        dispatch(fetchComentarios());
        dispatch(fetchCabeceras());
        dispatch(fetchNovedades());
    }, []);
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
