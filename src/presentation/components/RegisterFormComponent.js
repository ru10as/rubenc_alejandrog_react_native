import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { registrarUsuarioYNotificaciones } from '../../redux/ActionCreators';
import { connect } from 'react-redux';

const mapDispatchToProps = dispatch => ({
    registrar: (email, password) => dispatch(registrarUsuarioYNotificaciones(email, password))
});

const RegisterFormComponent = ({ navigation, registrar }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const { t } = useTranslation();
    
    const handleRegister = async () => {
        setErrorMsg(null); 

        // Validaciones básicas
        if (!email || !password || !confirmPassword) {
            setErrorMsg(t("RegisterForm.register_error_campos"));
            return;
        }

        if (password !== confirmPassword) {
            setErrorMsg(t("RegisterForm.register_error_no_coinciden"));
            return;
        }

        setLoading(true); // Bloqueamos el botón y mostramos spinner
        try {
            await registrar(email, password);
            navigation.navigate('Inicio');
        } catch (error) {
            console.error("Error detallado de Firebase:", error);
            setErrorMsg(t("RegisterForm.register_error_registro"));
        } finally {
            setLoading(false); // Liberamos el botón
        }
    };

    return (
        <View style={styles.innerContainer}>
            <Text variant="titleLarge" style={styles.label}>{t("RegisterForm.register_titulo")}</Text>
            
            <TextInput 
                label={t("RegisterForm.register_email")}
                value={email}
                onChangeText={(text) => { setEmail(text); setErrorMsg(null); }}
                style={styles.input}
                mode="outlined"
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput 
                label={t("RegisterForm.register_password")}
                value={password}
                onChangeText={(text) => { setPassword(text); setErrorMsg(null); }}
                style={styles.input}
                mode="outlined"
                secureTextEntry
            />

            <TextInput 
                label={t("RegisterForm.register_repeat_password")}
                value={confirmPassword}
                onChangeText={(text) => { setConfirmPassword(text); setErrorMsg(null); }}
                style={styles.input}
                mode="outlined"
                secureTextEntry
            />

            {errorMsg && (
                <HelperText type="error" visible={true} style={{ textAlign: 'center' }}>
                    {errorMsg}
                </HelperText>
            )}
            
            <Button 
                mode="contained" 
                onPress={handleRegister} 
                loading={loading} 
                disabled={loading}
                style={styles.boton}
                buttonColor="#f44336"
            >
                {t("RegisterForm.register_boton_empezar")}
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    innerContainer: { 
        padding: 20 
    },
    label: { 
        fontWeight: 'bold', 
        marginBottom: 20, 
        textAlign: 'center' 
    },
    input: {
        marginBottom: 10,
        backgroundColor: '#fff'
    },
    boton: {
        marginTop: 10,
        paddingVertical: 5
    }
});

export default connect(null, mapDispatchToProps)(RegisterFormComponent);