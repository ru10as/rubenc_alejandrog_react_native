import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { signUp } from '../../redux/ActionCreators';

const RegisterFormComponent = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const dispatch = useDispatch();

    const handleRegister = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert("Error", "Por favor, rellena todos los campos.");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Las contraseñas no coinciden.");
            return;
        }

        try {
            await dispatch(signUp(email, password));
            navigation.navigate('Inicio');
        } catch (error) {
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