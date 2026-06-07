import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { signUp } from '../../redux/ActionCreators';
import { registrarTokenPush } from '../../comun/notificaciones';
import { auth } from '../../api/firebaseConfig';
import { useTranslation } from 'react-i18next';

const RegisterFormComponent = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState(null); 
    const { t } = useTranslation();
    const dispatch = useDispatch();
    
    const handleRegister = async () => {
        setErrorMsg(null); 

        if (!email || !password || !confirmPassword) {
            setErrorMsg(t("RegisterForm.register_error_campos"));
            return;
        }

        if (password !== confirmPassword) {
            setErrorMsg(t("RegisterForm.register_error_no_coinciden"));
            return;
        }

        try {
            await dispatch(signUp(email, password));
            
            if (auth.currentUser) {
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                try {
                    await registrarTokenPush(auth.currentUser.uid);
                } catch (notifError) {
                    console.error('Error al registrar notificaciones:', notifError);
                }
            }
            
            navigation.navigate('Inicio');
        } catch (error) {
            setErrorMsg(t("RegisterForm.register_error_registro"));
        }
    };

    return (
        <View style={styles.innerContainer}>
            <Text style={styles.label}>{t("RegisterForm.register_titulo")}</Text>
            
            {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
            
            <TextInput 
                placeholder={t("RegisterForm.register_email")}
                onChangeText={(text) => { setEmail(text); setErrorMsg(null); }} 
                style={styles.input} 
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <TextInput 
                placeholder={t("RegisterForm.register_password")}
                secureTextEntry 
                onChangeText={(text) => { setPassword(text); setErrorMsg(null); }} 
                style={styles.input} 
            />
            <TextInput 
                placeholder={t("RegisterForm.register_repeat_password")}
                secureTextEntry 
                onChangeText={(text) => { setConfirmPassword(text); setErrorMsg(null); }} 
                style={styles.input} 
            />
            <View style={{ marginTop: 10 }}>
                <Button 
                    title={t("RegisterForm.register_boton_empezar")} 
                    onPress={handleRegister} 
                    color="#f44336" 
                />
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