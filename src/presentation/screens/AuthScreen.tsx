import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { statusCodes } from '@react-native-google-signin/google-signin';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { loginWithGoogle } from '../../redux/ActionCreators';

import LoginScreen from './LoginScreen';
import RegisterFormComponent from '../components/RegisterFormComponent';

const AuthScreen = ({ navigation }: any) => {
    const [activeTab, setActiveTab] = useState(0);
    const [googleLoading, setGoogleLoading] = useState(false);
    const dispatch = useDispatch<any>();
    const usuarioLogueado = useSelector((state: any) => state.usuario?.user);

    // Si el usuario ya está logueado y aterriza aquí (p.ej. por el header), lo mandamos a Inicio.
    useFocusEffect(
        React.useCallback(() => {
            if (usuarioLogueado) {
                navigation.navigate('Inicio');
            }
        }, [usuarioLogueado, navigation])
    );

    const onGoogleButtonPress = async () => {
        if (googleLoading) return;
        setGoogleLoading(true);
        try {
            await dispatch(loginWithGoogle());
            navigation.navigate('Inicio');
        } catch (error: any) {
            if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
                // Usuario canceló: no avisamos.
            } else if (error?.code === statusCodes.IN_PROGRESS) {
                Alert.alert('Espera', 'Ya hay un inicio de sesión en curso.');
            } else if (error?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                Alert.alert('Google Play', 'Necesitas actualizar Google Play Services.');
            } else {
                Alert.alert('Error con Google', error?.message ?? 'No se pudo iniciar sesión.');
                console.error('Error al entrar con Google:', error);
            }
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>The 12th Man</Text>

            {/* Selector de Pestañas */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 0 && styles.activeTab]}
                    onPress={() => setActiveTab(0)}
                >
                    <Text style={activeTab === 0 ? styles.activeTabText : styles.tabText}>Registrarse</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === 1 && styles.activeTab]}
                    onPress={() => setActiveTab(1)}
                >
                    <Text style={activeTab === 1 ? styles.activeTabText : styles.tabText}>Ya tengo cuenta</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
                {activeTab === 0 ? (
                    <RegisterFormComponent navigation={navigation} />
                ) : (
                    <LoginScreen navigation={navigation} />
                )}

                <View style={styles.separatorContainer}>
                    <View style={styles.line} />
                    <Text style={styles.separatorText}>O TAMBIÉN</Text>
                    <View style={styles.line} />
                </View>

                <TouchableOpacity
                    style={styles.googleButton}
                    onPress={onGoogleButtonPress}
                    disabled={googleLoading}
                >
                    {googleLoading
                        ? <ActivityIndicator />
                        : <Text style={styles.googleButtonText}>Continuar con Google</Text>}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 40,
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#f44336",
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#f44336",
  },
  tabText: { fontSize: 15, color: "#888" },
  activeTabText: { fontSize: 15, color: "#f44336", fontWeight: "bold" },
  formContainer: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#eee",
  },
  separatorText: {
    marginHorizontal: 10,
    color: "#888",
    fontSize: 12,
    fontWeight: "bold",
  },
  googleButton: {
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  googleButtonText: {
    color: "#555",
    fontWeight: "bold",
    fontSize: 16,
  },
  profileContainer: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 30,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  profileEmail: {
    fontSize: 15,
    color: "#666",
    marginBottom: 30,
  },
  logoutButton: {
    backgroundColor: "#f44336",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default AuthScreen;
