import React from 'react';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Platform, StyleSheet, Image, Text, Pressable, TouchableOpacity } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { colorTiendaOscuro, colorTiendaClaro, colorTiendaAcento } from '../../comun/comun';
import { useTranslation } from 'react-i18next';
import MisOfertasComponent from '../components/MisOfertasComponent';
import ChatOfertaComponent from '../components/ChatOfertaComponent';

// Componentes
import HomeComponent from '../components/HomeComponent';
import CatalogoComponent from '../components/CatalogoComponent';
import DetalleCamisetaComponent from '../components/DetalleCamisetaComponent';
import DetalleCamisetaSMano from '../components/DetalleCamisetaSMano';
import ChatComponent from '../components/ChatComponent';
import ChatsListComponent from '../components/ChatsListComponent';
import QuienesSomosComponent from '../components/QuienesSomosComponent';
import ContactoComponent from '../components/ContactoComponent';
import ConfiguracionComponent from '../components/ConfiguracionComponent';
import CarritoComponent from '../components/CarritoComponent';
import AuthScreen from '../screens/AuthScreen';
import SubirProductoScreen from '../screens/SubirProductoScreen';
import { useSelector } from 'react-redux';
import MisVentasComponent from '../components/MisVentasComponent';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function BotonMenu({ onPress }: { onPress: () => void }) {
    return (
        <Pressable onPress={onPress} hitSlop={8} style={{ marginLeft: 15 }}>
            <MaterialCommunityIcons name="menu" size={40} color={Platform.OS === 'ios' ? colorTiendaOscuro : 'white'} />
        </Pressable>
    );
}

function headerOptions(title: string, navigation: any) {
    return {
        title,
        headerLeft: () => <BotonMenu onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} />,
    };
}

function CustomDrawerContent(props: any) {
    const { t } = useTranslation();
    return (
        <DrawerContentScrollView {...props}>
            <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
                <View style={styles.drawerHeader}>
                    <View style={styles.drawerHeaderImageContainer}>
                        <Image source={require('../../../assets/images/logo.png')} style={styles.drawerImage} />
                    </View>
                    <View style={styles.drawerHeaderTextContainer}>
                        <Text style={styles.drawerHeaderText}>The 12th Man</Text>
                        <Text style={styles.drawerHeaderSubtitle}>{t('Navigation.Tagline')}</Text>
                    </View>
                </View>
                <DrawerItemList {...props} />
            </SafeAreaView>
        </DrawerContentScrollView>
    );
}

// STACKS
function HomeStack() {
    const { t } = useTranslation();
    return (
        <Stack.Navigator id="HomeStack" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeComponent} options={({ navigation }) => headerOptions('The 12th Man', navigation)} />
            <Stack.Screen name="DetalleCamiseta" component={DetalleCamisetaComponent} options={{ title: t('Navigation.DetalleProducto') }} />
            <Stack.Screen name="DetalleCamisetaSMano" component={DetalleCamisetaSMano} options={{ title: t('Navigation.DetalleSegundaMano') }} />
        </Stack.Navigator>
    );
}

function CatalogoStack() {
    const { t } = useTranslation();
    return (
        <Stack.Navigator id="CatalogoStack" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Catalogo" component={CatalogoComponent} options={({ navigation }) => headerOptions(t('Navigation.NuestrasCamisetas'), navigation)} />
            <Stack.Screen name="DetalleCamiseta" component={DetalleCamisetaComponent} options={{ title: t('Navigation.DetalleProducto') }} />
            <Stack.Screen name="DetalleCamisetaSMano" component={DetalleCamisetaSMano} options={{ title: t('Navigation.DetalleSegundaMano') }} />
            <Stack.Screen name="Chat" component={ChatComponent} options={({ route }: any) => ({ title: route.params?.vendedorNombre || t('Navigation.Chat') })} />
        </Stack.Navigator>
    );
}

function ChatsStack() {
    const { t } = useTranslation();
    return (
        <Stack.Navigator id="ChatsStack" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MisChats" component={ChatsListComponent} options={({ navigation }) => headerOptions(t('Navigation.MisChats'), navigation)} />
            <Stack.Screen name="Chat" component={ChatComponent} options={({ route }: any) => ({ title: route.params?.vendedorNombre || t('Navigation.Chat') })} />
        </Stack.Navigator>
    );
}

function MisOfertasStack() {
    const { t } = useTranslation();
    return (
        <Stack.Navigator id="MisOfertasStack" screenOptions={{ headerShown: false }}>
            <Stack.Screen 
                name="MisOfertas" 
                component={MisOfertasComponent} 
                options={({ navigation }) => headerOptions(t('Navigation.MisOfertas'), navigation)}
            />
            <Stack.Screen name="ChatOferta" component={ChatOfertaComponent} />
        </Stack.Navigator>
    );
}

function MisVentasStack() {
    return (
        <Stack.Navigator id="MisVentasStack" screenOptions={{ headerShown: false }}>
            <Stack.Screen 
                name="MisVentas" 
                component={MisVentasComponent} 
            />
            <Stack.Screen name="ChatOferta" component={ChatOfertaComponent} />
        </Stack.Navigator>
    );
}

function CarritoStack() {
    const { t } = useTranslation();
    return (
        <Stack.Navigator id="CarritoStack" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="CarritoScreen" component={CarritoComponent} options={({ navigation }) => headerOptions(t('Navigation.MiCarrito'), navigation)} />
            <Stack.Screen name="DetalleCamiseta" component={DetalleCamisetaComponent} options={{ title: t('Navigation.DetalleProducto') }} />
        </Stack.Navigator>
    );
}

function QuienesSomosStack() {
    const { t } = useTranslation();
    return (
        <Stack.Navigator id="QuienesSomosStack" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="QuienesSomos" component={QuienesSomosComponent} options={({ navigation }) => headerOptions(t('Navigation.QuienesSomos'), navigation)} />
        </Stack.Navigator>
    );
}

function ContactoStack() {
    const { t } = useTranslation();
    return (
        <Stack.Navigator id="ContactoStack" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Contacto" component={ContactoComponent} options={({ navigation }) => headerOptions(t('Navigation.Contacto'), navigation)} />
        </Stack.Navigator>
    );
}

function AuthStack() {
    return <Stack.Navigator id="AuthStack" screenOptions={{ headerShown: false }}><Stack.Screen name="Autenticacion" component={AuthScreen} /></Stack.Navigator>;
}

function ConfiguracionStack() {
    const { t } = useTranslation();
    return (
        <Stack.Navigator id="ConfiguracionStack" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Configuracion" component={ConfiguracionComponent} options={({ navigation }) => headerOptions(t('Navigation.Configuracion'), navigation)} />
        </Stack.Navigator>
    );
}

function SubirProductoStack() {
    const { t } = useTranslation();
    return (
        <Stack.Navigator id="SubirProductoStack" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SubirProducto" component={SubirProductoScreen} options={({ navigation }) => headerOptions(t('Navigation.PublicarProducto'), navigation)} />
        </Stack.Navigator>
    );
}

export default function AppNavigator() {
    const { t } = useTranslation();
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
                        headerStyle: { backgroundColor: '#001222', elevation: 0, shadowOpacity: 0 },
                        headerTintColor: '#fff',
                        headerTitleAlign: 'center',
                        drawerStyle: { backgroundColor: colorTiendaClaro },
                        drawerActiveTintColor: colorTiendaAcento,
                        drawerActiveBackgroundColor: 'rgba(251,133,0,0.12)',
                        drawerInactiveTintColor: colorTiendaOscuro,
                        drawerItemStyle: { borderRadius: 10, marginHorizontal: 8, marginVertical: 2 },
                        drawerLabelStyle: { fontSize: 15, fontWeight: '600', marginLeft: -12 },
                        headerRight: () => (
                            estaLogueado ? (
                                <TouchableOpacity onPress={() => navigation.navigate('Acceso usuario')}>
                                    <MaterialCommunityIcons name="account-check" size={28} color="green" style={{marginRight: 15}} />
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity style={styles.botonRegistroHeader} onPress={() => navigation.navigate('Acceso usuario')}>
                                    <Text style={{color: 'white', fontWeight: 'bold', fontSize:12}}>{t('Navigation.Registrarse')}</Text>
                                </TouchableOpacity>
                            )
                        ),
                    })}
                >
                    <Drawer.Screen name="Inicio" component={HomeStack} options={{ title: t('Navigation.Inicio'), drawerIcon: ({ color, size }) => (<MaterialCommunityIcons name="home" color={color} size={size} />) }} />
                    <Drawer.Screen name="Camisetas" component={CatalogoStack} options={{ title: t('Navigation.Camisetas'), drawerIcon: ({ color, size }) => (<MaterialCommunityIcons name="tshirt-crew" color={color} size={size} />) }} />
                    <Drawer.Screen name="Mi Carrito" component={CarritoStack} options={{ title: t('Navigation.MiCarrito'), drawerIcon: ({ color, size }) => (<MaterialCommunityIcons name="cart" color={color} size={size} />) }} />
                    <Drawer.Screen name="Mis Chats" component={ChatsStack} options={{ title: t('Navigation.MisChats'), drawerIcon: ({ color, size }) => (<MaterialCommunityIcons name="chat" color={color} size={size} />) }} />
                    <Drawer.Screen name="Mis Ventas" component={MisVentasStack} options={{ title: t('Navigation.MisVentas'), drawerIcon: ({ color, size }) => (<MaterialCommunityIcons name="tag-outline" color={color} size={size} />) }} />
                    <Drawer.Screen name="Mis Ofertas" component={MisOfertasStack} options={{ title: t('Navigation.MisOfertas'), drawerIcon: ({ color, size }) => (<MaterialCommunityIcons name="tag-heart-outline" color={color} size={size} />) }} />
                    <Drawer.Screen name="Quienes Somos" component={QuienesSomosStack} options={{ title: t('Navigation.QuienesSomos'), drawerIcon: ({ color, size }) => (<MaterialCommunityIcons name="information" color={color} size={size} />) }} />
                    <Drawer.Screen name="Contacto" component={ContactoStack} options={{ title: t('Navigation.Contacto'), drawerIcon: ({ color, size }) => (<MaterialCommunityIcons name="phone" color={color} size={size} />) }} />
                    <Drawer.Screen name="Acceso usuario" component={AuthStack} options={{ drawerItemStyle: { display: 'none' }, drawerIcon: ({ color, size }) => (<MaterialCommunityIcons name="account" color={color} size={size} />) }} />
                    <Drawer.Screen name="Publicar Producto" component={SubirProductoStack} options={{ title: t('Navigation.PublicarProducto'), drawerIcon: ({ color, size }) => (<MaterialCommunityIcons name="upload" color={color} size={size} />) }} />
                    <Drawer.Screen name="Configuracion" component={ConfiguracionStack} options={{ title: t('Navigation.Configuracion'), drawerIcon: ({ color, size }) => (<MaterialCommunityIcons name="cog" color={color} size={size} />) }} />
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
        borderBottomWidth: 3,
        borderBottomColor: colorTiendaAcento,
    },
    drawerHeaderText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    drawerHeaderSubtitle: {
        color: colorTiendaAcento,
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        marginTop: 2,
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
