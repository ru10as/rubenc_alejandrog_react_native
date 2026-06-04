import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { signUp } from '../../redux/ActionCreators';
import { registrarTokenPush } from '../../comun/notificaciones';
import { auth } from '../../api/firebaseConfig';

const RegisterFormComponent = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState(null); 
    
    const dispatch = useDispatch();
    
    const handleRegister = async () => {
        setErrorMsg(null); 

        if (!email || !password || !confirmPassword) {
            setErrorMsg("Por favor, rellena todos los campos.");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMsg("Las contraseñas no coinciden.");
            return;
        }

        try {
            console.log('Iniciando proceso de registro para:', email);
            await dispatch(signUp(email, password));
            
            if (auth.currentUser) {
                console.log('Registro exitoso. UID:', auth.currentUser.uid);
                
                // PEQUEÑO RETRASO PARA ASEGURAR INICIALIZACIÓN NATIVA
                console.log('Esperando inicialización nativa de Firebase...');
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                try {
                    console.log('Intentando registrar token de notificaciones...');
                    await registrarTokenPush(auth.currentUser.uid);
                    console.log('Notificaciones registradas correctamente en el registro.');
                } catch (notifError) {
                    console.error('Error al registrar notificaciones tras el registro:', notifError);
                }
            }
            
            navigation.navigate('Inicio');
        } catch (error) {
            console.error('Error durante el registro:', error);
            setErrorMsg("No se pudo crear la cuenta. Prueba con otro email.");
        }
    };

    return (
        <View style={styles.innerContainer}>
            <Text style={styles.label}>Crea tu cuenta</Text>
            
            {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
            
            <TextInput 
                placeholder="Correo electrónico" 
                onChangeText={(text) => { setEmail(text); setErrorMsg(null); }} 
                style={styles.input} 
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <TextInput 
                placeholder="Contraseña" 
                secureTextEntry 
                onChangeText={(text) => { setPassword(text); setErrorMsg(null); }} 
                style={styles.input} 
            />
            <TextInput 
                placeholder="Repetir contraseña" 
                secureTextEntry 
                onChangeText={(text) => { setConfirmPassword(text); setErrorMsg(null); }} 
                style={styles.input} 
            />
            <View style={{ marginTop: 10 }}>
                <Button title="Empezar" onPress={handleRegister} color="#f44336" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    innerContainer: { 
        padding: 20 
    },
    label: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        marginBottom: 15, 
        textAlign: 'center' 
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
        fontWeight: 'bold'
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