import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { List, Divider, Text, Avatar } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
    collection, query, where, orderBy, onSnapshot
} from 'firebase/firestore';
import { db } from '../../api/firebaseConfig';

const ChatsListComponent = ({ navigation }) => {
    const { t } = useTranslation();
    const usuario = useSelector((state) => state.usuario?.user);

    const [chats, setChats] = useState([]);

    useEffect(() => {
        if (!usuario?.uid) {
            setChats([]);
            return;
        }
        const q = query(
            collection(db, 'chats'),
            where('participantes', 'array-contains', usuario.uid),
            orderBy('ultimaFecha', 'desc')
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setChats(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        });
        return unsubscribe;
    }, [usuario?.uid]);

    const abrirChat = (chat) => {
        navigation.navigate('Chat', {
            chatId: chat.id,
            compradorId: chat.compradorId,
            compradorNombre: chat.compradorNombre,
            vendedorId: chat.vendedorId,
            vendedorNombre: chat.vendedorNombre,
            camiseta: {
                id: chat.camisetaId,
                nombre: chat.camisetaNombre,
                imagen: chat.camisetaImagen,
            },
        });
    };

    const renderChat = ({ item }) => {
        const soyVendedor = usuario?.uid === item.vendedorId;
        const nombreOtro = (soyVendedor ? item.compradorNombre : item.vendedorNombre) || 'Usuario';

        return (
            <>
                <List.Item
                    title={nombreOtro}
                    description={item.camisetaNombre ? `${item.camisetaNombre} · ${item.ultimoMensaje || ''}` : item.ultimoMensaje}
                    descriptionNumberOfLines={1}
                    onPress={() => abrirChat(item)}
                    left={() => (
                        item.camisetaImagen
                            ? <Avatar.Image size={48} source={{ uri: item.camisetaImagen }} style={styles.avatar} />
                            : <Avatar.Text size={48} label={nombreOtro[0]?.toUpperCase() || 'U'} style={styles.avatar} />
                    )}
                />
                <Divider />
            </>
        );
    };

    if (!usuario?.uid) {
        return (
            <View style={styles.vacioContainer}>
                <Text style={styles.vacio}>{t('chats.login')}</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={chats}
            renderItem={renderChat}
            keyExtractor={(item) => item.id}
            contentContainerStyle={chats.length === 0 && styles.flexVacio}
            ListEmptyComponent={
                <View style={styles.vacioContainer}>
                    <Text style={styles.vacio}>{t('chats.vacio')}</Text>
                </View>
            }
        />
    );
};

const styles = StyleSheet.create({
    avatar: { alignSelf: 'center', marginLeft: 12 },
    flexVacio: { flexGrow: 1 },
    vacioContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
    vacio: { color: '#999', textAlign: 'center' },
});

export default ChatsListComponent;
