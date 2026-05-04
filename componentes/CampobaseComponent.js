import { Component } from 'react';
import Catalogo from './CatalogoComponent'; // Antes Calendario
import DetalleCamiseta from './DetalleCamisetaComponent'; // Antes DetalleExcursion
import Constants from 'expo-constants';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './HomeComponent';
import Contacto from './ContactoComponent';
import QuienesSomos from './QuienesSomosComponent';
import { View, Platform, StyleSheet, Image, Text, Pressable } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList} from '@react-navigation/drawer'; 
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { colorTiendaClaro, colorTiendaOscuro } from '../comun/comun'; // Ajustad vuestros colores aquí
import { connect } from 'react-redux'; 
import { fetchCamisetas, fetchComentarios, fetchCabeceras, fetchNovedades } from '../redux/ActionCreators';

const Stack = createNativeStackNavigator(); // Crea la navegación en "pila" para entrar y salir de los detalles del producto.
const Drawer = createDrawerNavigator();     // Crea el menú lateral desplegable para navegar por la tienda.

const mapDispatchToProps = (dispatch) => ({             // Conecta funciones del componente con acciones de Redux para enviar datos.
  fetchCamisetas: () => dispatch(fetchCamisetas()),     // Ordena traer el catálogo de camisetas desde el servidor al iniciar.
  fetchComentarios: () => dispatch(fetchComentarios()), // Ordena traer los comentarios de camisetas desde el servidor al iniciar.
  fetchCabeceras: () => dispatch(fetchCabeceras()),     // Ordena traer los banners o imágenes principales de la tienda.
  fetchNovedades: () => dispatch(fetchNovedades()),     // Ordena traer las últimas ofertas o lanzamientos disponibles.
})

function BotonMenu(props) { // Con esta funcion lo que vamos a hacer es crear el boton para entrar en el menu lateral 
  return ( 
    <Pressable onPress={props.onPress} hitSlop={8}> 
      <MaterialCommunityIcons 
        name="menu" 
        size={40} 
        color={Platform.OS === 'ios' ? colorTiendaOscuro : 'white'} 
      /> 
    </Pressable> 
  ); 
} 

function CustomDrawerContent(props) { // Esta funcion la vamos a emplear para personalizar el menu lateral 
  return ( 
    <DrawerContentScrollView {...props}> 
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}> 
        <View style={styles.drawerHeader}> 
          <View style={styles.drawerHeaderImageContainer}> 
            <Image 
              source={require('./imagenes/logo.png')} 
              style={styles.drawerImage} 
            /> 
          </View> 
          <View style={styles.drawerHeaderTextContainer}> 
            <Text style={styles.drawerHeaderText}>The 12th Man</Text> 
          </View> 
        </View> 
        <DrawerItemList {...props} /> 
      </SafeAreaView> 
    </DrawerContentScrollView> 
  ); 
}

class Campobase extends Component { // Definimos el componente principal de la aplicacion 
  componentDidMount() { // Esto lo hacemos para disparar las funciones 
    this.props.fetchCamisetas(); 
    this.props.fetchComentarios(); 
    this.props.fetchCabeceras(); 
    this.props.fetchNovedades(); 
  }

  menuHeaderOptions = (title, navigation) => ({ // Para establecer la cabecera
    title, 
    headerLeft: () => ( 
      <BotonMenu onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} /> 
    ), 
  });

  HomeNavegador = () => { // Definimos la navegacion interna de la pantalla principal 
    return ( 
      <Stack.Navigator 
        screenOptions={{ 
          headerTitleAlign: 'center',
          headerTintColor: '#fff', 
          headerStyle: { backgroundColor: colorTiendaOscuro }, 
        }} 
      > 
        <Stack.Screen 
          name="Home"
          component={Home} 
          options={({ navigation }) => this.menuHeaderOptions('The 12th Man', navigation)} 
        /> 
      </Stack.Navigator> 
    ); 
  };

  CatalogoNavegador = () => { // Creamos el flujo de navegacion del catalogo
    return ( 
      <Stack.Navigator 
        screenOptions={{ 
          headerTitleAlign: 'center',
          headerTintColor: '#fff', 
          headerStyle: { backgroundColor: colorTiendaOscuro }, 
        }} 
      > 
        <Stack.Screen 
          name="Catalogo" 
          component={Catalogo}
          options={({ navigation }) => this.menuHeaderOptions('Nuestras Camisetas', navigation)}
        />
        <Stack.Screen 
          name="DetalleCamiseta" 
          component={DetalleCamiseta}
          options={{ title: 'Detalle de Producto' }} 
        />
      </Stack.Navigator> 
    ); 
  }; 

  // ... (QuienesSomosNavegador y ContactoNavegador se mantienen igual, solo cambiad el colorTiendaOscuro)

  DrawerNavegador = () => { // Organizamos la navegacion del menu lateral 
    return ( 
      <Drawer.Navigator 
        initialRouteName="Inicio" 
        drawerContent={(props) => <CustomDrawerContent {...props} />} 
        screenOptions={{ 
          headerShown: false, 
          drawerStyle: { backgroundColor: colorTiendaClaro }, 
        }} 
      > 
        <Drawer.Screen 
          name="Inicio" 
          component={this.HomeNavegador} 
          options={{ 
            drawerIcon: ({ color, size }) => ( 
              <MaterialCommunityIcons name="home" color={color} size={size} /> 
            ), 
          }} 
        />
        <Drawer.Screen 
          name="Camisetas"
          component={this.CatalogoNavegador}
          options={{
            drawerIcon: ({ color, size }) => ( 
              <MaterialCommunityIcons name="tshirt-crew" color={color} size={size} /> 
            ),
          }}
        />
        {/* Aqui añadiremos Quienes Somos y Contacto igual que arriba */}
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
  container: {
    flex: 1,
  },
  drawerHeader: {
    backgroundColor: colorTiendaOscuro,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  drawerHeaderText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  drawerHeaderImageContainer: {
    flex: 1,
    alignItems: 'center',
  },
  drawerHeaderTextContainer: {
    flex: 2,
  },
  drawerImage: {
    margin: 10,
    width: 80,
    height: 60,
    resizeMode: 'contain',
  }
});

export default connect(null, mapDispatchToProps)(Campobase);