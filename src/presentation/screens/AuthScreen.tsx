import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../../api/firebaseConfig';

import LoginFormComponent from '../components/LoginFormComponent';
import RegisterFormComponent from '../components/RegisterFormComponent';

import { registrarTokenPush } from '../../comun/notificaciones';

const AuthScreen = ({ navigation }: any) => {
    const [activeTab, setActiveTab] = useState(0);

    // CONFIGURACIÓN INICIAL
    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '831451288833-aknfkn3cjjgqpe81alb2s97nh0eod44j.apps.googleusercontent.com',
        });
    }, []);

    // FUNCIÓN DE LOGIN
    const onGoogleButtonPress = async () => { 
        try {
            await GoogleSignin.hasPlayServices();
            const response = await GoogleSignin.signIn();
            const idToken = response.data?.idToken;

            if (!idToken) {
                throw new Error("No se obtuvo el ID Token de Google");
            }

            const credential = GoogleAuthProvider.credential(idToken); 
            const userCredential = await signInWithCredential(auth, credential); 
            
            await registrarTokenPush(userCredential.user.uid);
            
            console.log("Logueado con Google correctamente y token registrado");
            navigation.replace('Home');
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
