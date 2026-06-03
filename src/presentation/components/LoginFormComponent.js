import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/ActionCreators';

const LoginFormComponent = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert(t('login_error_titulo'), t('login_error_campos'));
            return;
        }

        try {
            await dispatch(login(email, password));
            navigation.navigate('Inicio');
        } catch (error) {
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