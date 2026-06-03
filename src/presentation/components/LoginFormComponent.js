import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/ActionCreators';
import { registrarTokenPush } from '../../comun/notificaciones'; // Esto es lo que vamos a emplear para las notificaciones
import { auth } from '../../api/firebaseConfig';// Instancia de auth para obtener el UID del usuario

const LoginFormComponent = ({ navigation }) => {
    // Definimos los estados locales para tomar los datos del formulario
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // Hook de Redux para disparar las acciones de autenticación
    const dispatch = useDispatch();

    const handleLogin = async () => {
        // 1. VALIDACIÓN: Evitamos procesos innecesarios si los campos están vacíos
        if (!email || !password) {
            Alert.alert(t('login_error_titulo'), t('login_error_campos'));
            return;
        }

        try {
            // 2. AUTENTICACIÓN: Intentamos iniciar sesión mediante Firebase/Redux
            await dispatch(login(email, password));
            
            // 3. REGISTRO DE NOTIFICACIONES PUSH
            // Una vez logueados, obtenemos el UID del usuario recién autenticado
            // y registramos/actualizamos su token de dispositivo en Firestore.
            if (auth.currentUser) {
                // Esto vincula el token del dispositivo con el usuario en la BD.
                // Es vital para que nuestro backend (Render) sepa a quién enviar las ofertas.
                await registrarTokenPush(auth.currentUser.uid);
            }

            // 4. NAVEGACIÓN: Si todo salió bien, redirigimos al usuario a la pantalla de Inicio
            navigation.navigate('Inicio');
        } catch (error) { // 5. GESTIÓN DE ERRORES: Alertamos si las credenciales son incorrectas
            Alert.alert(t('login_error_titulo'), t('login_error_credenciales'));
        }
    };

    return (
        <View style={styles.innerContainer}>
            <Text style={styles.label}>{t('login_identificate')}</Text>
            
            <TextInput 
                placeholder={t('login_email')} 
                onChangeText={setEmail} 
                style={styles.input} 
                autoCapitalize="none"
                keyboardType="email-address"
            />
            
            <TextInput 
                placeholder={t('login_password')} 
                secureTextEntry 
                onChangeText={setPassword} 
                style={styles.input} 
                autoCapitalize="none"
            />
            
            <Button 
                mode="contained" 
                onPress={handleLogin} 
                style={styles.button}
                buttonColor={colorTiendaOscuro}
            >
                {t('login_boton_entrar')}
            </Button>
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