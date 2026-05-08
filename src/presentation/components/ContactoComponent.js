import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Card, Text, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
// Importamos el color de tu tienda para que sea coherente
import { colorTiendaOscuro } from '../../comun/comun';

function Contacto() {
    const { t } = useTranslation();

    return (
        <ScrollView style={styles.container}>
            <Card style={styles.card}>
                <Card.Title 
                    title={t('contacto_titulo')} 
                    titleStyle={[styles.cardTitle, { color: colorTiendaOscuro }]} 
                />
                <Card.Content>
                    <Text style={styles.saludo}>
                        {t('contacto_saludo')}
                    </Text>
                    
                    <Text style={styles.parrafo}>
                        {t('contacto_descripcion')}
                    </Text>
                    
                    <Text style={styles.parrafo}>
                        {t('contacto_despedida')}
                    </Text>
                    
                    <Divider style={styles.linea} />
                    
                    <Text style={styles.datosDeContacto}>
                        <Text style={{ fontWeight: 'bold' }}>{t('tel')}:</Text> +34 600 123 456
                    </Text>
                    
                    <Text style={styles.datosDeContacto}>
                        <Text style={{ fontWeight: 'bold' }}>{t('email')}:</Text> soporte@the12thman.com
                    </Text>
                </Card.Content>
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    card: { margin: 15, borderRadius: 15, paddingVertical: 10 },
    cardTitle: { fontWeight: 'bold', fontSize: 28, textAlign: 'center' },
    saludo: { fontSize: 20, fontWeight: '600', marginBottom: 15, textAlign: 'center' },
    parrafo: { marginBottom: 12, lineHeight: 22, textAlign: 'justify', color: '#444' },
    datosDeContacto: { marginTop: 8, fontSize: 16 },
    linea: { marginVertical: 20, height: 1, backgroundColor: '#ddd' },
});

export default Contacto;