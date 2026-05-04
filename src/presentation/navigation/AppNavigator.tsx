import { Component } from 'react';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Platform, StyleSheet, Image, Text, Pressable } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList} from '@react-navigation/drawer'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { connect } from 'react-redux';
import Constants from 'expo-constants';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Colores base
const colorPrincipal = '#2e7d32';
const colorSecundario = '#a5d6a7';

const mapDispatchToProps = (dispatch: any) => ({ 
})

function BotonMenu(props: any) { 
  return ( 
    <Pressable onPress={props.onPress} hitSlop={8}> 
      <MaterialCommunityIcons 
        name="menu" 
        size={40} 
        color={Platform.OS === 'ios' ? colorPrincipal : 'white'} 
      /> 
    </Pressable> 
  ); 
} 

function CustomDrawerContent(props: any) { 
  return ( 
    <DrawerContentScrollView {...props}> 
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}> 
        <View style={styles.drawerHeader}> 
          <View style={styles.drawerHeaderImageContainer}> 
            <Image 
              source={require('../../assets/images/fondo_maracana.png')}
              style={styles.drawerImage} 
            /> 
          </View> 
          <View style={styles.drawerHeaderTextContainer}> 
            <Text style={styles.drawerHeaderText}>Hola, he hecho este cambio</Text> 
          </View> 
        </View> 
        <DrawerItemList {...props} /> 
      </SafeAreaView> 
    </DrawerContentScrollView> 
  ); 
}

class AppNavigator extends Component<any> {
  componentDidMount() { 
  }

  menuHeaderOptions = (title: string, navigation: any) => ({ 
    title, 
    headerLeft: () => ( 
      <BotonMenu 
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} 
      /> 
    ), 
  });

  HomeNavegador = () => { 
    return ( 
      <Stack.Navigator 
        id="StackHome"
        screenOptions={{ 
          headerTitleAlign: 'center',
          headerTintColor: '#fff', 
          headerStyle: { backgroundColor: colorPrincipal }, 
          headerTitleStyle: { color: '#fff' }, 
        }} 
      > 
        <Stack.Screen 
          name="Home"
          component={HomeScreen} 
          options={({ navigation }) => 
            this.menuHeaderOptions('Campo Base', navigation) 
          } 
        /> 
      </Stack.Navigator> 
    ); 
  };

  AuthNavegador = () => {
    return(
      <Stack.Navigator
        id="StackAuth"
        screenOptions={{ 
          headerTitleAlign: 'center',
          headerTintColor: '#fff', 
          headerStyle: { backgroundColor: colorPrincipal }, 
          headerTitleStyle: { color: '#fff' }, 
        }}>
      <Stack.Screen 
        name="Login"
        component={LoginScreen}
        options={({ navigation }) => this.menuHeaderOptions('Acceso Jugadores', navigation)}
      />
      <Stack.Screen 
        name="Register"
        component={RegisterScreen}
        options={{ title: 'Registro de Cantera' }}
      />
      </Stack.Navigator>
    )
  }

  DrawerNavegador = () => { 
    return ( 
      <Drawer.Navigator 
        id="MainDrawer"
        initialRouteName="Campo base" 
        drawerContent={(props) => <CustomDrawerContent {...props} />} 
        screenOptions={{ 
          headerShown: false, 
          drawerStyle: { backgroundColor: colorSecundario }, 
        }} 
      > 
        <Drawer.Screen 
          name="Campo base" 
          component={this.HomeNavegador} 
          options={{ 
            drawerIcon: ({ color, size }) => ( 
              <MaterialCommunityIcons name="home" color={color} size={size} /> 
            ), 
          }} 
        />

        <Drawer.Screen
          name="Entrar"
          component={this.AuthNavegador}
          options={{
            drawerIcon: ({ color, size }) => ( 
              <MaterialCommunityIcons name="login" color={color} size={size} /> 
            ),
          }}
        />
      </Drawer.Navigator> 
    ); 
  }; 

  render() { 
    return ( 
      <NavigationContainer> 
        <View style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight }}> 
          <this.DrawerNavegador /> 
        </View> 
      </NavigationContainer> 
    ); 
  } 
}

const styles = StyleSheet.create({ 
  container: { flex: 1 }, 
  drawerHeader: { 
    backgroundColor: colorPrincipal, 
    height: 100, 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 8, 
  }, 
  drawerHeaderImageContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
}, 
  drawerHeaderTextContainer: { 
    flex: 2, 
    justifyContent: 'center' 
}, 
  drawerHeaderText: { 
    color: 'white', 
    fontSize: 20, 
    fontWeight: 'bold' 
}, 
  drawerImage: { 
    width: 60, 
    height: 60, 
    resizeMode: 'contain' 
}, 
});

export default connect(null, mapDispatchToProps)(AppNavigator);