import React from 'react';
import { ScrollView, StyleSheet, ImageBackground, View, Linking } from 'react-native';
import { Card, Text, Divider, Button, Avatar, List } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { colorTiendaOscuro } from '../../comun/comun';

function Contacto() {
    const { t } = useTranslation();
    const abrirEnlace = (url) => Linking.openURL(url);

    return (
        <ImageBackground 
            source={{ uri: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000' }}
            style={styles.background}
            blurRadius={2}
        >
            <ScrollView contentContainerStyle={styles.container}>
                
                <View style={styles.header}>
                    <Avatar.Icon size={80} icon="soccer" backgroundColor={colorTiendaOscuro} />
                    <Text style={styles.tituloApp}>THE 12th MAN</Text>
                    <Text style={styles.subtituloApp}>{t('contactoComponent.titulo')}</Text>
                </View>

                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.saludo}>{t('contactoComponent.saludo')}</Text>
                        <Text style={styles.parrafo}>{t('contactoComponent.descripcion')}</Text>
                        
                        <Divider style={styles.linea} />

                        <List.Item
                            title={t('contactoComponent.tel')}
                            description="+34 600 123 456"
                            left={props => <List.Icon {...props} icon="phone" color={colorTiendaOscuro} />}
                            onPress={() => abrirEnlace('tel:+34600123456')}
                            style={styles.listItem}
                        />
                        
                        <List.Item
                            title={t('contactoComponent.email')}
                            description="soporte@the12thman.com"
                            left={props => <List.Icon {...props} icon="email" color={colorTiendaOscuro} />}
                            onPress={() => abrirEnlace('mailto:soporte@the12thman.com')}
                            style={styles.listItem}
                        />

                        <Divider style={styles.linea} />

                        <Text style={styles.despedida}>{t('contactoComponent.despedida')}</Text>
                        
                        <Button 
                            mode="contained" 
                            style={styles.botonSocial}
                            buttonColor={colorTiendaOscuro}
                            icon="instagram"
                            onPress={() => {}}>
                            {t('contactoComponent.follow')}
                        </Button>
                    </Card.Content>
                </Card>
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1, resizeMode: 'cover' },
    container: { paddingBottom: 30 },
    header: {alignItems: 'center',marginTop: 40,marginBottom: 20,},
    tituloApp: {fontSize: 32,fontWeight: '900',color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,marginTop: 10},
    subtituloApp: {fontSize: 18,color: '#ddd',letterSpacing: 2,fontWeight: 'bold'},
    card: { marginHorizontal: 20,borderRadius: 20, backgroundColor: 'rgba(255, 255, 255, 0.92)',elevation: 10},
    saludo: {fontSize: 22,fontWeight: 'bold',color: colorTiendaOscuro,textAlign: 'center',marginBottom: 10 },
    parrafo: { fontSize: 15, lineHeight: 22,textAlign: 'center',color: '#333',paddingHorizontal: 10},
    linea: { marginVertical: 15, height: 1.5, opacity: 0.5 },
    listItem: {backgroundColor: '#f9f9f9',borderRadius: 10,marginBottom: 8},
    despedida: {fontSize: 18,fontWeight: 'bold',textAlign: 'center',marginVertical: 15,fontStyle: 'italic'},
    botonSocial: {marginTop: 10,borderRadius: 10}
});

export default Contacto;