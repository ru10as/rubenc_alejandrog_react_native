import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Campobase from './componentes/CampobaseComponent';
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/configureStore';

const store = ConfigureStore(); 
export default function App() { 
  return( 
    <Provider store={store}> 
      <SafeAreaProvider> 
        <View style={{flex: 1}}> 
          <Campobase/> 
          <StatusBar style="auto" /> 
        </View> 
      </SafeAreaProvider> 
    </Provider> 
  ); 
}
