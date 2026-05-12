import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// LIBRERÍA NATIVA (La que configuramos con el SHA-1)
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../../api/firebaseConfig'; // importamos la configuracion de firebase

import LoginFormComponent from '../components/LoginFormComponent';
import RegisterFormComponent from '../components/RegisterFormComponent';

const AuthScreen = ({ navigation }: any) => {
    const [activeTab, setActiveTab] = useState(0);

    // CONFIGURACIÓN INICIAL
    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '831451288833-aknfkn3cjjgqpe81alb2s97nh0eod44j.apps.googleusercontent.com', // Para que google sepa inicialmente quien le esta pidiendo permiso
            offlineAccess: true, // Para mantener la sesion aunque el usuario cierre la app
        });
    }, []);

    // FUNCIÓN DE LOGIN
    const onGoogleButtonPress = async () => { // Esta funcion la vamos a ejecutar cuando se pulsa el boton tipico
        try {
            await GoogleSignin.hasPlayServices(); // Comprobamos si el movil tiene los servicios de Google actualizados
            const response = await GoogleSignin.signIn(); // Aqui es donde va a aparecer la ventana de = seleccion de una cuenta 
            const idToken = response.data?.idToken; // De toda la información que devuelve Google (nombre, foto, email), extraemos el Token

            if (!idToken) { // Si por algún fallo de red no hay token, cortamos el proceso para evitar errores mayores.
                throw new Error("No se obtuvo el ID Token de Google");
            }

            const credential = GoogleAuthProvider.credential(idToken); // Convertimos la llave de Google en una llave compatible con Firebase
            await signInWithCredential(auth, credential); // Aquí es donde el usuario queda oficialmente registrado en vuestra base de datos.
            
            console.log("Logueado con Google correctamente"); // Sin mas, por depuracion
            navigation.replace('Home'); // Mandamos al usuario log a pagina principal
        } catch (error: any) {
            console.error("Error al entrar con Google: ", error);
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
                    <LoginFormComponent navigation={navigation} />
                )}

                <View style={styles.separatorContainer}>
                    <View style={styles.line} />
                    <Text style={styles.separatorText}>O TAMBIÉN</Text>
                    <View style={styles.line} />
                </View>

                {/* BOTÓN DE GOOGLE CORREGIDO */}
                <TouchableOpacity 
                    style={styles.googleButton} 
                    onPress={onGoogleButtonPress}
                >
                    <Text style={styles.googleButtonText}>Continuar con Google</Text>
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
  // ESTILOS NUEVOS PARA EL BOTÓN DE GOOGLE
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
