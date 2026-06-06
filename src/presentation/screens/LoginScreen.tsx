import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/ActionCreators';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { registrarTokenPush } from '../../comun/notificaciones';
import { auth } from '../../api/firebaseConfig';

interface Props {
    navigation: NativeStackNavigationProp<any, any>;
}

const LoginScreen = ({ navigation }: Props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch<any>();

    const handleLogin = async () => {
        if (email !== '' && password !== '') {
            try {
                await dispatch(login(email, password));
                
                if (auth.currentUser) {
                    try {
                        console.log('Login exitoso. Registrando token de notificaciones...');
                        await registrarTokenPush(auth.currentUser.uid);
                    } catch (notifError) {
                        console.error('Error al registrar notificaciones tras login:', notifError);
                    }
                }
                
                navigation.navigate('Inicio');

            } catch (error: any) {
                Alert.alert("Error de acceso", "Email o contraseña incorrectos");
                console.log("Error en login: ", error.message);
            }
        } else {
            Alert.alert("Error", "Introduce tus credenciales");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bienvenido de nuevo</Text>
            <TextInput
                style={styles.input}
                placeholder="Tu email"
                onChangeText={(text) => setEmail(text)}
                value={email}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Tu contraseña"
                secureTextEntry={true}
                onChangeText={(text) => setPassword(text)}
                value={password}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={{ marginTop: 20 }} 
                onPress={() => navigation.navigate('Register')}
            >
                <Text style={{ textAlign: 'center', color: '#007bff' }}>
                    ¿No tienes cuenta? Regístrate aquí
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
    button: { backgroundColor: '#28a745', padding: 15, borderRadius: 10, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default LoginScreen;