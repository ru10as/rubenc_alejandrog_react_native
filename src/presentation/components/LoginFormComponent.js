import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { loginYRegistrarNotificaciones } from '../../redux/ActionCreators';

const mapDispatchToProps = dispatch => ({
    login: (email, password) => dispatch(loginYRegistrarNotificaciones(email, password))
});

const LoginFormComponent = ({ navigation, login }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
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
            await login(email, password);
            navigation.navigate('Inicio');
        } catch (error) {
            console.error("Error detallado de Firebase:", error);
            setErrorMsg(t('LoginForm.login_error_credenciales'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.innerContainer}>
            <Text variant="titleMedium" style={styles.label}>
                {t('LoginForm.login_identificate')}
            </Text>
            
            <TextInput 
                label={t('LoginForm.login_email')} 
                value={email}
                onChangeText={(text) => { setEmail(text); setErrorMsg(null); }} 
                style={styles.input}
                mode="outlined"
                autoCapitalize="none"
                keyboardType="email-address"
                disabled={loading}
            />
            
            <TextInput 
                label={t('LoginForm.login_password')} 
                value={password}
                secureTextEntry 
                onChangeText={(text) => { setPassword(text); setErrorMsg(null); }} 
                style={styles.input}
                mode="outlined"
                autoCapitalize="none"
                disabled={loading}
            />
            
            {errorMsg && (
                <HelperText type="error" visible={true} style={{ textAlign: 'center' }}>
                    {errorMsg}
                </HelperText>
            )}
            
            <Button 
                mode="contained" 
                onPress={handleLogin} 
                style={styles.button}
                buttonColor={colorTiendaOscuro}
                loading={loading}
                disabled={loading}
            >
                {t('LoginForm.login_boton_entrar')}
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    innerContainer: { width: '100%', padding: 20 },
    label: { fontWeight: 'bold', color: '#333', marginBottom: 15, textAlign: 'center' },
    input: { marginBottom: 10, backgroundColor: '#fff' },
    button: { marginTop: 10, borderRadius: 5 }
});

export default connect(null, mapDispatchToProps)(LoginFormComponent);