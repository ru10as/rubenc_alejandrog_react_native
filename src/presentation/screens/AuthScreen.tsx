import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { statusCodes } from '@react-native-google-signin/google-signin';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { loginWithGoogle } from '../../redux/ActionCreators';
import { useTranslation } from 'react-i18next';
import { registrarTokenPush } from '../../comun/notificaciones';
import { auth } from '../../api/firebaseConfig'; 
import LoginFormComponent from '../components/LoginFormComponent';
import RegisterFormComponent from '../components/RegisterFormComponent';

const AuthScreen = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [googleLoading, setGoogleLoading] = useState(false);
    const dispatch = useDispatch<any>();
    const usuarioLogueado = useSelector((state: any) => state.usuario?.user);
    const { t } = useTranslation();
    
    useFocusEffect(
        useCallback(() => {
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
            
            const user = auth.currentUser;
            if (user?.uid) {
                await registrarTokenPush(user.uid);
            }

            navigation.navigate('Inicio');
        } catch (error) {
            if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
            } else {
                Alert.alert(
                    t('authScreen.error_google'), 
                    error?.message ?? t('authScreen.error_login_default')
                );
            }
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>The 12th Man</Text>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 0 && styles.activeTab]}
                    onPress={() => setActiveTab(0)}
                >
                    <Text style={activeTab === 0 ? styles.activeTabText : styles.tabText}>{t('authScreen.registrar')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === 1 && styles.activeTab]}
                    onPress={() => setActiveTab(1)}
                >
                    <Text style={activeTab === 1 ? styles.activeTabText : styles.tabText}>{t('authScreen.ya_tengo_cuenta')}</Text>
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
                    <Text style={styles.separatorText}>{t('authScreen.o_tambien')}</Text>
                    <View style={styles.line} />
                </View>

                <TouchableOpacity
                    style={styles.googleButton}
                    onPress={onGoogleButtonPress}
                    disabled={googleLoading}
                >
                    {googleLoading
                        ? <ActivityIndicator color="#555" />
                        : <Text style={styles.googleButtonText}>{t('authScreen.continuar_google')}</Text>}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f5f5", paddingTop: 40 },
    logo: { fontSize: 28, fontWeight: "bold", textAlign: "center", color: "#f44336", marginBottom: 20 },
    tabContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 10 },
    tab: { paddingVertical: 10, paddingHorizontal: 20, borderBottomWidth: 3, borderBottomColor: "transparent" },
    activeTab: { borderBottomColor: "#f44336" },
    tabText: { fontSize: 15, color: "#888" },
    activeTabText: { fontSize: 15, color: "#f44336", fontWeight: "bold" },
    formContainer: { backgroundColor: "white", marginHorizontal: 20, borderRadius: 12, padding: 20, elevation: 4 },
    separatorContainer: { flexDirection: "row", alignItems: "center", marginVertical: 20 },
    line: { flex: 1, height: 1, backgroundColor: "#eee" },
    separatorText: { marginHorizontal: 10, color: "#888", fontSize: 12, fontWeight: "bold" },
    googleButton: { backgroundColor: "#fff", borderColor: "#ddd", borderWidth: 1, borderRadius: 8, paddingVertical: 12, alignItems: "center", flexDirection: "row", justifyContent: "center" },
    googleButtonText: { color: "#555", fontWeight: "bold", fontSize: 16 },
});

export default AuthScreen;