import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { signUp } from '../../redux/ActionCreators';

import { registrarTokenPush } from '../../comun/notificaciones';
import { auth } from '../../api/firebaseConfig';

const RegisterFormComponent = ({ navigation }) => {
    // Estados locales para gestionar la entrada de datos del usuario
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // Hook de Redux para ejecutar la lógica de registro global
    const dispatch = useDispatch();
    
    
    const handleRegister = async () => {
        // 1. VALIDACIÓN PREVIA: Comprobar que no haya campos vacíos
        if (!email || !password || !confirmPassword) {
            Alert.alert("Error", "Por favor, rellena todos los campos.");
            return;
        }

        // 2. VALIDACIÓN DE CONSISTENCIA: Comprobar que las contraseñas coincidan
        if (password !== confirmPassword) {
            Alert.alert("Error", "Las contraseñas no coinciden.");
            return;
        }

        try {
            // 3. REGISTRO EN FIREBASE: Creamos el usuario en la base de datos
            await dispatch(signUp(email, password));
            
            // 4. REGISTRO DE TOKEN PUSH (Notificaciones)
            // Tras el registro exitoso, Firebase nos autentica automáticamente.
            // Aprovechamos esto para registrar el token de este móvil en Firestore 
            // asociado al UID del nuevo usuario.
            if (auth.currentUser) {
                await registrarTokenPush(auth.currentUser.uid);
            }
            
            // 5. NAVEGACIÓN: Enviamos al usuario a la pantalla principal
            navigation.navigate('Inicio');
        } catch (error) {
            // 6. GESTIÓN DE ERRORES: Alertamos si el email ya existe o hay problemas de red
            Alert.alert("Error en Registro", "No se pudo crear la cuenta. Prueba con otro email.");
        }
    };

    return (
        <View style={styles.innerContainer}>
            <Text style={styles.label}>Crea tu cuenta</Text>
            <TextInput 
                placeholder="Correo electrónico" 
                onChangeText={setEmail} 
                style={styles.input} 
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <TextInput 
                placeholder="Contraseña" 
                secureTextEntry 
                onChangeText={setPassword} 
                style={styles.input} 
            />
            <TextInput 
                placeholder="Repetir contraseña" 
                secureTextEntry 
                onChangeText={setConfirmPassword} 
                style={styles.input} 
            />
            <View style={{ marginTop: 10 }}>
                <Button title="Empezar" onPress={handleRegister} color="#f44336" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
        color: '#000',
    },
});

export default RegisterFormComponent;