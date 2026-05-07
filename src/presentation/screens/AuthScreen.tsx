import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
// LIBRERÍAS DE AUTH
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../../api/firebaseConfig";
import { logout } from "../../redux/ActionCreators";

// IMPORTANTE: Para que el navegador se cierre tras el login
WebBrowser.maybeCompleteAuthSession();

import LoginFormComponent from "../components/LoginFormComponent";
import RegisterFormComponent from "../components/RegisterFormComponent";

const AuthScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState(0);
  const user = useSelector((state: any) => state.usuario.user);
  const dispatch = useDispatch<any>();

  const [request, response, promptAsync] = Google.useAuthRequest({
    // El que ya tenías
    webClientId:
      "831451288833-aknfkn3cjjgqpe81alb2s97nh0eod44j.apps.googleusercontent.com",

    // AÑADE ESTA LÍNEA (Pega el mismo ID que arriba)
    androidClientId:
      "831451288833-aknfkn3cjjgqpe81alb2s97nh0eod44j.apps.googleusercontent.com",

    // Si vas a probar en iOS después, añade también esta con el mismo ID
    iosClientId:
      "831451288833-aknfkn3cjjgqpe81alb2s97nh0eod44j.apps.googleusercontent.com",

    //redirectUri: 'https://auth.expo.io/@alexisgn02/The12thMan',
    redirectUri: "https://auth.expo.io/@erpisha100/the-12th-man",
  });

  // ESCUCHADOR DE LA RESPUESTA DE GOOGLE
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);

      // Inyectamos la credencial en Firebase
      signInWithCredential(auth, credential)
        .then(() => {
          console.log("Logueado con Google correctamente");
          navigation.replace("Home");
        })
        .catch((error) => {
          console.error("Error al entrar con Google: ", error);
        });
    }
  }, [response]);

  if (user) {
    return (
      <View style={styles.container}>
        <Text style={styles.logo}>The 12th Man</Text>
        <View style={styles.profileContainer}>
          <Text style={styles.profileTitle}>Sesión iniciada</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => dispatch(logout())}
          >
            <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>The 12th Man</Text>

      {/* Selector de Pestañas */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 0 && styles.activeTab]}
          onPress={() => setActiveTab(0)}
        >
          <Text style={activeTab === 0 ? styles.activeTabText : styles.tabText}>
            Registrarse
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 1 && styles.activeTab]}
          onPress={() => setActiveTab(1)}
        >
          <Text style={activeTab === 1 ? styles.activeTabText : styles.tabText}>
            Ya tengo cuenta
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contenedor del Formulario */}
      <View style={styles.formContainer}>
        {activeTab === 0 ? (
          <RegisterFormComponent navigation={navigation} />
        ) : (
          <LoginFormComponent navigation={navigation} />
        )}

        {/* SEPARADOR VISUAL */}
        <View style={styles.separatorContainer}>
          <View style={styles.line} />
          <Text style={styles.separatorText}>O TAMBIÉN</Text>
          <View style={styles.line} />
        </View>

        {/* BOTÓN DE GOOGLE */}
        <TouchableOpacity
          style={[styles.googleButton, !request && { opacity: 0.5 }]}
          onPress={() => promptAsync()}
          disabled={!request}
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
