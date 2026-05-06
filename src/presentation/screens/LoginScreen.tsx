import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/ActionCreators';
// Añadimos la importación del tipo para la navegación
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface Props {
    navigation: NativeStackNavigationProp<any, any>;
}

const LoginScreen = ({ navigation }: Props) => {
    const [email, setEmail] = useState(''); // Iniciamos el estado 
    const [password, setPassword] = useState(''); // Iniciamos el estado de la contra
    const dispatch = useDispatch<any>(); // El <any> evita quejas con dispatch asíncronos

    const handleLogin = async () => {
        if (email !== '' && password !== '') {
            try {
                // 2. Esperamos a que el dispatch termine
                await dispatch(login(email, password));
                
                // Navegar al éxito
                Alert.alert("Éxito", "Bienvenido a la tienda"); // Esto habria que cambiarlo por otra cosa que no sea alerta
                navigation.navigate('Inicio'); // Montamos la pantalla que habéis etiquetado como 'Inicio' en vuestro Navigator.

            } catch (error: any) {
                // 4. Si el login falla, avisamos al usuario
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
                keyboardType="email-address" // Mejora la experiencia de usuario
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