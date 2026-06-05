import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { Text, Button, Avatar, Surface, Divider, IconButton, Portal, Dialog, TextInput } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

const DetalleCamisetaSMano = ({ route, navigation }) => {
    const { t, i18n } = useTranslation();
    const { camiseta } = route.params;
    const nombre = camiseta.nombres?.[i18n.language] || camiseta.nombres?.es || camiseta.nombre || '';
    const descripcion = camiseta.descripciones?.[i18n.language] || camiseta.descripciones?.es || camiseta.descripcion || '';
    const vendedorId = camiseta.creadoPor || camiseta.vendedorId;
    const usuario = useSelector((state) => state.usuario?.user);
    const [visible, setVisible] = useState(false);
    const [montoOferta, setMontoOferta] = useState('');

    const abrirChat = () => {
        if (!usuario?.uid) {
            Alert.alert(t('chat.login_titulo'), t('chat.login_msg'));
            return;
        }
        if (usuario.uid === vendedorId) {
            Alert.alert(t('chat.aviso_titulo'), t('chat.propio_articulo'));
            return;
        }

        const chatId = `${camiseta.id}_${usuario.uid}`;
        navigation.navigate('Chat', {
            chatId,
            compradorId: usuario.uid,
            compradorNombre: usuario.displayName || usuario.email || 'Usuario',
            vendedorId,
            vendedorNombre: camiseta.vendedorNombre,
            camiseta: { id: camiseta.id, nombre, imagen: camiseta.imagen },
        });
    };

    const enviarOfertaAFirebase = async () => {
        if (!montoOferta || isNaN(montoOferta)) {
            Alert.alert(
                t('detalleCamisetaSMano.error_titulo'),
                t('detalleCamisetaSMano.error_precio_invalido')
            );
            return;
        }

        const db = getFirestore();
        try {
            await addDoc(collection(db, "ofertas"), {
                camisetaId: camiseta.id,
                vendedorId: vendedorId,
                compradorId: usuario?.uid || 'anonimo',
                nombreComprador: usuario?.displayName || usuario?.email || 'Usuario',
                monto: parseFloat(montoOferta),
                estado: 'pendiente',
                fecha: new Date().toISOString()
            });
            
            setVisible(false);
            setMontoOferta('');
            Alert.alert(
                t('detalleCamisetaSMano.exito_titulo'),
                t('detalleCamisetaSMano.exito_oferta_enviada')
            );
        } catch (error) {
            console.error("Error al enviar oferta: ", error);
            Alert.alert(
                t('detalleCamisetaSMano.error_titulo'),
                t('detalleCamisetaSMano.error_envio')
            );
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: camiseta.imagen }} style={styles.imagen} />

            <View style={styles.contenido}>
                <Surface style={styles.tarjetaVendedor} elevation={2}>
                    <Avatar.Text size={50} label={camiseta.vendedorNombre?.[0] || 'U'} />
                    <View style={styles.infoVendedor}>
                        <Text style={styles.nombreVendedor}>{camiseta.vendedorNombre}</Text>
                        <Text style={styles.valoracion}>⭐ 4.8 (12 ventas)</Text>
                    </View>
                    <IconButton icon="message-text" onPress={abrirChat} />
                </Surface>

                <Text style={styles.titulo}>{nombre}</Text>
                <Text style={styles.precio}>{camiseta.precio} €</Text>
                <Text style={styles.descripcion}>{descripcion}</Text>

                <Divider style={styles.divisor} />

                <View style={styles.acciones}>
                    <Button mode="contained" style={styles.btnOferta} onPress={() => setVisible(true)}>
                        {t('detalleCamisetaSMano.oferta')}
                    </Button>
                </View>
            </View>

            <Portal>
                <Dialog visible={visible} onDismiss={() => setVisible(false)}>
                    <Dialog.Title>{t('detalleCamisetaSMano.dialog_titulo')}</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            label={t('detalleCamisetaSMano.dialog_input')}
                            keyboardType="numeric"
                            value={montoOferta}
                            onChangeText={setMontoOferta}
                            mode="outlined"
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setVisible(false)}>{t('detalleCamisetaSMano.dialog_cancelar')}</Button>
                        <Button onPress={enviarOfertaAFirebase}>{t('detalleCamisetaSMano.dialog_enviar')}</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    imagen: { width: '100%', height: 300 },
    contenido: { padding: 20 },
    tarjetaVendedor: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 15, backgroundColor: '#f9f9f9', marginBottom: 20 },
    infoVendedor: { flex: 1, marginLeft: 15 },
    nombreVendedor: { fontWeight: 'bold', fontSize: 16 },
    valoracion: { color: '#666', fontSize: 12 },
    titulo: { fontSize: 22, fontWeight: 'bold' },
    precio: { fontSize: 20, color: '#6200ee', marginVertical: 10, fontWeight: 'bold' },
    descripcion: { fontSize: 14, color: '#555', lineHeight: 20 },
    divisor: { marginVertical: 20 },
    acciones: { gap: 10 },
    btnOferta: { paddingVertical: 5 },
    btnChat: { paddingVertical: 5 }
});

export default DetalleCamisetaSMano;