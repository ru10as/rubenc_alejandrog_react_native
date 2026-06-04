import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { signUp } from '../../redux/ActionCreators';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface Props {
    navigation: NativeStackNavigationProp<any, any>;
}

const RegisterScreen = ({ navigation }: Props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch<any>();

    const validateEmail = (email: string) => {
        return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    };

    const handleRegister = async () => {
        if (!validateEmail(email)) {
            Alert.alert("Error", "Por favor, introduce un email válido");
            return;
        }
        if (password.length < 6) {
            Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
            return;
        }

        setLoading(true);
        try {
            // Esperamos a que la acción de registro termine
            await dispatch(signUp(email, password));
            // Si no hubo errores, navegamos
            navigation.navigate('Inicio');
        } catch (error: any) {
            Alert.alert("Error en Registro", error.message || "No se pudo crear la cuenta");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Crear Cuenta</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={setEmail}
                value={email}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                secureTextEntry={true}
                onChangeText={setPassword}
                value={password}
            />

            {loading ? (
                <ActivityIndicator size="large" color="#000" />
            ) : (
                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Registrarse</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: 'center', 
        padding: 20, 
        backgroundColor: '#f5f5f5' 
    },
    title: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        marginBottom: 20, 
        textAlign: 'center', 
        color: '#000' 
    },
    input: { 
        backgroundColor: '#fff', 
        padding: 15, 
        borderRadius: 10, 
        marginBottom: 15, 
        borderWidth: 1, 
        borderColor: '#ddd',
        color:'#000' 
    },
    button: { 
        backgroundColor: '#000', 
        padding: 15, 
        borderRadius: 10, 
        alignItems: 'center' 
    }, // Color negro aplicado
    buttonText: { 
        color: '#fff', 
        fontWeight: 'bold', 
        fontSize: 16 
    }
});

export default RegisterScreen;