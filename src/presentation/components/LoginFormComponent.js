import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/ActionCreators';
import { registrarTokenPush } from '../../comun/notificaciones';
import { auth } from '../../api/firebaseConfig';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';

const LoginFormComponent = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const colorTiendaOscuro = '#f44336';

    const handleLogin = async () => {
        setErrorMsg(null);

        if (!email || !password) {
            setErrorMsg(t('LoginForm.login_error_campos'));
            return;
        }

        setLoading(true);

        try {
            await dispatch(login(email, password));
            
            if (auth.currentUser) {
                console.log('UID del usuario:', auth.currentUser.uid);
                
                try {
                    await registrarTokenPush(auth.currentUser.uid);
                    console.log('Notificaciones registradas correctamente');
                } catch (notifError) {
                    console.error('Error al registrar notificaciones:', notifError);
                }
            }

            navigation.navigate('Inicio');
        } catch (error) {
            if (auth.currentUser) {
                navigation.navigate('Inicio');
            } else {
                setErrorMsg(t('LoginForm.login_error_credenciales'));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.innerContainer}>
            <Text style={styles.label}>{t('LoginForm.login_identificate')}</Text>
            
            {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
            
            <TextInput 
                placeholder={t('LoginForm.login_email')} 
                onChangeText={(text) => { setEmail(text); setErrorMsg(null); }} 
                style={styles.input} 
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
            />
            
            <TextInput 
                placeholder={t('LoginForm.login_password')} 
                secureTextEntry 
                onChangeText={(text) => { setPassword(text); setErrorMsg(null); }} 
                style={styles.input} 
                autoCapitalize="none"
                editable={!loading}
            />
            
            <Button 
                mode="contained" 
                onPress={handleLogin} 
                style={styles.button}
                buttonColor={colorTiendaOscuro}
                disabled={loading}
            >
                {loading ? <ActivityIndicator color="white" /> : t('LoginForm.login_boton_entrar')}
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    innerContainer: { 
        width: '100%',
        padding: 20 
    },
    label: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        color: '#333', 
        marginBottom: 15, 
        textAlign: 'center' 
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
        fontWeight: '600'
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
        color: '#000'
    },
    button: { 
        marginTop: 10, 
        borderRadius: 5, 
        height: 50, 
        justifyContent: 'center' 
    },
});

export default LoginFormComponent;