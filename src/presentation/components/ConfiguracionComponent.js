import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Alert } from 'react-native';
import { List, Divider, Switch, Avatar, Text, Surface, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { colorTiendaOscuro } from '../../comun/comun';

const mapStateToProps = (state) => ({
    usuario: state.usuario?.user || null,
});

const SeccionConfiguracion = ({ usuario, navigation }) => {
    const { t, i18n } = useTranslation();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);

    const cambiarIdioma = (lang) => i18n.changeLanguage(lang);

    const confirmarLogout = () => {
        Alert.alert(
            t('configuracionComponent.logout_titulo'),
            t('configuracionComponent.logout_msg'),
            [
                { text: t('configuracionComponent.cancelar'), style: 'cancel' },
                { text: t('configuracionComponent.salir'), onPress: () => console.log('Logout'), style: 'destructive' }
            ]
        );
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            
            {/* 1. CABECERA */}
            <Surface style={styles.userCard} elevation={1}>
                <Avatar.Icon 
                    size={70} 
                    icon={usuario ? "account" : "account-off-outline"} 
                    style={{ backgroundColor: usuario ? colorTiendaOscuro : '#ccc' }}
                    color="white"
                />
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>
                        {usuario ? usuario.nombre : t('configuracionComponent.usuario_invitado')}
                    </Text>
                    {usuario ? (
                        <Text style={styles.userEmail}>{usuario.email}</Text>
                    ) : (
                        <Button 
                            mode="text" 
                            compact 
                            onPress={() => navigation.navigate('Login')}
                            labelStyle={{ color: colorTiendaOscuro, marginLeft: 0, paddingLeft: 0 }}
                        >
                            {t('configuracionComponent.iniciar_sesion')}
                        </Button>
                    )}
                </View>
            </Surface>

            {/* 2. SECCIÓN DE IDIOMA */}
            <List.Section>
                <List.Subheader style={styles.headerText}>{t('configuracionComponent.ajustes_generales')}</List.Subheader>
                <List.Accordion
                    title={t('configuracionComponent.idioma')}
                    left={props => <List.Icon {...props} icon="translate" />}
                >
                    <List.Item title="Español" onPress={() => cambiarIdioma('es')} 
                        right={p => i18n.language.startsWith('es') && <List.Icon {...p} icon="check" color="green" />} />
                    <List.Item title="English" onPress={() => cambiarIdioma('en')} 
                        right={p => i18n.language.startsWith('en') && <List.Icon {...p} icon="check" color="green" />} />
                    <List.Item title="Euskara" onPress={() => cambiarIdioma('eu')} 
                        right={p => i18n.language.startsWith('eu') && <List.Icon {...p} icon="check" color="green" />} />
                </List.Accordion>
            </List.Section>

            {/* 3. SECCIONES PRIVADAS*/}
            {usuario && (
                <>
                    <Divider style={styles.divider} />
                    <List.Section>
                        <List.Subheader style={styles.headerText}>{t('configuracionComponent.seccion_cuenta')}</List.Subheader>
                        <List.Item
                            title={t('configuracionComponent.perfil')}
                            left={props => <List.Icon {...props} icon="account-cog-outline" />}
                        />
                        <List.Item
                            title={t('configuracionComponent.notificaciones')}
                            left={props => <List.Icon {...props} icon="bell-outline" />}
                            right={() => <Switch value={notifications} onValueChange={setNotifications} color={colorTiendaOscuro} />}
                        />
                    </List.Section>
                </>
            )}

            <Divider style={styles.divider} />

            {/* 4. SOPORTE */}
            <List.Section>
                <List.Subheader style={styles.headerText}>{t('configuracionComponent.seccion_soporte')}</List.Subheader>
                <List.Item
                    title={t('configuracionComponent.ayuda', 'Ayuda')}
                    left={props => <List.Icon {...props} icon="help-circle-outline" />}
                />
                <List.Item
                    title={t('configuracionComponent.terminos', 'Legal')}
                    left={props => <List.Icon {...props} icon="file-document-outline" />}
                />
            </List.Section>

            {/* 5. LOGOUT (Solo si hay usuario) */}
            {usuario && (
                <List.Item
                    title={t('configuracionComponent.logout', 'Cerrar Sesión')}
                    titleStyle={{ color: '#d32f2f', fontWeight: 'bold' }}
                    left={props => <List.Icon {...props} icon="logout" color="#d32f2f" />}
                    onPress={confirmarLogout}
                />
            )}

            <Text style={styles.versionText}>v2.4.0 (The 12th Man)</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    userCard: { flexDirection: 'row', padding: 20, margin: 15, borderRadius: 12, alignItems: 'center', backgroundColor: '#fff' },
    userInfo: { marginLeft: 15 },
    userName: { fontSize: 18, fontWeight: 'bold' },
    userEmail: { color: '#777', fontSize: 13 },
    headerText: { fontWeight: 'bold', color: colorTiendaOscuro, fontSize: 12, textTransform: 'uppercase' },
    divider: { marginHorizontal: 20, opacity: 0.5 },
    versionText: { textAlign: 'center', color: '#bbb', fontSize: 10, marginVertical: 20 }
});

export default connect(mapStateToProps)(SeccionConfiguracion);