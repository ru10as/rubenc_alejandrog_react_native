import React from 'react';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Platform, StyleSheet, Image, Text, Pressable } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { colorTiendaOscuro, colorTiendaClaro } from '../../comun/comun';
import HomeComponent from '../components/HomeComponent';
import CatalogoComponent from '../components/CatalogoComponent';
import DetalleCamisetaComponent from '../components/DetalleCamisetaComponent';
import QuienesSomosComponent from '../components/QuienesSomosComponent';
import ContactoComponent from '../components/ContactoComponent';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const screenOptions = {
    headerTitleAlign: 'center' as const,
    headerTintColor: '#fff',
    headerStyle: { backgroundColor: colorTiendaOscuro },
};

function BotonMenu({ onPress }: { onPress: () => void }) {
    return (
        <Pressable onPress={onPress} hitSlop={8}>
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
        <Stack.Navigator screenOptions={screenOptions}>
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
        <Stack.Navigator screenOptions={screenOptions}>
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
        </Stack.Navigator>
    );
}

function QuienesSomosStack() {
    return (
        <Stack.Navigator screenOptions={screenOptions}>
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
        <Stack.Navigator screenOptions={screenOptions}>
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
        <Stack.Navigator screenOptions={screenOptions}>
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={({ navigation }) => headerOptions('Acceso Jugadores', navigation)}
            />
            <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ title: 'Registro de Cantera' }}
            />
        </Stack.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <View style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight }}>
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
                        name="Mi Cuenta"
                        component={AuthStack}
                        options={{
                            drawerIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="account" color={color} size={size} />
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
});
