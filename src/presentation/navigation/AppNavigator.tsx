import React from 'react';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Platform, StyleSheet, Image, Text, Pressable,TouchableOpacity } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { colorTiendaOscuro, colorTiendaClaro } from '../../comun/comun';

// Componentes
import HomeComponent from '../components/HomeComponent';
import CatalogoComponent from '../components/CatalogoComponent';
import DetalleCamisetaComponent from '../components/DetalleCamisetaComponent';
import DetalleCamisetaSMano from '../components/DetalleCamisetaSMano';
import QuienesSomosComponent from '../components/QuienesSomosComponent';
import ContactoComponent from '../components/ContactoComponent';
import ConfiguracionComponent from '../components/ConfiguracionComponent';
import CarritoComponent from '../components/CarritoComponent';

import AuthScreen from '../screens/AuthScreen';
import { useSelector } from 'react-redux';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();


const screenOptions = {
    headerTitleAlign: 'center' as const,
    headerTintColor: '#fff',
    headerStyle: { backgroundColor: colorTiendaOscuro },
};

function BotonMenu({ onPress }: { onPress: () => void }) {
    return (
        <Pressable onPress={onPress} hitSlop={8} style={{ marginLeft: 15 }}>
            <MaterialCommunityIcons
                name="menu"
                size={40}
                color={Platform.OS === 'ios' ? colorTiendaOscuro : 'white'}
            />
        </Pressable>
    );
}

function headerOptions(title: string, navigation: any) {
    return {
        title,
        headerLeft: () => (
            <BotonMenu onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} />
        ),
    };
}

function CustomDrawerContent(props: any) {
    return (
        <DrawerContentScrollView {...props}>
            <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
                <View style={styles.drawerHeader}>
                    <View style={styles.drawerHeaderImageContainer}>
                        <Image
                            source={require('../../../assets/images/logo.png')}
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



function HomeStack() {
    return (
        <Stack.Navigator id="HomeStack" screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="Home"
                component={HomeComponent}
                options={({ navigation }) => headerOptions('The 12th Man', navigation)}
            />
            <Stack.Screen
                name="DetalleCamiseta"
                component={DetalleCamisetaComponent}
                options={{ title: 'Detalle de Producto' }}
            />
        </Stack.Navigator>
    );
}

function CatalogoStack() {
    return (
        <Stack.Navigator id="CatalogoStack" screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="Catalogo"
                component={CatalogoComponent}
                options={({ navigation }) => headerOptions('Nuestras Camisetas', navigation)}
            />
            <Stack.Screen
                name="DetalleCamiseta"
                component={DetalleCamisetaComponent}
                options={{ title: 'Detalle de Producto' }}
            />
            <Stack.Screen
                name="DetalleCamisetaSMano"
                component={DetalleCamisetaSMano}
                options={{ title: 'Detalle Segunda Mano' }}
            />
        </Stack.Navigator>
    );
}

function CarritoStack() {
    return (
        <Stack.Navigator id="CarritoStack" screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="CarritoScreen"
                component={CarritoComponent}
                options={({ navigation }) => headerOptions('Mi Carrito', navigation)}
            />
            <Stack.Screen
                name="DetalleCamiseta"
                component={DetalleCamisetaComponent}
                options={{ title: 'Detalle de Producto' }}
            />
        </Stack.Navigator>
    );
}

function QuienesSomosStack() {
    return (
        <Stack.Navigator id="QuienesSomosStack" screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="QuienesSomos"
                component={QuienesSomosComponent}
                options={({ navigation }) => headerOptions('Quiénes Somos', navigation)}
            />
        </Stack.Navigator>
    );
}

function ContactoStack() {
    return (
        <Stack.Navigator id="ContactoStack" screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="Contacto"
                component={ContactoComponent}
                options={({ navigation }) => headerOptions('Contacto', navigation)}
            />
        </Stack.Navigator>
    );
}

function AuthStack() {
    return (
        <Stack.Navigator id="AuthStack" screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="Autenticacion"
                component={AuthScreen}
            />
        </Stack.Navigator>
    );
}

function ConfiguracionStack() {
    return (
        <Stack.Navigator id="ConfiguracionStack" screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="Configuracion"
                component={ConfiguracionComponent}
                options={({ navigation }) => headerOptions('Configuración', navigation)}
            />
        </Stack.Navigator>
    );
}

export default function AppNavigator() {
    const datosUsuario = useSelector((state: any) => state.usuario);
    const estaLogueado = datosUsuario?.user;
    return (
        <NavigationContainer>
            <View style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight }}>
                <Drawer.Navigator 
                    id="MainDrawer"
                    initialRouteName="Inicio"
                    drawerContent={(props) => <CustomDrawerContent {...props} />}
                    screenOptions={({ navigation }) => ({
                        headerShown: true, 
                        
                        headerTitle: 'The 12th Man', 
                        headerStyle: {
                            backgroundColor: '#001222',
                            elevation: 0, 
                            shadowOpacity: 0,
                        },
                        headerTintColor: '#fff',
                        headerTitleAlign: 'center',

                        drawerStyle: { backgroundColor: colorTiendaClaro },
                        headerRight: () => (
                            estaLogueado ? (
                                <TouchableOpacity onPress={() => navigation.navigate('Acceso usuario')}>
                                    <MaterialCommunityIcons name="account-check" size={28} color="green" style={{marginRight: 15}} />
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity 
                                    style={styles.botonRegistroHeader} 
                                    onPress={() => navigation.navigate('Acceso usuario')}
                                >
                                    <Text style={{color: 'white', fontWeight: 'bold', fontSize:12}}>Registrarse</Text>
                                </TouchableOpacity>
                            )
                        ),
                    })}
                >
                    <Drawer.Screen
                        name="Inicio"
                        component={HomeStack}
                        options={{
                            drawerIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="home" color={color} size={size} />
                            ),
                        }}
                    />
                    <Drawer.Screen
                        name="Camisetas"
                        component={CatalogoStack}
                        options={{
                            drawerIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="tshirt-crew" color={color} size={size} />
                            ),
                        }}
                    />
                    <Drawer.Screen
                        name="Mi Carrito"
                        component={CarritoStack}
                        options={{
                            drawerIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="cart" color={color} size={size} />
                            ),
                        }}
                    />
                    <Drawer.Screen
                        name="Quiénes Somos"
                        component={QuienesSomosStack}
                        options={{
                            drawerIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="information" color={color} size={size} />
                            ),
                        }}
                    />
                    <Drawer.Screen
                        name="Contacto"
                        component={ContactoStack}
                        options={{
                            drawerIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="phone" color={color} size={size} />
                            ),
                        }}
                    />
                    <Drawer.Screen
                        name="Acceso usuario" 
                        component={AuthStack}
                        options={{
                            drawerItemStyle: { display: 'none' }, 
                            drawerIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="account" color={color} size={size} />
                            ),
                        }}
                    />

                    <Drawer.Screen
                        name="Configuración"
                        component={ConfiguracionStack}
                        options={{
                            drawerIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="cog" color={color} size={size} />
                            ),
                        }}
                    />

                </Drawer.Navigator>
            </View>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
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
    },
    botonRegistroHeader: {
    backgroundColor: '#f44336', 
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
},
});
