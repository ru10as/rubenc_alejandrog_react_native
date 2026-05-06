import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/ActionCreators'; // Asegúrate de que la ruta es correcta

const LoginFormComponent = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    const handleLogin = () => {
        // Validación básica
        if (!email || !password) {
            Alert.alert("Error", "Por favor, introduce tu email y contraseña.");
            return;
        }

        // Disparamos la acción de login de Redux
        dispatch(login(email, password));
    };

    return (
        <View style={styles.innerContainer}>
            <Text style={styles.label}>Identifícate para jugar</Text>
            
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
                autoCapitalize="none"
            />
            
            <View style={{ marginTop: 10 }}>
                <Button title="Entrar" onPress={handleLogin} color="#f44336" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    innerContainer: {
        width: '100%',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        textAlign: 'center'
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
    },
});

export default LoginFormComponent;